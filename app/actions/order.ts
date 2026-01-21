"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { emailService } from "@/lib/email-service";
import { StockMovementType } from "@/lib/prisma/client";

export async function createOrder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Authentication required");

  // 1. Get the current cart
  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  // 2. Check stock availability
  for (const item of cart.items) {
    if (item.product.trackInventory && item.product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.product.name}`);
    }
  }

  // 3. Calculate Totals
  const subtotal = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // 4. Create Order in a Transaction
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
        totalAmount: subtotal,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            color: item.color,
            size: item.size,
          })),
        },
      },
    });

    // 5. Deduct stock for each item
    for (const item of cart.items) {
      if (item.product.trackInventory) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, lowStockThreshold: true },
        });
        
        if (product) {
          const newStock = product.stock - item.quantity;
          
          // Update product stock
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: newStock },
          });
          
          // Create stock movement record
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              orderId: newOrder.id,
              type: StockMovementType.SALE,
              quantity: -item.quantity,
              previousStock: product.stock,
              newStock: newStock,
              reason: 'Order placed',
              reference: `Order #${newOrder.orderNumber}`,
            },
          });
        }
      }
    }

    // 6. Clear the cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });

  // 7. Send order confirmation email (outside transaction)
  try {
    await emailService.sendOrderConfirmation(order.id);
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }

  revalidatePath("/cart");
  return { success: true, orderId: order.id };
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });

    // Send status update email
    await emailService.sendOrderStatusUpdate(orderId, status);

    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}