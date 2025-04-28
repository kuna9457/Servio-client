'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';

interface Service {
  _id: string;
  category: string;
  provider: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem {
  id: string;
  service: Service;
  quantity: number;
}

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(serviceId);
    } else {
      updateQuantity(serviceId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated
      if (!user) {
        // Save current URL to redirect back after login
        const currentPath = window.location.pathname;
        router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }
      
      // If authenticated, proceed to checkout
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      router.push('/checkout');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/services')}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.service._id} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.service.image}
                    alt={item.service.category}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.service._id}</h3>
                      <p className="text-sm text-gray-500">{item.service.category}</p>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Provider:</span> {item.service.provider || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#003B95] font-medium">₹{item.service.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.service._id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.service._id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Tax (10%)</span>
              <span className="font-medium">₹{(getTotal() * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{(getTotal() * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
          >
            {isLoading ? 'Processing...' : user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 