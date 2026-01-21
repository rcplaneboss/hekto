import { prisma } from '@/lib/db';
import { StockMovementType } from '@/lib/prisma/client';

interface StockMovementData {
  productId: string;
  quantity: number;
  type: StockMovementType;
  reason?: string;
  reference?: string;
  orderId?: string;
  createdBy?: string;
}

class InventoryService {
  async updateStock(data: StockMovementData): Promise<boolean> {
    try {
      return await prisma.$transaction(async (tx) => {
        // Get current product stock
        const product = await tx.product.findUnique({
          where: { id: data.productId },
          select: { stock: true, lowStockThreshold: true, name: true },
        });

        if (!product) throw new Error('Product not found');

        const previousStock = product.stock;
        const newStock = previousStock + data.quantity;

        if (newStock < 0) {
          throw new Error('Insufficient stock');
        }

        // Update product stock
        await tx.product.update({
          where: { id: data.productId },
          data: { stock: newStock },
        });

        // Create stock movement record
        await tx.stockMovement.create({
          data: {
            productId: data.productId,
            orderId: data.orderId,
            type: data.type,
            quantity: data.quantity,
            previousStock,
            newStock,
            reason: data.reason,
            reference: data.reference,
            createdBy: data.createdBy,
          },
        });

        // Check for low stock alerts
        if (newStock <= product.lowStockThreshold && data.quantity < 0) {
          await this.createStockAlert(data.productId, newStock, product.lowStockThreshold);
        }

        return true;
      });
    } catch (error) {
      console.error('Stock update failed:', error);
      return false;
    }
  }

  async deductStock(productId: string, quantity: number, orderId?: string): Promise<boolean> {
    return this.updateStock({
      productId,
      quantity: -quantity,
      type: StockMovementType.SALE,
      reason: 'Order placed',
      reference: orderId ? `Order #${orderId}` : undefined,
      orderId,
    });
  }

  async restoreStock(productId: string, quantity: number, orderId?: string): Promise<boolean> {
    return this.updateStock({
      productId,
      quantity,
      type: StockMovementType.RETURN,
      reason: 'Order cancelled/returned',
      reference: orderId ? `Order #${orderId}` : undefined,
      orderId,
    });
  }

  async addStock(productId: string, quantity: number, reason?: string): Promise<boolean> {
    return this.updateStock({
      productId,
      quantity,
      type: StockMovementType.RESTOCK,
      reason: reason || 'Stock replenishment',
    });
  }

  async adjustStock(productId: string, newStock: number, reason?: string): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    });

    if (!product) return false;

    const difference = newStock - product.stock;
    
    return this.updateStock({
      productId,
      quantity: difference,
      type: StockMovementType.ADJUSTMENT,
      reason: reason || 'Manual stock adjustment',
    });
  }

  private async createStockAlert(productId: string, currentStock: number, threshold: number): Promise<void> {
    // Check if alert already exists
    const existingAlert = await prisma.stockAlert.findFirst({
      where: {
        productId,
        isResolved: false,
      },
    });

    if (existingAlert) return;

    await prisma.stockAlert.create({
      data: {
        productId,
        alertType: currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
        threshold,
        currentStock,
      },
    });
  }

  async getLowStockProducts(limit = 10) {
    return prisma.product.findMany({
      where: {
        stock: { lte: prisma.product.fields.lowStockThreshold },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        code: true,
        stock: true,
        lowStockThreshold: true,
        imageUrl: true,
      },
      orderBy: { stock: 'asc' },
      take: limit,
    });
  }

  async getStockMovements(productId?: string, limit = 50) {
    return prisma.stockMovement.findMany({
      where: productId ? { productId } : undefined,
      include: {
        product: { select: { name: true, code: true } },
        order: { select: { orderNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getStockAlerts(resolved = false) {
    return prisma.stockAlert.findMany({
      where: { isResolved: resolved },
      include: {
        product: { select: { name: true, code: true, imageUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveStockAlert(alertId: string): Promise<boolean> {
    try {
      await prisma.stockAlert.update({
        where: { id: alertId },
        data: {
          isResolved: true,
          resolvedAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      console.error('Failed to resolve stock alert:', error);
      return false;
    }
  }
}

export const inventoryService = new InventoryService();