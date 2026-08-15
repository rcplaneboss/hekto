  - Error handling with fallbacks

**Environment Variable Required:**
```
GROQ_API_KEY=your-groq-api-key
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
GROQ_API_KEY=your-groq-api-key
```

Get your API key from: https://api.groq.com/openai/v1

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
Groq API (with tool definitions)
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
- Groq API decides which tools to use
- Automatic tool invocation based on user intent
- Results integrated into AI response

### Context Awareness
```