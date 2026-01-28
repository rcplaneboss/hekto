import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin } from "lucide-react";

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/orders"
          className="flex items-center gap-2 text-[#FB2E86] hover:text-pink-600"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-josefin font-bold text-[#151875] dark:text-white">
            Order #{order.orderNumber}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Created on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="text-[#FB2E86]" size={20} />
              <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white">
                Order Items
              </h3>
            </div>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border dark:border-slate-700 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#151875] dark:text-white">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Code: {item.product.code}
                      {item.color && (
                        <span className="inline-flex items-center gap-1 ml-2">
                          • 
                          <div 
                            className="w-3 h-3 rounded-full border border-slate-300 inline-block"
                            style={{ backgroundColor: item.color.toLowerCase() }}
                            title={item.color}
                          />
                          {item.color}
                        </span>
                      )}
                      {item.size && ` • Size: ${item.size}`}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Qty: {item.quantity} × ₦{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#151875] dark:text-white">
                      ₦{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Customer Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6">
            <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Subtotal:</span>
                <span className="font-medium">₦{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t dark:border-slate-700 pt-3">
                <span className="font-bold text-[#151875] dark:text-white">Total:</span>
                <span className="font-bold text-[#151875] dark:text-white">₦{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-[#FB2E86]" size={20} />
              <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white">
                Customer Information
              </h3>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-1">
              <p className="font-medium text-[#151875] dark:text-white">
                {order.firstName} {order.lastName}
              </p>
              <p>{order.customerEmail}</p>
              {order.phone && <p>Phone: {order.phone}</p>}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-[#FB2E86]" size={20} />
              <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white">
                Shipping Address
              </h3>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-1">
              <p>{order.address}</p>
              {order.apartment && <p>{order.apartment}</p>}
              <p>{order.city}, {order.postalCode}</p>
              <p>{order.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}