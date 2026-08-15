/**
 * AI Shopping Assistant Tools
 * 
 * These tools are called by the Grok API when the assistant needs to
 * perform real actions like searching products, adding to cart, etc.
 */

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { addToCart } from "@/app/actions/cart";
import type { Session } from "next-auth";

export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResult {
  name: string;
  content: string;
}

/**
 * Tool 1: Search Products
 * Searches for products by name, category, or tags
 */
export async function searchProducts(
  query: string,
  limit: number = 5
): Promise<ToolResult> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { hasSome: [query.toLowerCase()] } },
          { code: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        code: true,
        price: true,
        discountPercentage: true,
        imageUrl: true,
        description: true,
        stock: true,
      },
      take: limit,
    });

    if (products.length === 0) {
      return {
        name: "search_products",
        content: `No products found matching "${query}". Try searching for popular items like "laptop", "phone", or browse our shop.`,
      };
    }

    const formattedProducts = products.map((p) => {
      const discountedPrice = p.discountPercentage
        ? p.price - (p.price * (p.discountPercentage / 100))
        : p.price;
      return `- **${p.name}** (ID: ${p.id})
        Price: $${discountedPrice.toFixed(2)}${p.discountPercentage ? ` (was $${p.price.toFixed(2)})` : ""}
        Stock: ${p.stock > 0 ? "Available" : "Out of stock"}`;
    });

    return {
      name: "search_products",
      content: `Found ${products.length} products:\n${formattedProducts.join("\n")}`,
    };
  } catch (error) {
    console.error("Search products error:", error);
    return {
      name: "search_products",
      content: "Error searching products. Please try again.",
    };
  }
}

/**
 * Tool 2: Get Product Details
 * Retrieves full details for a specific product
 */
export async function getProductDetails(productId: string): Promise<ToolResult> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        reviews: {
          take: 3,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return {
        name: "get_product_details",
        content: "Product not found.",
      };
    }

    const discountedPrice = product.discountPercentage
      ? product.price - (product.price * (product.discountPercentage / 100))
      : product.price;

    const avgRating =
      product.reviews.length > 0
        ? (
            product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          ).toFixed(1)
        : "No ratings";

    return {
      name: "get_product_details",
      content: `**${product.name}**
Category: ${product.category?.name || "Uncategorized"}
Price: $${discountedPrice.toFixed(2)}${product.discountPercentage ? ` (${product.discountPercentage}% off)` : ""}
Stock: ${product.stock} available
Description: ${product.description || "No description"}
${product.longDescription ? `\nFull Details: ${product.longDescription}` : ""}
Rating: ${avgRating} / 5 (${product.reviews.length} reviews)
Colors: ${product.colors.join(", ") || "Not specified"}
Sizes: ${product.size.join(", ") || "Not specified"}`,
    };
  } catch (error) {
    console.error("Get product details error:", error);
    return {
      name: "get_product_details",
      content: "Error fetching product details. Please try again.",
    };
  }
}

/**
 * Tool 3: Add to Cart
 * Adds a product to the user's cart
 */
export async function addProductToCart(
  productId: string,
  quantity: number = 1,
  color?: string,
  size?: string,
  sessionId?: string
): Promise<ToolResult> {
  try {
    const result = await addToCart(productId, quantity, color, size, sessionId);

    if ((result as any).error) {
      return {
        name: "add_to_cart",
        content: (result as any).error,
      };
    }

    // Get product name for confirmation
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { name: true },
    });

    return {
      name: "add_to_cart",
      content: `✓ Added ${quantity}x "${product?.name}" to your cart!`,
    };
  } catch (error) {
    console.error("Add to cart error:", error);
    return {
      name: "add_to_cart",
      content: "Error adding to cart. Please try again.",
    };
  }
}

/**
 * Tool 4: Get Order Status
 * Retrieves order status for authenticated users only
 * Enforces that users can only access their own orders
 */
export async function getOrderStatus(session: Session | null): Promise<ToolResult> {
  try {
    // Require authentication - reject unauthenticated requests
    if (!session?.user?.email) {
      return {
        name: "get_order_status",
        content: "You must be logged in to view your order status. Please sign in to continue.",
      };
    }

    // Use email from authenticated session (not from client/model input)
    const email = session.user.email;

    const orders = await prisma.order.findMany({
      where: { customerEmail: email },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        trackingNumber: true,
        estimatedDelivery: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    if (orders.length === 0) {
      return {
        name: "get_order_status",
        content: `No orders found for your account. Start shopping to place your first order!`,
      };
    }

    const orderDetails = orders.map((o) => {
      const deliveryInfo = o.estimatedDelivery
        ? `\n  Estimated Delivery: ${new Date(o.estimatedDelivery).toLocaleDateString()}`
        : "";
      const trackingInfo = o.trackingNumber
        ? `\n  Tracking: ${o.trackingNumber}`
        : "";

      return `- Order #${o.orderNumber} | $${o.totalAmount.toFixed(2)} | Status: ${o.status}${trackingInfo}${deliveryInfo}`;
    });

    return {
      name: "get_order_status",
      content: `Your orders:\n${orderDetails.join("\n")}`,
    };
  } catch (error) {
    console.error("Get order status error:", error);
    return {
      name: "get_order_status",
      content: "Error fetching order status. Please try again.",
    };
  }
}

/**
 * Tool 5: Answer FAQ/Policy Questions
 * Retrieves FAQ and policy information from PageContent
 */
export async function answerFAQQuestion(query: string): Promise<ToolResult> {
  try {
    const pages = await prisma.pageContent.findMany({
      where: {
        isActive: true,
        OR: [
          { slug: { contains: "faq", mode: "insensitive" } },
          { slug: { contains: "policy", mode: "insensitive" } },
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        title: true,
        content: true,
        slug: true,
      },
      take: 3,
    });

    if (pages.length === 0) {
      // Return common policy info if no match
      return {
        name: "answer_faq",
        content: `I don't have specific info on that topic. Common questions:
- **Shipping**: Orders typically arrive in 5-7 business days
- **Returns**: 30-day return policy on most items
- **Payment**: We accept all major credit cards and digital wallets
- **Tracking**: You'll receive a tracking number via email

Visit our FAQ page for more details or contact support.`,
      };
    }

    const content = pages.map((p) => `**${p.title}**\n${p.content}`).join("\n\n");

    return {
      name: "answer_faq",
      content: content,
    };
  } catch (error) {
    console.error("Answer FAQ error:", error);
    return {
      name: "answer_faq",
      content: "Error fetching FAQ. Please contact support for help.",
    };
  }
}

/**
 * Tool 6: Start Checkout
 * Returns checkout URL/state for handoff to existing checkout flow
 * NEVER autonomously places orders or charges cards
 */
export async function startCheckout(sessionId?: string): Promise<ToolResult> {
  try {
    // For authenticated users, redirect to checkout page
    const session = await auth();
    
    if (session?.user) {
      return {
        name: "start_checkout",
        content: `Ready to checkout! Click here to proceed: /checkout
        
Your items are in your cart. Please review them and complete your purchase on the checkout page.`,
      };
    } else if (sessionId) {
      // For guests, they need to proceed with guest checkout
      return {
        name: "start_checkout",
        content: `Ready to checkout! Proceed to: /checkout/guest

You'll need to provide your email and shipping details to complete your purchase.`,
      };
    } else {
      return {
        name: "start_checkout",
        content: "Please log in or start a session to proceed to checkout.",
      };
    }
  } catch (error) {
    console.error("Start checkout error:", error);
    return {
      name: "start_checkout",
      content: "Error starting checkout. Please try again.",
    };
  }
}

/**
 * Main tool executor function
 * Parses tool calls from the LLM and executes them
 */
export async function executeTool(
  tool: ToolCall,
  sessionId?: string,
  session?: Session | null
): Promise<ToolResult> {
  switch (tool.name) {
    case "search_products":
      return searchProducts(
        tool.arguments.query,
        tool.arguments.limit || 5
      );

    case "get_product_details":
      return getProductDetails(tool.arguments.product_id);

    case "add_to_cart":
      return addProductToCart(
        tool.arguments.product_id,
        tool.arguments.quantity || 1,
        tool.arguments.color,
        tool.arguments.size,
        sessionId
      );

    case "get_order_status":
      return getOrderStatus(session || null);

    case "answer_faq":
      return answerFAQQuestion(tool.arguments.question);

    case "start_checkout":
      return startCheckout(sessionId);

    default:
      return {
        name: tool.name,
        content: `Unknown tool: ${tool.name}`,
      };
  }
}
