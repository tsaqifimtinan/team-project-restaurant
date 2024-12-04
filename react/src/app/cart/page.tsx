// src/app/cart/page.tsx
"use client";
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';
import CheckoutModal from '../components/CheckoutModal';

// Add PaymentData interface
interface PaymentData {
  name: string;
  email: string;
  finalTotal: number;
  discountAmount?: number;
  promoCode?: string;
  paymentMethod: string;
}

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get logged in user data
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = async (paymentData: PaymentData) => {
    try {
      // Add validation for paymentData
      if (typeof paymentData.finalTotal === 'undefined') {
        console.error('Final total is missing');
        return;
      }
  
      const transactionData = {
        name: paymentData.name,
        email: paymentData.email,
        cart: cart,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(paymentData.finalTotal.toFixed(2)), // Use the final total from checkout data
        discountAmount: paymentData.discountAmount ? parseFloat(paymentData.discountAmount.toFixed(2)) : 0,
        promoCode: paymentData.promoCode,
        paymentMethod: paymentData.paymentMethod
      };
  
      console.log('Transaction Data:', transactionData); // Debug log
  
      const response = await fetch('http://localhost:3001/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
  
      if (response.ok) {
        localStorage.setItem('lastOrder', JSON.stringify({
          name: paymentData.name,
          email: paymentData.email,
          items: cart,
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          total: parseFloat(paymentData.finalTotal.toFixed(2)),
          discountAmount: paymentData.discountAmount || 0,
          promoCode: paymentData.promoCode || null,
          paymentMethod: paymentData.paymentMethod
        }));
        router.push('/order-confirmation');
        clearCart();
        setShowCheckoutModal(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process transaction');
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Your cart is empty</p>
            <Link href="/order" className="text-blue-400 hover:text-blue-300">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-gray-800 rounded-xl p-4 flex gap-4">
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                      unoptimized={true}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                    <p className="text-gray-400">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-800 rounded-xl p-6 h-fit space-y-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowCheckoutModal(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/order"
                className="block text-center text-sm text-gray-400 hover:text-white"
              >
                Continue Shopping
              </Link>

              <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                cart={cart}
                subtotal={subtotal}
                tax={tax}
                total={total}
                onCheckout={handleCheckout}
                user={user} // Pass user data to modal
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}