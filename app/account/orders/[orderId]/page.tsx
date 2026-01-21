import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { orderId } = await params;

  const order = await prisma.order.findFirst({
    where: { 
      id: orderId,
      userId: session.user.id 
    },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) {
    notFound();
  }

  const statusSteps = [
    { key: 'PENDING', label: 'Order Placed', icon: Package },
    { key: 'PROCESSING', label: 'Processing', icon: Clock },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <PageHeader title="Order Details" />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/account/orders"
            className="flex items-center gap-2 text-[#FB2E86] hover:text-pink-600"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-josefin font-bold text-[#151875] dark:text-white">
                Order #{order.orderNumber}
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
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

          {/* Order Timeline */}
          <div className="mb-8">
            <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
              Order Progress
            </h3>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-[#FB2E86] text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <p className={`text-xs mt-2 text-center ${
                      isCurrent 
                        ? 'text-[#FB2E86] font-medium' 
                        : isCompleted 
                        ? 'text-[#151875] dark:text-white' 
                        : 'text-slate-400'
                    }`}>
                      {step.label}
                    </p>
                    {index < statusSteps.length - 1 && (
                      <div className={`h-0.5 w-full mt-5 ${
                        index < currentStepIndex ? 'bg-[#FB2E86]' : 'bg-slate-200 dark:bg-slate-700'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6">
              <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border dark:border-slate-700 rounded-lg">
                    <div className="relative w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#151875] dark:text-white">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.color && `Color: ${item.color}`}
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

          {/* Order Summary & Shipping */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6">
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

            {/* Shipping Address */}
            <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6">
              <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
                Shipping Address
              </h3>
              <div className="text-slate-600 dark:text-slate-300 space-y-1">
                <p className="font-medium text-[#151875] dark:text-white">
                  {order.firstName} {order.lastName}
                </p>
                <p>{order.address}</p>
                {order.apartment && <p>{order.apartment}</p>}
                <p>{order.city}, {order.postalCode}</p>
                <p>{order.country}</p>
                {order.phone && <p>Phone: {order.phone}</p>}
              </div>
            </div>

            {/* Tracking Info */}
            {order.trackingNumber && (
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6">
                <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
                  Tracking Information
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-2">Tracking Number:</p>
                <p className="font-mono text-[#FB2E86] font-medium">{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}