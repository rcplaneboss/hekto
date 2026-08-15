import '@testing-library/jest-dom'

// Mock environment variables for tests
// Provide an independent test fixture for GROQ_API_KEY so CI that only defines XAI_API_KEY
// doesn't accidentally make GROQ_API_KEY inherit an x.ai/Grok key. This prevents mocked
// tests from hiding missing Groq configuration and avoids sending invalid keys to Groq.
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || 'test-groq-key-12345'

// Keep XAI_API_KEY for legacy tests that still expect it, but do NOT copy it into GROQ_API_KEY.
process.env.XAI_API_KEY = process.env.XAI_API_KEY || 'test-xai-key-12345'

process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'

// Add TextEncoder/TextDecoder to global scope for tests
if (!global.TextEncoder) {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn()

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
