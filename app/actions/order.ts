"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createOrder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Authentication required");

  // 1. Get the current cart
  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  // 2. Calculate Totals
  const subtotal = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // 3. Create Order in a Transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: session.user.id,
        customerEmail: formData.get("email") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        address: formData.get("address") as string,
        apartment: formData.get("apartment") as string,
        city: formData.get("city") as string,
        postalCode: formData.get("postalCode") as string,
        subtotal: subtotal,
        totalAmount: subtotal, // Add shipping logic here if needed
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price, // Locking in the price
            color: item.color,
            size: item.size,
          })),
        },
      },
    });

    // 4. Clear the cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });

  revalidatePath("/cart");
  return { success: true, orderId: order.id };
}