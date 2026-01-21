"use server";

import { prisma } from "@/lib/db";
import { inventoryService } from "@/lib/inventory-service";
import { revalidatePath } from "next/cache";

export async function adjustStock(productId: string, newStock: number, reason?: string) {
  try {
    const success = await inventoryService.adjustStock(productId, newStock, reason);
    
    if (success) {
      revalidatePath('/admin/inventory');
      revalidatePath('/admin/products');
      return { success: true };
    }
    
    return { success: false, error: 'Failed to adjust stock' };
  } catch (error) {
    console.error('Stock adjustment failed:', error);
    return { success: false, error: 'Failed to adjust stock' };
  }
}

export async function bulkStockUpdate(updates: Array<{ productId: string; stock: number; reason?: string }>) {
  try {
    const results = await Promise.all(
      updates.map(update => 
        inventoryService.adjustStock(update.productId, update.stock, update.reason)
      )
    );
    
    const successCount = results.filter(Boolean).length;
    
    revalidatePath('/admin/inventory');
    revalidatePath('/admin/products');
    
    return { 
      success: true, 
      message: `Updated ${successCount} of ${updates.length} products` 
    };
  } catch (error) {
    console.error('Bulk stock update failed:', error);
    return { success: false, error: 'Failed to update stock' };
  }
}

export async function resolveStockAlert(alertId: string) {
  try {
    const success = await inventoryService.resolveStockAlert(alertId);
    
    if (success) {
      revalidatePath('/admin/inventory');
      return { success: true };
    }
    
    return { success: false, error: 'Failed to resolve alert' };
  } catch (error) {
    console.error('Failed to resolve stock alert:', error);
    return { success: false, error: 'Failed to resolve alert' };
  }
}

export async function restoreOrderStock(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    // Restore stock for each item
    for (const item of order.items) {
      await inventoryService.restoreStock(item.productId, item.quantity, orderId);
    }

    revalidatePath('/admin/inventory');
    revalidatePath('/admin/orders');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to restore order stock:', error);
    return { success: false, error: 'Failed to restore stock' };
  }
}