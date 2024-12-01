"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrderDetails {
  name: string;
  email: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

export default function OrderConfirmation() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Get order details from localStorage
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      // If no order details found, redirect to order page
      router.push('/order');
    }
  }, [router]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mb-4">
              <svg 
                className="w-16 h-16 text-green-500 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-gray-400 mt-2">Thank you for your order</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="font-medium">{order.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="font-medium">{order.email}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-600 pt-4">
                <h3 className="text-lg font-medium mb-4">Items Ordered</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-600 mt-6 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-600">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-4">
                <p className="text-gray-400">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-400">
                A confirmation email has been sent to {order.email}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/"
                  className="inline-block bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Return to Home
                </Link>
                <button 
                  onClick={() => window.print()} 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}