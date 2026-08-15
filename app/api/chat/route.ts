/**
 * AI Shopping Assistant Chat API Route (Groq)
 *
 * Endpoint: POST /api/chat
 */

import { NextRequest } from "next/server";
import {
  getConversationHistory,
  addMessageToHistory,
  ChatMessage,
} from "@/lib/chat-session-store";
import { executeTool, ToolCall } from "@/lib/ai-tools";
import { auth } from "@/auth";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

if (!GROQ_API_KEY) {
  console.warn("GROQ_API_KEY not set in environment variables.");
}

// Tool schemas matching tools.ts parameters (snake_case)
const AI_TOOLS = [
  {
    type: "function",
    function: {
      name: "search_products",
      description: "Find products by name, category, or tags",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search term or phrase" },
          limit: { type: "number", description: "Number of products to return (default: 5)" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_product_details",
      description: "Get full info about a specific product",
      parameters: {
        type: "object",
        properties: {
          product_id: { type: "string", description: "Unique product ID" },
        },
        required: ["product_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_to_cart",
      description: "Add items to customer's cart",
      parameters: {
        type: "object",
        properties: {
          product_id: { type: "string", description: "Product ID" },
          quantity: { type: "number", description: "Quantity to add" },
          color: { type: "string", description: "Selected color variant" },
          size: { type: "string", description: "Selected size variant" },
        },
        required: ["product_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order_status",
      description: "Check order status for the authenticated customer",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "answer_faq",
      description: "Get answers to FAQ and policy questions",
      parameters: {
        type: "object",
        properties: {
          question: { type: "string", description: "Customer question or topic" },
        },
        required: ["question"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "start_checkout",
      description: "Guide customer to checkout page (never charge!)",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];

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
- Use search_products when users ask about products
- When showing a specific product, use get_product_details to show full info
- When users want to add to cart, use add_to_cart with product_id
- Help users track their orders with get_order_status
- Answer FAQ/policy questions with answer_faq
- When users are ready to buy, guide them with start_checkout
- Never pretend to place orders or charge cards - only use start_checkout for handoff
- Be concise but informative`;

interface CartContext {
  items?: Array<{
    productId: string;
    quantity: number;
    name?: string;
    price?: number;
  }>;
  total?: number;
}

interface ChatRequest {
  message: string;
  sessionId?: string;
  cartContext?: CartContext;
}

interface GroqMessage {
  role: string;
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: string;
    function: {
      name: string;
      arguments: string;
    };
  }>;
  tool_call_id?: string;
}

interface GroqRequestBody {
  model: string;
  messages: GroqMessage[];
  tools: typeof AI_TOOLS;
  tool_choice: string;
  stream: boolean;
  temperature: number;
  max_tokens: number;
}

async function callGroqAPI(messages: GroqMessage[], stream = true): Promise<Response> {
  const body: GroqRequestBody = {
    model: "llama-3.1-8b-instant",
    messages,
    tools: AI_TOOLS,
    tool_choice: "auto",
    stream,
    temperature: 0.7,
    max_tokens: 1000,
  };

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Groq API error:", res.status, err);
    throw new Error(`Groq API error: ${res.status} ${err}`);
  }

  return res;
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
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            yield JSON.parse(data);
          } catch (e) {
            // Ignore partial SSE chunks
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
        JSON.stringify({ error: "GROQ_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body: ChatRequest = await req.json();
    const { message, sessionId, cartContext } = body;

    if (!message || !sessionId) {
      return new Response(
        JSON.stringify({ error: "Missing message or sessionId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get authenticated session for secure operations
    const session = await auth();

    const history = getConversationHistory(sessionId);
    addMessageToHistory(sessionId, { role: "user", content: message });

    const messages: GroqMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: `${message}${cartContext ? `\n\n[Cart Context: ${JSON.stringify(cartContext)}]` : ""}` },
    ];

    const groqResponse = await callGroqAPI(messages, true);
    const reader = groqResponse.body!.getReader();

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          let fullAssistantContent = "";
          // Accumulate tool arguments by tool call array index
          const toolCallsMap: Record<number, { id: string; name: string; args: string }> = {};

          for await (const chunk of parseSSEStream(reader)) {
            const choice = chunk.choices?.[0];
            if (!choice) continue;

            if (choice.delta?.content) {
              fullAssistantContent += choice.delta.content;
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ type: "content", data: choice.delta.content })}\n\n`
                )
              );
            }

            if (choice.delta?.tool_calls) {
              for (const part of choice.delta.tool_calls) {
                const idx = part.index ?? 0;
                if (!toolCallsMap[idx]) {
                  toolCallsMap[idx] = { id: "", name: "", args: "" };
                }
                if (part.id) toolCallsMap[idx].id = part.id;
                if (part.function?.name) toolCallsMap[idx].name = part.function.name;
                if (part.function?.arguments) toolCallsMap[idx].args += part.function.arguments;
              }
            }

            if (choice.finish_reason === "tool_calls" || choice.finish_reason === "function_call") {
              const executedToolCalls = Object.values(toolCallsMap).map((tc) => {
                let parsedArgs = {};
                try {
                  parsedArgs = tc.args ? JSON.parse(tc.args) : {};
                } catch {
                  parsedArgs = { _raw: tc.args };
                }
                return {
                  id: tc.id,
                  name: tc.name,
                  arguments: parsedArgs,
                };
              });

              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ type: "tool_calls", data: executedToolCalls })}\n\n`
                )
              );

              const toolResults: { id: string; name: string; content: string }[] = [];
              for (const tool of executedToolCalls) {
                try {
                  const result = await executeTool(tool as ToolCall, sessionId, session);
                  toolResults.push({ id: tool.id, name: tool.name, content: result.content });
                  controller.enqueue(
                    new TextEncoder().encode(
                      `data: ${JSON.stringify({ type: "tool_result", data: result })}\n\n`
                    )
                  );
                } catch (err) {
                  console.error("Tool execution error:", err);
                  controller.enqueue(
                    new TextEncoder().encode(
                      `data: ${JSON.stringify({ type: "tool_result", data: { name: tool.name, content: "Tool execution error" } })}\n\n`
                    )
                  );
                }
              }

              // Bounded loop for iterative tool calling
              const MAX_ITERATIONS = 5;
              let followUpMessages: GroqMessage[] = [
                ...messages,
                {
                  role: "assistant",
                  content: null,
                  tool_calls: executedToolCalls.map((tc) => ({
                    id: tc.id,
                    type: "function",
                    function: {
                      name: tc.name,
                      arguments: JSON.stringify(tc.arguments),
                    },
                  })),
                },
                ...toolResults.map((r) => ({
                  role: "tool",
                  tool_call_id: r.id,
                  content: r.content,
                })),
              ];

              try {
                for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
                  const followRes = await callGroqAPI(followUpMessages, false);
                  const followJson = await followRes.json();
                  const followMessage = followJson.choices?.[0]?.message;

                  if (!followMessage) break;

                  // Check if response has further tool calls
                  if (followMessage.tool_calls && followMessage.tool_calls.length > 0) {
                    // Append assistant message with tool calls
                    followUpMessages.push({
                      role: "assistant",
                      content: followMessage.content || null,
                      tool_calls: followMessage.tool_calls,
                    });

                    // Stream tool calls to client
                    const nextToolCalls = followMessage.tool_calls.map((tc: any) => ({
                      id: tc.id,
                      name: tc.function.name,
                      arguments: JSON.parse(tc.function.arguments || "{}"),
                    }));

                    controller.enqueue(
                      new TextEncoder().encode(
                        `data: ${JSON.stringify({ type: "tool_calls", data: nextToolCalls })}\n\n`
                      )
                    );

                    // Execute all tool calls
                    const nextToolResults: { id: string; name: string; content: string }[] = [];
                    for (const tc of nextToolCalls) {
                      try {
                        const result = await executeTool(tc as ToolCall, sessionId, session);
                        nextToolResults.push({ id: tc.id, name: tc.name, content: result.content });
                        controller.enqueue(
                          new TextEncoder().encode(
                            `data: ${JSON.stringify({ type: "tool_result", data: result })}\n\n`
                          )
                        );
                      } catch (err) {
                        console.error("Tool execution error:", err);
                        controller.enqueue(
                          new TextEncoder().encode(
                            `data: ${JSON.stringify({ type: "tool_result", data: { name: tc.name, content: "Tool execution error" } })}\n\n`
                          )
                        );
                      }
                    }

                    // Append tool results
                    followUpMessages.push(
                      ...nextToolResults.map((r) => ({
                        role: "tool" as const,
                        tool_call_id: r.id,
                        content: r.content,
                      }))
                    );

                    // Continue loop for next iteration
                  } else {
                    // No more tool calls - response has plain content
                    const followText = followMessage.content || "";
                    if (followText) {
                      controller.enqueue(
                        new TextEncoder().encode(
                          `data: ${JSON.stringify({ type: "content", data: followText })}\n\n`
                        )
                      );
                      addMessageToHistory(sessionId, { role: "assistant", content: followText });
                    }
                    break; // Exit loop
                  }
                }

                controller.enqueue(
                  new TextEncoder().encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
                );
              } catch (err) {
                console.error("Follow-up completion failed:", err);
                controller.enqueue(
                  new TextEncoder().encode(
                    `data: ${JSON.stringify({ type: "error", message: "Follow-up completion failed" })}\n\n`
                  )
                );
              }
              break;
            }

            if (choice.finish_reason === "stop") {
              if (fullAssistantContent) {
                addMessageToHistory(sessionId, { role: "assistant", content: fullAssistantContent });
              }
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
              break;
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
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
          }
