/**
 * AI Shopping Assistant Chat API Route
 * 
 * Endpoint: POST /api/chat
 * 
 * Accepts:
 * - message: string (user message)
 * - sessionId: string (optional, for guest users)
 * - cartContext: object (current cart state)
 * 
 * Streams back:
 * - text chunks with streaming responses
 * - tool calls and results
 */

import { NextRequest } from "next/server";
import {
  getConversationHistory,
  addMessageToHistory,
} from "@/lib/chat-session-store";
import { executeTool, ToolCall } from "@/lib/ai-tools";
import { auth } from "@/auth";

// Require GROQ_API_KEY explicitly — do not fall back to XAI_API_KEY to avoid provider/key mismatch
const GROQ_API_KEY = process.env.GROQ_API_KEY;
// Use the OpenAI-compatible path Groq expects for chat completions
const GROQ_API_URL = "https://api.groq.com/v1/chat/completions";

if (!GROQ_API_KEY) {
  console.warn(
    "GROQ_API_KEY not set. AI chat will not work. Set GROQ_API_KEY in .env.local or in Vercel Environment Variables"
  );
}

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are Hekto, a friendly and helpful shopping assistant for an e-commerce store.

Your role is to:
1. Help customers find products they're looking for
2. Provide product information and recommendations
3. Help customers add items to their cart
4. Answer questions about orders, shipping, returns, and policies
5. Guide customers through the checkout process

IMPORTANT RULES:
- Always be helpful, friendly, and professional
- When users want to buy something, help them search for it and offer to add to cart
- Use the search_products tool when users ask about products
- When showing a specific product, use get_product_details to show full info
- When users want to add to cart, use add_to_cart tool with product ID
- Help users track their orders with get_order_status tool
- Answer FAQ/policy questions with answer_faq tool
- When users are ready to buy, guide them to checkout with start_checkout tool
- Never pretend to place orders or charge cards - only use start_checkout for handoff
- Be concise but informative
- If unsure, ask clarifying questions

You have access to these tools:
- search_products: Find products by name, category, or tags
- get_product_details: Get full info about a specific product
- add_to_cart: Add items to the customer's cart
- get_order_status: Check order status for a customer
- answer_faq: Get answers to FAQ and policy questions
- start_checkout: Guide customer to checkout page (never charge!)

Current store info:
- Currency: NGN (Nigerian Naira)
- We ship to Bangladesh and neighboring countries
- Standard delivery: 5-7 business days`;

interface ChatRequest {
  message: string;
  sessionId?: string;
  cartContext?: any;
}

interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, any>;
}

interface TextBlock {
  type: "text";
  text: string;
}

interface Message {
  role: "user" | "assistant";
  content: string | (TextBlock | ToolUseBlock)[];
}

async function callGroqAPI(messages: Message[]): Promise<Response> {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Updated model to a Groq / Llama instant variant
      model: "llama-3.1-8b-instant",
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "search_products",
            description: "Search for products by name, category, or tags",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query (product name, category, etc)",
                },
                limit: {
                  type: "number",
                  description: "Max number of results (default 5)",
                  default: 5,
                },
              },
              required: ["query"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "get_product_details",
            description: "Get detailed information about a specific product",
            parameters: {
              type: "object",
              properties: {
                product_id: {
                  type: "string",
                  description: "The product ID",
                },
              },
              required: ["product_id"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "add_to_cart",
            description: "Add a product to the customer's cart",
            parameters: {
              type: "object",
              properties: {
                product_id: {
                  type: "string",
                  description: "The product ID to add",
                },
                quantity: {
                  type: "number",
                  description: "Quantity to add (default 1)",
                  default: 1,
                },
                color: {
                  type: "string",
                  description: "Color choice (optional)",
                },
                size: {
                  type: "string",
                  description: "Size choice (optional)",
                },
              },
              required: ["product_id"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "get_order_status",
            description: "Check order status for a customer",
            parameters: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  description: "Customer email address",
                },
              },
              required: ["email"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "answer_faq",
            description: "Answer frequently asked questions about policies, shipping, returns, etc",
            parameters: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                  description: "The customer's question",
                },
              },
              required: ["question"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "start_checkout",
            description: "Guide customer to checkout page. Never autonomously charge or place orders!",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Groq API error:", response.status, error);
    throw new Error(`Groq API error: ${response.status}`);
  }

  return response;
}

async function* parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<any> {
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            yield parsed;
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "GROQ_API_KEY not configured",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body: ChatRequest = await req.json();
    const { message, sessionId, cartContext } = body;

    if (!message || !sessionId) {
      return new Response(
        JSON.stringify({
          error: "Missing message or sessionId",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get conversation history
    const history = getConversationHistory(sessionId);

    // Add user message to history
    addMessageToHistory(sessionId, {
      role: "user",
      content: message,
    });

    // Prepare messages for Groq API
    const messages: Message[] = [
      { role: "user", content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      {
        role: "user",
        content: `${message}${cartContext ? `\n\n[Cart Context: ${JSON.stringify(cartContext)}]` : ""}`,
      },
    ];

    // Stream response from Groq API
    const groqResponse = await callGroqAPI(messages);
    const reader = groqResponse.body!.getReader();

    // Create a readable stream to send to client
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          let fullAssistantContent = "";
          let toolCalls: ToolCall[] = [];

          for await (const chunk of parseSSEStream(reader)) {
            const choice = chunk.choices?.[0];

            if (!choice) continue;

            // Handle text content
            if (choice.delta?.content) {
              fullAssistantContent += choice.delta.content;
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({
                    type: "content",
                    data: choice.delta.content,
                  })}\n\n`
                )
              );
            }

            // Handle tool calls
            if (choice.delta?.tool_use) {
              const toolUse = choice.delta.tool_use;
              if (toolUse.id && !toolCalls.find((t) => t.name === toolUse.name)) {
                toolCalls.push({
                  name: toolUse.name,
                  arguments: toolUse.input || {},
                });
              }
            }

            // Handle finish reason
            if (choice.finish_reason === "tool_calls") {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({
                    type: "tool_calls",
                    data: toolCalls,
                  })}\n\n`
                )
              );

              // Execute tools
              for (const tool of toolCalls) {
                try {
                  const result = await executeTool(tool, sessionId);
                  controller.enqueue(
                    new TextEncoder().encode(
                      `data: ${JSON.stringify({
                        type: "tool_result",
                        data: result,
                      })}\n\n`
                    )
                  );
                } catch (error) {
                  console.error("Tool execution error:", error);
                }
              }
            }

            if (choice.finish_reason === "stop") {
              // Save assistant message to history
              if (fullAssistantContent) {
                addMessageToHistory(sessionId, {
                  role: "assistant",
                  content: fullAssistantContent,
                });
              }

              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({
                    type: "done",
                  })}\n\n`
                )
              );
            }
          }

          controller.close();
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", {
      message: errorMessage,
      type: typeof error,
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
