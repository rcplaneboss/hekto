# Quick Start: AI Shopping Assistant Setup

## 5-Minute Setup

### 1. Get Your Groq API Key
1. Visit: https://api.groq.com/openai/v1
2. Sign up or log in (Groq / GroqCloud)
3. Create a new API key
4. Copy the key

### 2. Add Environment Variable
Create/update `.env.local`:
```bash
GROQ_API_KEY=groq_your_actual_key_here
```

### 3. Install & Start
```bash
# Install test dependencies (if not already done)
npm install

# Run tests to verify everything works
npm test

# Start dev server
npm run dev
```

### 4. Test It Out
- Open http://localhost:3000
- Look for the pink chat button in bottom-right corner
- Try asking: "Show me gaming laptops"
- Click "Add to Cart" on a product

## Verify It Works

### ✅ Check 1: Tests Pass
```bash
npm test
# Expected: "Test Suites: 2 passed, 2 total"
```

### ✅ Check 2: Build Succeeds
```bash
npm run build
# Expected: "✓ Compiled successfully"
```

### ✅ Check 3: Chat Widget Visible
1. Run `npm run dev`
2. Open browser to http://localhost:3000
3. Look for pink floating chat button (bottom-right)
4. Click to open

### ✅ Check 4: Send a Test Message
In the chat widget, try:
- "Find me a blue chair" → Will search products
- "What's your shipping policy?" → Will answer FAQ
- "Check my order status" → Will ask for email
- "I'm ready to checkout" → Will guide to checkout

## What's New in Your App

### Files Added:
- `lib/chat-session-store.ts` - Conversation storage
- `lib/ai-tools.ts` - AI tool definitions
- `app/api/chat/route.ts` - Chat API endpoint
- `components/ChatWidget.tsx` - Floating widget
- `__tests__/lib/ai-tools.test.ts` - Tool tests
- `__tests__/components/ChatWidget.test.tsx` - Widget tests
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test setup
- `AI_SHOPPING_ASSISTANT_GUIDE.md` - Full documentation

### Files Modified:
- `app/layout.tsx` - Added ChatWidget import & component
- `package.json` - Added test scripts

## Troubleshooting Quick Fixes

### Problem: Chat button not visible
```bash
# Make sure ChatWidget is in layout.tsx:
grep "ChatWidget" app/layout.tsx
# Should show import and <ChatWidget /> in JSX
```

### Problem: "GROQ_API_KEY not set" errors
```bash
# Verify key is in .env.local
cat .env.local | grep GROQ_API_KEY

# Check it's valid format
# Should be: GROQ_API_KEY=groq_...
```

### Problem: Tests failing
```bash
npm test -- --watch
# Fix any issues shown, save file
# Tests auto-re-run
```

### Problem: Chat returns errors
1. Open browser DevTools → Network tab
2. Send a message in chat
3. Click the `/api/chat` request
4. Check Response tab for error details
5. Common issues:
   - Invalid API key
   - Database connection
