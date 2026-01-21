import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { Package, Eye, RotateCcw } from "lucide-react";
import { reorderItems } from "@/app/actions/reorder";

export default async function OrderHistoryPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <PageHeader title="Order History" />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-josefin font-bold text-[#151875] dark:text-white">
              My Orders
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Track and manage your orders
            </p>
          </div>
          <Link 
            href="/shop" 
            className="bg-[#FB2E86] text-white px-6 py-2 rounded-sm font-josefin hover:bg-pink-600 transition"
          >
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="mx-auto mb-4 text-slate-400" size={64} />
            <h2 className="text-2xl font-josefin font-bold text-[#151875] dark:text-white mb-4">
              No Orders Yet
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link 
              href="/shop" 
              className="bg-[#FB2E86] text-white px-8 py-3 rounded-sm font-josefin hover:bg-pink-600 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex items-center gap-4 mb-4 lg:mb-0">
                    <div>
                      <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'DELIVERED' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : order.status === 'SHIPPED'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : order.status === 'PROCESSING'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {order.status}
                    </span>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="flex items-center gap-1 text-[#FB2E86] hover:text-pink-600 text-sm"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                      
                      {order.status === 'DELIVERED' && (
                        <form action={reorderItems.bind(null, order.id)} className="inline">
                          <button type="submit" className="flex items-center gap-1 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-sm">
                            <RotateCcw size={16} />
                            Reorder
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-slate-600 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#151875] dark:text-white truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Qty: {item.quantity} × ₦{item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {order.items.length > 3 && (
                      <Link 
                        href={`/account/orders/${order.id}`}
                        className="flex items-center justify-center text-sm text-[#FB2E86] hover:text-pink-600 cursor-pointer"
                      >
                        +{order.items.length - 3} more items
                      </Link>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                    <p className="font-josefin font-bold text-lg text-[#151875] dark:text-white">
                      Total: ₦{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}