/**
 * In-memory conversation history storage
 * 
 * PRODUCTION NOTE: Replace this with Redis when scaling
 * In production, use Redis (ioredis or redis) to store conversations
 * with TTL (time-to-live) of ~24 hours per session.
 * 
 * Example Redis setup:
 * ```
 * import Redis from 'ioredis';
 * const redis = new Redis(process.env.REDIS_URL);
 * const key = `chat:${sessionId}`;
 * await redis.setex(key, 86400, JSON.stringify(messages));
 * ```
 */

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
}

/**
 * In-memory store for conversation history
 * Key: sessionId, Value: array of messages
 * 
 * For production, this entire object should be replaced with Redis calls
 */
const conversationStore: Map<string, ChatMessage[]> = new Map();

// Clean up old sessions every hour to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  
  for (const [sessionId, messages] of conversationStore) {
    // If last message is older than 24 hours, delete the session
    if (messages.length > 0) {
      const lastMessageTime = messages[messages.length - 1].timestamp || 0;
      if (lastMessageTime < now - 24 * 60 * 60 * 1000) {
        conversationStore.delete(sessionId);
      }
    }
  }
}, 60 * 60 * 1000); // Run every hour

export function getConversationHistory(sessionId: string): ChatMessage[] {
  return conversationStore.get(sessionId) || [];
}

export function addMessageToHistory(
  sessionId: string,
  message: ChatMessage
): void {
  if (!conversationStore.has(sessionId)) {
    conversationStore.set(sessionId, []);
  }
  
  const messages = conversationStore.get(sessionId)!;
  messages.push({
    ...message,
    timestamp: Date.now(),
  });
}

export function clearConversationHistory(sessionId: string): void {
  conversationStore.delete(sessionId);
}

export function getAllSessions(): string[] {
  return Array.from(conversationStore.keys());
}
