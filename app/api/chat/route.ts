/**
 * AI Shopping Assistant Chat API Route (Groq)
 *
 * Endpoint: POST /api/chat
 *
 * Implements Groq streaming tool-calls handling:
 * - Accumulates choice.delta?.tool_calls fragments by call id
 * - Reconstructs arguments JSON after streaming
 * - Executes local tools and returns tool results to the model as role:"tool" messages
 * - Sends a second (non-streaming) Groq completion to let the assistant finish its response
 */

import { NextRequest } from "next/server";
import {
  getConversationHistory,
  addMessageToHistory,
} from "@/lib/chat-session-store";
import { executeTool, ToolCall } from "@/lib/ai-tools";
import { auth } from "@/auth";

// Require GROQ_API_KEY explicitly
const GROQ_API_KEY = process.env.GROQ_API_KEY;
// Use Groq's OpenAI-compatible chat/completions path (includes /openai)
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

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

interface ToolCallStreamPart {
  id: string;
  name: string;
  arguments?: string; // partial chunk
}

interface ToolBufferEntry {
  id: string;
  name: string;
  argParts: string[];
}

interface Message {
  role: "user" | "assistant" | "tool" | "system";
  name?: string; // for role: tool messages
  content: string;
}

async function callGroqAPI(messages: Message[], stream = true): Promise<Response> {
  const body: any = {
    model: "openai/gpt-oss-20b",
    messages: messages.map((m) => {
      const out: any = { role: m.role, content: m.content };
      if (m.name) out.name = m.name;
      return out;
    }),
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
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            yield parsed;
          } catch (e) {
            // ignore parse errors
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

    // Get conversation history
    const history = getConversationHistory(sessionId);

    // Add user message to history
    addMessageToHistory(sessionId, { role: "user", content: message });

    // Prepare messages for Groq API (system + history + user)
    const messages: Message[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: `${message}${cartContext ? `\n\n[Cart Context: ${JSON.stringify(cartContext)}]` : ""}` },
    ];

    // Stream response from Groq API
    const groqResponse = await callGroqAPI(messages, true);
    const reader = groqResponse.body!.getReader();

    // Create a readable stream to send to client
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          let fullAssistantContent = "";

          // Buffer tool call fragments by id
          const toolBuffers: Record<string, ToolBufferEntry> = {};
          let toolCallOrder: string[] = [];

          for await (const chunk of parseSSEStream(reader)) {
            const choice = chunk.choices?.[0];
            if (!choice) continue;

            // Handle text content
            if (choice.delta?.content) {
              fullAssistantContent += choice.delta.content;
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ type: "content", data: choice.delta.content })}\n\n`
                )
              );
            }

            // GROQ streams partial tool call pieces under choice.delta?.tool_calls
            if (choice.delta?.tool_calls) {
              const parts: ToolCallStreamPart[] = choice.delta.tool_calls;
              for (const part of parts) {
                if (!part || !part.id) continue;
                if (!toolBuffers[part.id]) {
                  toolBuffers[part.id] = { id: part.id, name: part.name, argParts: [] };
                  toolCallOrder.push(part.id);
                }
                if (typeof part.arguments === "string") {
                  toolBuffers[part.id].argParts.push(part.arguments);
                }
              }
            }

            // If model signaled it's done calling tools, proceed to execute them
            if (choice.finish_reason === "tool_calls" || choice.finish_reason === "function_call") {
              // Reconstruct tool calls
              const toolCalls: ToolCall[] = [];
              for (const id of toolCallOrder) {
                const entry = toolBuffers[id];
                const joined = entry.argParts.join("");
                let parsedArgs: any = {};
                try {
                  parsedArgs = joined ? JSON.parse(joined) : {};
                } catch (e) {
                  // If parsing fails, keep raw string under _raw
                  parsedArgs = { _raw: joined };
                }
                toolCalls.push({ name: entry.name, arguments: parsedArgs });
              }

              // Inform client about tool_calls (SSE)
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ type: "tool_calls", data: toolCalls })}\n\n`
                )
              );

              // Execute tools sequentially and send tool_result events
              const toolResults: { name: string; content: string }[] = [];
              for (const tool of toolCalls) {
                try {
                  const result = await executeTool(tool as ToolCall, sessionId);
                  toolResults.push({ name: tool.name, content: result.content });
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

              // After running tools, we must send a SECOND Groq completion so the assistant can finish its reply.
              // Build follow-up messages: include the original messages, then an assistant message containing the tool_calls metadata,
              // followed by role:"tool" messages containing each tool's output. Groq expects OpenAI-like roles; Groq uses role:"tool" for tool responses.
              const followUpMessages: Message[] = [
                ...messages,
                // assistant tool_calls message — provide structured info about the calls (keeps IDs/names/arguments)
                { role: "assistant", content: JSON.stringify({ tool_calls: toolCalls }) },
                // include each tool result as a role: "tool" message with name and content
                ...toolResults.map((r) => ({ role: "tool", name: r.name, content: r.content })),
              ];

              try {
                const followRes = await callGroqAPI(followUpMessages, false);
                const followJson = await followRes.json();

                // Extract assistant message from follow-up completion
                const followText =
                  followJson.choices?.[0]?.message?.content || followJson.choices?.[0]?.delta?.content || "";

                if (followText) {
                  // Send remaining assistant content to client
                  controller.enqueue(
                    new TextEncoder().encode(
                      `data: ${JSON.stringify({ type: "content", data: followText })}\n\n`
                    )
                  );

                  // Save assistant message to history
                  addMessageToHistory(sessionId, { role: "assistant", content: followText });
                }

                // Signal done
                controller.enqueue(
                  new TextEncoder().encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
                );
              } catch (err) {
                console.error("Follow-up Groq completion failed:", err);
                controller.enqueue(
                  new TextEncoder().encode(
                    `data: ${JSON.stringify({ type: "error", message: "Follow-up completion failed" })}\n\n`
                  )
                );
              }

              // break out — we've completed the flow for this request
              break;
            }

            // If model finished normally without tool calls
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", {
      message: errorMessage,
      type: typeof error,
      stack: error instanceof Error ? error.stack : "No stack trace",
    });

    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage, timestamp: new Date().toISOString() }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
