# AI Shopping Assistant Implementation Guide

## Overview
A complete AI shopping assistant feature has been successfully implemented for the Hekto e-commerce platform using the Grok API (xAI) with function calling capabilities.

## What Was Built

### 1. **Backend Infrastructure**

#### Conversation History Storage (`lib/chat-session-store.ts`)
- In-memory session store for conversation history
- Per-session message tracking with timestamps
- Automatic cleanup of old sessions (24-hour TTL)
- **⚠️ PRODUCTION NOTE**: This should be replaced with Redis for scalability
  ```typescript
  // Replace with Redis in production:
  import Redis from 'ioredis';
  const redis = new Redis(process.env.REDIS_URL);
  ```

#### AI Tools & Tool Calling (`lib/ai-tools.ts`)
Implemented 6 main tools that the AI assistant can invoke:

1. **search_products** - Search products by name, category, or tags
   - Uses Prisma to query active products
   - Returns up to 5 results with price and stock info
   
2. **get_product_details** - Get full information about a specific product
   - Includes category, description, ratings, colors, sizes
   - Shows discount calculations
   
3. **add_to_cart** - Add items to customer's cart
   - Wired to existing `addToCart` server action
   - Supports color/size options
   - Works with both authenticated and guest users
   
4. **get_order_status** - Check order status by email
   - Returns last 5 orders with status and tracking
   - Shows estimated delivery dates
   
5. **answer_faq** - Answer FAQ and policy questions
   - Queries PageContent model for policy pages
   - Falls back to common FAQ answers if no match
   
6. **start_checkout** - Handoff to checkout flow
   - Returns checkout URLs (authenticated or guest)
   - **IMPORTANT**: Never autonomously places orders or charges cards

#### Chat API Route (`app/api/chat/route.ts`)
- Streaming response endpoint (`POST /api/chat`)
- Integrates with Grok API (OpenAI-compatible)
- Features:
  - Server-Sent Events (SSE) streaming for real-time responses
  - Tool calling with automatic tool invocation
  - Conversation history management per session
  - Cart context awareness
  - Error handling with fallbacks

**Environment Variable Required:**
```
XAI_API_KEY=your-grok-api-key
```

### 2. **Frontend Components**

#### Chat Widget (`components/ChatWidget.tsx`)
A floating chat widget with:
- **Visual Design**: Matches Hekto brand colors (#FB2E86 pink, #151875 navy)
- **Position**: Fixed bottom-right with expandable panel (w-96)
- **Features**:
  - Session-based conversation persistence (localStorage)
  - Real-time streaming with typing indicator (3-dot animation)
  - Product cards rendered inline from search results
  - "Add to Cart" buttons integrated with real cart logic
  - Dark mode support
  - Welcome message on first use
  - Input validation and error handling

**Integration Points:**
- Uses `useCart()` hook for cart context
- Calls `addToCart()` server action for purchases
- Sends cart state to API for context awareness
- Streams responses token-by-token

### 3. **Testing**

#### Unit Tests (`__tests__/lib/ai-tools.test.ts`)
- ✅ 6 test suites covering tool functionality
- Mocked Prisma database calls
- Tests error handling and edge cases
- All 16 tests passing

**Test Coverage:**
- `searchProducts`: Success, not found, error cases
- `getProductDetails`: Details retrieval, not found cases
- `answerFAQQuestion`: FAQ matching, defaults
- `startCheckout`: URL handoff logic

#### Component Tests (`__tests__/components/ChatWidget.test.tsx`)
- ✅ Component rendering and interaction tests
- Session management tests
- Input/output handling
- Error state handling
- Accessibility checks (aria-labels)

**Test Results:**
```
Test Suites: 2 passed, 2 total
Tests:       16 passed, 16 total
Time:        1.984 s
```

### 4. **Build & Deployment**

✅ **Build Status**: Successfully compiles with no errors
- Next.js compilation: ✓ Successful
- All 49 pages generated
- API routes included: `/api/chat` ✓

## How to Use

### 1. Set Up Environment Variable
```bash
# .env.local
XAI_API_KEY=your-actual-grok-api-key
```

Get your API key from: https://console.x.ai

### 2. Start Development Server
```bash
npm run dev
```

The chat widget will appear in the bottom-right corner of the site.

### 3. Run Tests
```bash
npm test                  # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### 4. Build for Production
```bash
npm run build
npm start
```

## Architecture & Data Flow

```
User Message
    ↓
Frontend ChatWidget (components/ChatWidget.tsx)
    ↓
API Endpoint: /api/chat
    ↓
Grok API (with tool definitions)
    ↓
Tool Execution (lib/ai-tools.ts)
    ↓
Database Queries (Prisma)
    ↓
Stream Response Back
    ↓
Display in Widget with Formatting
```

## Key Features

### Streaming Responses
- Real-time token-by-token streaming
- Typing indicator during response
- Fallback handling for SSE

### Tool-Based Architecture
- Grok API decides which tools to use
- Automatic tool invocation based on user intent
- Results integrated into AI response

### Context Awareness
- Pass current cart state to AI
- AI suggests checkout based on cart contents
- Order tracking with email context

### Security
- Session-based conversations
- No hardcoded credentials (uses environment variables)
- Server-side tool execution only
- No autonomous payment processing

## Production Considerations

### 1. Redis Implementation
Replace in-memory store in `lib/chat-session-store.ts`:
```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export function getConversationHistory(sessionId: string) {
  return JSON.parse(redis.get(`chat:${sessionId}`) || '[]');
}
```

### 2. Rate Limiting
Add rate limiting to `/api/chat` endpoint:
```typescript
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});
```

### 3. Monitoring & Logging
- Log all tool calls to analytics
- Track user queries for improvement
- Monitor API costs (Grok usage)

### 4. Response Caching
Consider caching common responses:
- Product search results
- FAQ answers
- Order status (short TTL)

## File Structure

```
app/
├── api/
│   └── chat/
│       └── route.ts          ← Main API endpoint
├── layout.tsx                 ← ChatWidget added here
└── ...

components/
└── ChatWidget.tsx             ← Floating widget

lib/
├── ai-tools.ts               ← Tool definitions
└── chat-session-store.ts     ← Conversation storage

__tests__/
├── lib/
│   └── ai-tools.test.ts      ← Tool tests
└── components/
    └── ChatWidget.test.tsx   ← Widget tests

jest.config.js                ← Jest configuration
jest.setup.js                 ← Test setup/globals
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `XAI_API_KEY` | ✅ Yes | Grok API key from x.ai |
| `NEXTAUTH_URL` | ✅ Yes | Your app URL |
| `NEXTAUTH_SECRET` | ✅ Yes | NextAuth.js secret |
| `REDIS_URL` | ⚠️ For production | Redis connection string |

## Troubleshooting

### Chat widget not appearing
- Verify ChatWidget is imported in `app/layout.tsx`
- Check browser console for errors
- Confirm sessionId is being created in localStorage

### "XAI_API_KEY not set" warning
- This is just a warning during build
- Set the key in `.env.local` for actual API calls
- Key is only used at runtime on the server

### Tool calls not working
- Check Grok API key validity
- Verify database connection
- Check browser network tab for 500 errors
- Review server logs for detailed errors

### Tests failing
```bash
npm test -- --verbose     # See detailed output
npm test -- --watch       # Fix files and re-run
```

## API Reference

### POST /api/chat
Request:
```json
{
  "message": "Find me a gaming laptop",
  "sessionId": "session-123...",
  "cartContext": {
    "itemCount": 2,
    "subtotal": 150.00
  }
}
```

Response (Server-Sent Events):
```
data: {"type":"content","data":"I found some gaming laptops..."}
data: {"type":"tool_calls","data":[{"name":"search_products"...}]}
data: {"type":"tool_result","data":{"name":"search_products","content":"..."}}
data: {"type":"done"}
```

## Future Enhancements

1. **Sentiment Analysis**: Detect frustrated customers
2. **Multi-language Support**: Translate with i18n
3. **Personalization**: Learn user preferences
4. **Proactive Assistance**: Suggest products based on browsing
5. **Voice Chat**: Speech-to-text integration
6. **Analytics Dashboard**: Admin panel for chat metrics
7. **Custom Model Tuning**: Fine-tune Grok for your domain
8. **Payment Integration**: Direct Stripe integration (if needed)

## Support & Documentation

- **Grok API Docs**: https://docs.x.ai
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Testing Docs**: https://testing-library.com

---

**Implementation Date**: 2026-08-13
**Status**: ✅ Complete & Tested
**Build**: ✅ Passing
**Tests**: ✅ 16/16 Passing
