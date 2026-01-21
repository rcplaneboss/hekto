"use server";

import {prisma} from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

// 1. Get the Cart (supports both user and guest)
export async function getCart(sessionId?: string) {
noStore();
  const session = await auth();
  const user = session?.user;

  let cart;
  
  if (user?.email) {
    // Authenticated user cart
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return null;
    
    cart = await prisma.cart.findUnique({
      where: { userId: dbUser.id },
      include: {
        items: {
          include: { product: true },
          orderBy: { productId: 'asc' }
        },
      },
    });
  } else if (sessionId) {
    // Guest cart
    cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: { product: true },
          orderBy: { productId: 'asc' }
        },
      },
    });
  }

  return cart;
}

// 2. Add Item to Cart (supports both user and guest)
export async function addToCart(productId: string, quantity: number, color?: string, size?: string, sessionId?: string) {
  const session = await auth();
  const user = session?.user;

  let cart;
  
  if (user?.email) {
    // Authenticated user
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { error: "User not found" };
    
    cart = await prisma.cart.findUnique({ where: { userId: dbUser.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: dbUser.id } });
    }
  } else if (sessionId) {
    // Guest user
    cart = await prisma.cart.findUnique({ where: { sessionId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { sessionId } });
    }
  } else {
    return { error: "Please login or provide session ID" };
  }

  // Upsert Item (Update quantity if exists, otherwise create)
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      color: color || null,
      size: size || null,
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        color,
        size,
      },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { success: true };
}

// 3. Update Quantity
export async function updateCartItem(itemId: string, newQuantity: number) {
  if (newQuantity < 1) return { error: "Quantity must be at least 1" };
  
  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: newQuantity },
  });

  revalidatePath("/cart");
}

// 4. Remove Item
export async function removeCartItem(itemId: string) {
  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  revalidatePath("/cart");
}

// 5. Clear Cart
export async function clearCart(cartId: string) {
  await prisma.cartItem.deleteMany({
    where: { cartId },
  });
  
  revalidatePath("/cart");
}