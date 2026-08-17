"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, ShoppingCart } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { addToCart } from "@/app/actions/cart";

interface Product {
  id: string;
  name: string;
  price?: string;
  stock?: string;
}

interface Message {
  id: string;
  type: "user" | "assistant" | "product" | "tool";
  content: string;
  products?: Product[];
}

// Helper to strip raw model function calling syntax leakage (<function=...>)
const sanitizeContent = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/<function=[\s\S]*?<\/function>/gi, "")
    .replace(/function=[\s\S]*?<\/function>/gi, "")
    .replace(/<tool_call>[\s\S]*?<\/tool_call>/gi, "")
    .replace(/<\/?function.*?>/gi, "")
    .trim();
};

// Component for rendering Markdown with clickable Next.js links & responsive tables
const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => {
          if (href?.startsWith("/")) {
            return (
              <Link
                href={href}
                className="text-[#FB2E86] underline hover:text-pink-400 font-medium transition-colors"
              >
                {children}
              </Link>
            );
          }
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FB2E86] underline hover:text-pink-400 font-medium transition-colors"
            >
              {children}
            </a>
          );
        },
        table: ({ children }) => (
          <div className="overflow-x-auto my-2 border border-slate-200 dark:border-slate-700 rounded-md">
            <table className="min-w-full text-xs text-left border-collapse">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-slate-100 dark:bg-slate-700 p-2 border-b border-slate-300 dark:border-slate-600 font-semibold text-slate-800 dark:text-slate-100">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="p-2 border-b border-slate-200 dark:border-slate-700/60 text-xs">
            {children}
          </td>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-[#151875] dark:text-pink-300">
            {children}
          </strong>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside my-1 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside my-1 space-y-1">{children}</ol>
        ),
        p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

// Interactive product card sub-component
const ProductCard = ({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (id: string, name: string) => void;
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-[#E1E1E1] dark:border-slate-700 rounded-lg p-3 my-2 hover:shadow-md transition-shadow">
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-[#FB2E86]/10 to-[#3F509E]/10 rounded-lg flex-shrink-0 flex items-center justify-center">
          <ShoppingCart className="text-[#FB2E86]" size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#151875] dark:text-white text-xs truncate">
            {product.name}
          </h4>
          <p className="text-xs text-[#FB2E86] font-semibold mt-0.5">
            {product.price || "Check store"}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {product.stock || "Available"}
          </p>
          <button
            onClick={() => onAddToCart(product.id, product.name)}
            className="mt-1.5 w-full bg-[#FB2E86] hover:bg-pink-700 text-white text-xs font-semibold py-1 rounded transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { cart, refreshCart } = useCart();

  // Initialize or restore session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chatSessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("chatSessionId", newSessionId);
      setSessionId(newSessionId);
    }

    if (!storedSessionId) {
      setMessages([
        {
          id: "welcome",
          type: "assistant",
          content:
            "👋 Hi! I'm Hekto's shopping assistant. I can help you find products, answer questions about your orders, and guide you through checkout. What can I help you with today?",
        },
      ]);
    }
  }, []);

  // Auto-scroll to the bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      await addToCart(productId, 1);
      await refreshCart();

      const tempMessage: Message = {
        id: `toast-${Date.now()}`,
        type: "assistant",
        content: `✓ Added "**${productName}**" to your cart!`,
      };
      setMessages((prev) => [...prev, tempMessage]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      }, 3000);
    } catch (err) {
      console.error("Add to cart error:", err);
      setError("Failed to add item to cart. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          cartContext: {
            itemCount: cart?.items?.length || 0,
            subtotal: cart
              ? cart.items.reduce(
                  (sum: number, item: any) =>
                    sum + (item.product?.price || 0) * item.quantity,
                  0
                )
              : 0,
          },
        }),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || "Failed to get response");
        } catch {
          throw new Error(`API Error ${response.status}: Failed to get response`);
        }
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        type: "assistant",
        content: "",
      };
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              switch (data.type) {
                case "content":
                  assistantMessage.content += data.data;
                  setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last?.id === assistantMessage.id) {
                      return [...prev.slice(0, -1), { ...assistantMessage }];
                    } else {
                      return [...prev, { ...assistantMessage }];
                    }
                  });
                  break;

                case "tool_calls":
                  if (Array.isArray(data.data)) {
                    data.data.forEach((tool: any) => {
                      const query =
                        tool.arguments?.query ||
                        tool.arguments?.question ||
                        tool.arguments?.product_id ||
                        tool.arguments?.email ||
                        tool.name ||
                        "action";

                      const toolMessage: Message = {
                        id: `tool-${Date.now()}-${Math.random()}`,
                        type: "tool",
                        content: `🔍 Executing ${tool.name?.replace(/_/g, " ")} (${query})...`,
                      };
                      setMessages((prev) => [...prev, toolMessage]);
                    });
                  }
                  break;

                case "tool_result":
                  if (
                    data.data?.name === "search_products" &&
                    typeof data.data.content === "string"
                  ) {
                    const contentStr = data.data.content;
                    const matches = contentStr.match(
                      /- \*\*(.+?)\*\*[\s\S]*?(?=(?:- \*\*|$))/g
                    );

                    if (matches) {
                      const parsedProducts: Product[] = matches.map((block: string) => {
                        const nameMatch = block.match(/- \*\*(.+?)\*\*/);
                        const idMatch = block.match(/ID:\s*([^\)\s]+)/);
                        const priceMatch = block.match(/Price:\s*\$([0-9\.]+)/);
                        const stockMatch = block.match(/Stock:\s*(.+?)(?:\n|$)/);

                        return {
                          id: idMatch?.[1] || `prod-${Math.random()}`,
                          name: nameMatch?.[1] || "Product",
                          price: priceMatch?.[1] ? `$${priceMatch[1]}` : undefined,
                          stock: stockMatch?.[1]?.trim() || "Available",
                        };
                      });

                      const productMessage: Message = {
                        id: `products-${Date.now()}`,
                        type: "product",
                        content: "Found matching products:",
                        products: parsedProducts,
                      };
                      setMessages((prev) => [...prev, productMessage]);
                    }
                  }
                  break;

                case "done":
                  setIsLoading(false);
                  break;
              }
            } catch {
              // Ignore partial or unparseable SSE lines
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-[#FB2E86] hover:bg-pink-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-40"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[600px] bg-white dark:bg-slate-900 rounded-lg shadow-2xl flex flex-col border border-[#E1E1E1] dark:border-slate-700 z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FB2E86] to-[#3F509E] text-white px-6 py-4 rounded-t-lg flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="font-bold text-lg leading-tight">Hekto Assistant</h3>
              <p className="text-xs opacity-90">Always here to help</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F8FD] dark:bg-slate-800">
            {messages.map((msg) => {
              const cleanedContent = sanitizeContent(msg.content);

              if (msg.type === "assistant" && !cleanedContent && !isLoading) {
                return null;
              }

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.type === "user" ? (
                    <div className="bg-[#FB2E86] text-white rounded-lg px-4 py-2 max-w-[85%] text-sm">
                      {msg.content}
                    </div>
                  ) : msg.type === "product" ? (
                    <div className="w-full space-y-1">
                      <div className="bg-white dark:bg-slate-700 text-[#151875] dark:text-white rounded-lg px-3 py-2 text-sm max-w-[85%]">
                        {msg.content}
                      </div>
                      {msg.products?.map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  ) : msg.type === "tool" ? (
                    <div className="bg-[#EAEFFF] dark:bg-slate-700/60 text-[#3F509E] dark:text-slate-300 rounded-lg px-3 py-1.5 max-w-[85%] text-xs font-mono">
                      {msg.content}
                    </div>
                  ) : (
                    cleanedContent && (
                      <div className="bg-white dark:bg-slate-700 text-[#151875] dark:text-white rounded-lg px-4 py-2 max-w-[85%] text-sm">
                        <MarkdownRenderer content={cleanedContent} />
                        {isLoading &&
                          msg.id === messages[messages.length - 1]?.id && (
                            <span className="inline-flex gap-1 ml-2">
                              <span className="w-1.5 h-1.5 bg-[#FB2E86] rounded-full animate-pulse" />
                              <span
                                className="w-1.5 h-1.5 bg-[#FB2E86] rounded-full animate-pulse"
                                style={{ animationDelay: "0.2s" }}
                              />
                              <span
                                className="w-1.5 h-1.5 bg-[#FB2E86] rounded-full animate-pulse"
                                style={{ animationDelay: "0.4s" }}
                              />
                            </span>
                          )}
                      </div>
                    )
                  )}
                </div>
              );
            })}
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg px-4 py-2 text-sm">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="border-t border-[#E1E1E1] dark:border-slate-700 p-3 bg-white dark:bg-slate-900 rounded-b-lg flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-[#BFC6E0] dark:border-slate-600 rounded-lg focus:outline-none focus:border-[#FB2E86] text-sm dark:bg-slate-800 dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-[#FB2E86] hover:bg-pink-700 disabled:bg-gray-400 text-white rounded-lg px-3 py-2 transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
                }
        
