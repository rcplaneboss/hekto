/**
 * Tests for AI Shopping Assistant Tools
 * 
 * These tests verify that the tool-calling logic works correctly
 * by mocking database calls and verifying tool execution
 */

import {
  searchProducts,
  getProductDetails,
  answerFAQQuestion,
  startCheckout,
} from "@/lib/ai-tools";

// Mock Prisma
jest.mock("@/lib/db", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    pageContent: {
      findMany: jest.fn(),
    },
  },
}));

// Mock auth
jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

// Mock cart actions
jest.mock("@/app/actions/cart", () => ({
  addToCart: jest.fn(),
}));

describe("AI Tools - searchProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted products when search matches", async () => {
    const { prisma } = require("@/lib/db");
    
    const mockProducts = [
      {
        id: "prod-1",
        name: "Gaming Laptop",
        code: "LAPTOP-001",
        price: 1200,
        discountPercentage: 10,
        imageUrl: "https://example.com/laptop.jpg",
        description: "High performance gaming laptop",
        stock: 5,
      },
    ];

    prisma.product.findMany.mockResolvedValue(mockProducts);

    const result = await searchProducts("laptop");

    expect(result.name).toBe("search_products");
    expect(result.content).toContain("Gaming Laptop");
    expect(result.content).toContain("1 product");
  });

  it("should return not found message when no products match", async () => {
    const { prisma } = require("@/lib/db");
    
    prisma.product.findMany.mockResolvedValue([]);

    const result = await searchProducts("nonexistent-product");

    expect(result.name).toBe("search_products");
    expect(result.content).toContain("No products found");
  });

  it("should handle database errors gracefully", async () => {
    const { prisma } = require("@/lib/db");
    
    prisma.product.findMany.mockRejectedValue(new Error("Database error"));

    const result = await searchProducts("laptop");

    expect(result.content).toContain("Error");
  });
});

describe("AI Tools - getProductDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted product details", async () => {
    const { prisma } = require("@/lib/db");

    const mockProduct = {
      id: "prod-1",
      name: "Premium Chair",
      code: "CHAIR-001",
      price: 300,
      discountPercentage: 15,
      description: "Comfortable ergonomic chair",
      longDescription: "Premium office chair with lumbar support",
      stock: 8,
      category: { name: "Furniture" },
      colors: ["Black", "White"],
      size: ["M", "L"],
      reviews: [
        { rating: 5, comment: "Excellent!" },
        { rating: 4, comment: "Good" },
      ],
    };

    prisma.product.findUnique.mockResolvedValue(mockProduct);

    const result = await getProductDetails("prod-1");

    expect(result.name).toBe("get_product_details");
    expect(result.content).toContain("Premium Chair");
  });

  it("should return not found message for invalid product ID", async () => {
    const { prisma } = require("@/lib/db");
    
    prisma.product.findUnique.mockResolvedValue(null);

    const result = await getProductDetails("invalid-id");

    expect(result.content).toContain("not found");
  });
});

describe("AI Tools - answerFAQQuestion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return FAQ content when match found", async () => {
    const { prisma } = require("@/lib/db");

    const mockPages = [
      {
        title: "Shipping Policy",
        content: "We ship worldwide within 5-7 business days.",
        slug: "shipping-policy",
      },
    ];

    prisma.pageContent.findMany.mockResolvedValue(mockPages);

    const result = await answerFAQQuestion("shipping");

    expect(result.name).toBe("answer_faq");
    expect(result.content).toContain("Shipping Policy");
  });

  it("should return default FAQ when no match found", async () => {
    const { prisma } = require("@/lib/db");
    
    prisma.pageContent.findMany.mockResolvedValue([]);

    const result = await answerFAQQuestion("random question");

    expect(result.content).toContain("Shipping");
  });
});

describe("AI Tools - startCheckout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return checkout message", async () => {
    const { auth } = require("@/auth");
    auth.mockResolvedValue(null);

    const result = await startCheckout("session-123");

    expect(result.name).toBe("start_checkout");
    expect(result.content).toContain("checkout");
  });
});

