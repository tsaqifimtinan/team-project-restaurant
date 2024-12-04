import { useState, useEffect } from 'react';
import { CartItem } from '../context/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onCheckout: (paymentData: any) => void;
  user: { name: string; email: string } | null;
}

export default function CheckoutModal({ isOpen, onClose, cart, subtotal, tax, total, onCheckout, user }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTotal = calculateDiscountedTotal(); // Calculate final total with discount
    const checkoutData = {
      name: formData.name,
      email: formData.email,
      paymentMethod,
      promoCode: appliedPromo?.code || null,
      discountAmount: appliedPromo ? (total - finalTotal) : 0,
      finalTotal: finalTotal // Make sure this is included
    };
    onCheckout(checkoutData);
  };

  const handlePromoCheck = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/promotions/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: promoCode,
          total: subtotal,
          cart: cart // Pass the cart items to validate item-specific promotions
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setAppliedPromo(data.promotion);
        setPromoError('');
      } else {
        setPromoError(data.error || 'Invalid promotion code');
        setAppliedPromo(null);
      }
    } catch (error) {
      console.error('Error validating promotion:', error);
      setPromoError('Error validating promotion code');
      setAppliedPromo(null);
    }
  };

  // Calculate discounted total
  const calculateDiscountedTotal = () => {
    if (!appliedPromo) return total;

    const discountAmount = appliedPromo.discountAmount;
    if (discountAmount.includes('%')) {
      const percentage = parseFloat(discountAmount) / 100;
      return total * (1 - percentage);
    } else {
      const amount = parseFloat(discountAmount);
      return Math.max(0, total - amount);
    }
  };

  const finalTotal = calculateDiscountedTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Checkout</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
  
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  user ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!!user}
              />
            </div>
  
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  user ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!!user}
              />
            </div>
  
            <div>
              <label className="block text-sm text-gray-400 mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="cash">Cash on Delivery</option>
                <option value="transfer">Bank Transfer</option>
              </select>
            </div>
  
            {/* Promotion Code Section */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400 mb-2">Promotion Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter code"
                />
                <button
                  type="button"
                  onClick={handlePromoCheck}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-red-400 text-sm">{promoError}</p>
              )}
              {appliedPromo && (
                <p className="text-green-400 text-sm">
                  {appliedPromo.discountAmount} discount applied!
                </p>
              )}
            </div>
  
            <div className="border-t border-gray-700 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Discount</span>
                    <span>-${(total - finalTotal).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
  
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}