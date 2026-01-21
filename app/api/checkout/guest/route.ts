import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { emailService } from "@/lib/email-service";
import { StockMovementType } from "@/lib/prisma/client";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const sessionId = formData.get("sessionId") as string;
    const createAccount = formData.get("createAccount") === "true";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Get guest cart
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.product.trackInventory && item.product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${item.product.name}` 
        }, { status: 400 });
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((acc, item) => 
      acc + (item.product.price * item.quantity), 0
    );

    let userId = null;

    // Create account if requested
    if (createAccount && password) {
      try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
          data: {
            email,
            name: `${formData.get("firstName")} ${formData.get("lastName")}`,
            // Note: You'll need to add password field to User model for this to work
          },
        });
        userId = user.id;
      } catch (error) {
        // User might already exist, continue as guest
        console.log("User creation failed, continuing as guest");
      }
    }

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          customerEmail: email,
          firstName: formData.get("firstName") as string,
          lastName: formData.get("lastName") as string,
          address: formData.get("address") as string,
          apartment: formData.get("apartment") as string,
          city: formData.get("city") as string,
          postalCode: formData.get("postalCode") as string,
          phone: formData.get("phone") as string,
          subtotal,
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

      // Update stock for each item
      for (const item of cart.items) {
        if (item.product.trackInventory) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { stock: true },
          });
          
          if (product) {
            const newStock = product.stock - item.quantity;
            
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: newStock },
            });
            
            await tx.stockMovement.create({
              data: {
                productId: item.productId,
                orderId: newOrder.id,
                type: StockMovementType.SALE,
                quantity: -item.quantity,
                previousStock: product.stock,
                newStock: newStock,
                reason: 'Guest order placed',
                reference: `Order #${newOrder.orderNumber}`,
              },
            });
          }
        }
      }

      // Clear guest cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    // Send confirmation email
    try {
      await emailService.sendOrderConfirmation(order.id);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.orderNumber 
    });

  } catch (error) {
    console.error('Guest checkout failed:', error);
    return NextResponse.json({ 
      error: "Checkout failed" 
    }, { status: 500 });
  }
}