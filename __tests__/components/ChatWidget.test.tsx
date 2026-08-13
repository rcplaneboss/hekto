/**
 * Tests for Chat Widget Component
 * 
 * Basic rendering and interaction tests
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatWidget from "@/components/ChatWidget";
import { useCart } from "@/context/CartContext";

// Mock the cart context
jest.mock("@/context/CartContext", () => ({
  useCart: jest.fn(),
}));

// Mock cart actions
jest.mock("@/app/actions/cart", () => ({
  addToCart: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("ChatWidget Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Mock useCart
    (useCart as jest.Mock).mockReturnValue({
      cart: {
        items: [],
      },
      refreshCart: jest.fn(),
    });

    // Mock fetch for API calls
    global.fetch = jest.fn();
  });

  it("should render chat button by default", () => {
    render(<ChatWidget />);

    const button = screen.getByLabelText("Open chat");
    expect(button).toBeInTheDocument();
  });

  it("should open chat panel when button clicked", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    const openButton = screen.getByLabelText("Open chat");
    await user.click(openButton);

    await waitFor(() => {
      expect(screen.getByText("Hekto Assistant")).toBeInTheDocument();
    });
  });

  it("should show input field when panel is open", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    const openButton = screen.getByLabelText("Open chat");
    await user.click(openButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Ask me anything...")).toBeInTheDocument();
    });
  });

  it("should create a session ID on mount", async () => {
    render(<ChatWidget />);

    await waitFor(() => {
      const sessionId = localStorage.getItem("chatSessionId");
      expect(sessionId).toBeTruthy();
      expect(sessionId).toMatch(/^session-/);
    });
  });

  it("should reuse existing session ID", () => {
    const existingId = "session-existing-123";
    localStorage.setItem("chatSessionId", existingId);

    render(<ChatWidget />);

    expect(localStorage.getItem("chatSessionId")).toBe(existingId);
  });

  it("should close panel when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    const openButton = screen.getByLabelText("Open chat");
    await user.click(openButton);

    await waitFor(() => {
      expect(screen.getByText("Hekto Assistant")).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText("Close chat");
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Hekto Assistant")).not.toBeInTheDocument();
    });
  });

  it("should show welcome message when opened", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    const openButton = screen.getByLabelText("Open chat");
    await user.click(openButton);

    await waitFor(() => {
      expect(screen.getByText(/Hi! I'm Hekto's shopping assistant/i)).toBeInTheDocument();
    });
  });

  it("should have input field and send button", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    const openButton = screen.getByLabelText("Open chat");
    await user.click(openButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Ask me anything...")).toBeInTheDocument();
      expect(screen.getByLabelText("Send message")).toBeInTheDocument();
    });
  });
});

