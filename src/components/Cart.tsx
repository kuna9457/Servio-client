'use client';

import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Cart = () => {
  const { items, removeFromCart, getTotal } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(true);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.service.image}
                      alt={item.service.category}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Professional {item.service.category}</h3>
                      <p className="text-gray-600 text-sm">Provider: {item.service.provider}</p>
                      <p className="text-primary font-semibold">₹{item.service.price}/hr</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.service._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Total and Checkout */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">₹{getTotal()}</span>
                </div>
                <button
                  onClick={() => {
                    // Handle checkout logic here
                    alert('Proceeding to checkout...');
                  }}
                  className="w-full bg-primary text-white py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart; 