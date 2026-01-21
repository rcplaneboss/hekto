"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  stock: number;
  imageUrl: string;
}

interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = (product: Product) => {
    const existingItem = orderItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        productId: product.id,
        product,
        quantity: 1,
        price: product.price,
      }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    
    setOrderItems(orderItems.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const removeProduct = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert("Please add at least one product to the order");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("/api/admin/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        router.push(`/admin/orders`);
      } else {
        alert(result.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

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

      <h1 className="text-3xl font-josefin font-bold text-[#151875] dark:text-white">
        Create Store Order
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Search */}
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6">
          <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
            Add Products
          </h3>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="flex-1">
                  <p className="font-medium text-[#151875] dark:text-white">{product.name}</p>
                  <p className="text-sm text-slate-500">Code: {product.code} | Stock: {product.stock}</p>
                  <p className="text-sm font-bold text-[#FB2E86]">₦{product.price.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => addProduct(product)}
                  className="p-2 bg-[#FB2E86] text-white rounded-lg hover:bg-pink-600"
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6">
            <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
              Order Items ({orderItems.length})
            </h3>
            
            {orderItems.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No items added yet</p>
            ) : (
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-[#151875] dark:text-white">{item.product.name}</p>
                      <p className="text-sm text-slate-500">₦{item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border rounded text-center dark:bg-slate-800 dark:border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeProduct(item.productId)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#151875] dark:text-white">
                        ₦{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-[#151875] dark:text-white">Total:</span>
                    <span className="font-bold text-xl text-[#FB2E86]">₦{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || orderItems.length === 0}
            className="w-full bg-[#FB2E86] text-white py-3 rounded-lg font-josefin font-bold hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Process Order"}
          </button>
        </div>
      </form>
    </div>
  );
}