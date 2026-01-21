"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function reorderItems(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }

  // Get the order with items
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: session.user.id },
    });
  }

  // Add items to cart
  for (const item of order.items) {
    // Check if product is still available and has stock
    if (item.product.trackInventory && item.product.stock < item.quantity) {
      continue; // Skip items that are out of stock
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: item.productId,
        color: item.color,
        size: item.size,
      },
    });

    if (existingCartItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + item.quantity,
        },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        },
      });
    }
  }

  redirect("/cart");
}