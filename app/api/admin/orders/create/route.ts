import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/api-auth-utils";
import { emailService } from "@/lib/email-service";
import { StockMovementType } from "@/lib/prisma/client";

export async function POST(req: NextRequest) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { items } = await req.json();

    if (!items.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Check stock availability
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, trackInventory: true, name: true }
      });
      
      if (!product) {
        return NextResponse.json({ error: `Product not found` }, { status: 400 });
      }
      
      if (product.trackInventory && product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name}` 
        }, { status: 400 });
      }
    }

    // Calculate totals
    const subtotal = items.reduce((total: number, item: any) => 
      total + (item.price * item.quantity), 0
    );

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerEmail: "store@hekto.com",
          firstName: "Store",
          lastName: "Order",
          address: "Store Location",
          apartment: "",
          city: "Store City",
          postalCode: "00000",
          phone: "",
          subtotal,
          totalAmount: subtotal,
          status: "DELIVERED", // Store orders are immediately delivered
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              color: item.color,
            })),
          },
        },
      });

      // Update stock for each item
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, trackInventory: true },
        });
        
        if (product?.trackInventory) {
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
              reason: 'Store order processed',
              reference: `Store Order #${newOrder.orderNumber}`,
            },
          });
        }
      }

      return newOrder;
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.orderNumber 
    });

  } catch (error) {
    console.error('Store order creation failed:', error);
    return NextResponse.json({ 
      error: "Failed to process order" 
    }, { status: 500 });
  }
}