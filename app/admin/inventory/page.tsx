import { prisma } from "@/lib/db";
import { inventoryService } from "@/lib/inventory-service";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, Package, TrendingDown, History } from "lucide-react";

export default async function InventoryPage() {
  const [lowStockProducts, stockAlerts, recentMovements] = await Promise.all([
    inventoryService.getLowStockProducts(20),
    inventoryService.getStockAlerts(false),
    inventoryService.getStockMovements(undefined, 10)
  ]);

  const stats = {
    lowStock: lowStockProducts.length,
    outOfStock: lowStockProducts.filter(p => p.stock === 0).length,
    alerts: stockAlerts.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-josefin font-bold text-[#151875] dark:text-white">
            Inventory Management
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Monitor stock levels and manage inventory
          </p>
        </div>
        <Link
          href="/admin/inventory/movements"
          className="flex items-center gap-2 px-4 py-2 bg-[#FB2E86] text-white rounded-lg hover:bg-[#E91E63]"
        >
          <History size={20} />
          View All Movements
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border dark:border-slate-800">
          <div className="flex items-center gap-3">
            <TrendingDown className="text-orange-600" size={24} />
            <div>
              <p className="text-sm text-slate-500">Low Stock Items</p>
              <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Package className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-slate-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border dark:border-slate-800">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-600" size={24} />
            <div>
              <p className="text-sm text-slate-500">Active Alerts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.alerts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border dark:border-slate-800">
          <div className="p-6 border-b dark:border-slate-800">
            <h2 className="text-xl font-josefin font-bold text-[#151875] dark:text-white">
              Low Stock Products
            </h2>
          </div>
          <div className="p-6">
            {lowStockProducts.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                All products are well stocked!
              </p>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="relative w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#151875] dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Code: {product.code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        product.stock === 0 
                          ? 'text-red-600' 
                          : product.stock <= product.lowStockThreshold 
                          ? 'text-orange-600' 
                          : 'text-green-600'
                      }`}>
                        {product.stock} units
                      </p>
                      <p className="text-xs text-slate-400">
                        Threshold: {product.lowStockThreshold}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Stock Movements */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border dark:border-slate-800">
          <div className="p-6 border-b dark:border-slate-800">
            <h2 className="text-xl font-josefin font-bold text-[#151875] dark:text-white">
              Recent Stock Movements
            </h2>
          </div>
          <div className="p-6">
            {recentMovements.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                No recent stock movements
              </p>
            ) : (
              <div className="space-y-4">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className={`w-3 h-3 rounded-full ${
                      movement.quantity > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-medium text-[#151875] dark:text-white">
                        {movement.product.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {movement.type.replace('_', ' ').toLowerCase()}
                        {movement.reason && ` - ${movement.reason}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(movement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      {stockAlerts.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border dark:border-slate-800">
          <div className="p-6 border-b dark:border-slate-800">
            <h2 className="text-xl font-josefin font-bold text-[#151875] dark:text-white">
              Active Stock Alerts
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stockAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-4 p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                  <AlertTriangle className="text-yellow-600" size={20} />
                  <div className="flex-1">
                    <h3 className="font-medium text-[#151875] dark:text-white">
                      {alert.product.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {alert.alertType === 'OUT_OF_STOCK' ? 'Out of stock' : 'Low stock'} - 
                      Current: {alert.currentStock}, Threshold: {alert.threshold}
                    </p>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}