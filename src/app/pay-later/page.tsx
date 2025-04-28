'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useRouteProtection } from '@/context/RouteProtectionContext';

interface OrderDetails {
  transactionId: string;
  amount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  qrCode: string;
  upiLink: string;
}

const PayLaterPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isRouteValid } = useRouteProtection();

  useEffect(() => {
    if (!isRouteValid) {
      router.push('/services');
      return;
    }
  }, [isRouteValid, router]);

  useEffect(() => {
    const storedOrderDetails = localStorage.getItem('orderDetails');
    if (storedOrderDetails) {
      setOrderDetails(JSON.parse(storedOrderDetails));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003B95]"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Order Found</h2>
          <p className="text-gray-600 mb-6">Please complete your purchase first.</p>
          <button
            onClick={() => router.push('/services')}
            className="px-6 py-2 bg-[#003B95] text-white rounded-lg hover:bg-[#002F77] transition-colors"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                <svg className="w-8 h-8 text-[#003B95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#003B95]">Pay Later Confirmation</h1>
              <p className="text-gray-600 mt-2">Your order has been confirmed. Payment will be collected after service completion.</p>
            </div>

            {/* Order Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Order #{orderDetails.transactionId}</h2>
                  <p className="text-sm text-gray-500">Placed on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-gray-700">Order Confirmed</span>
                </div>
              </div>

              {/* Payment QR Code */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment QR Code</h3>
                <div className="flex flex-col items-center">
                  <div className="w-64 h-64 bg-white rounded-lg shadow-sm p-4 mb-4">
                    {orderDetails.qrCode && (
                      <img
                        src={orderDetails.qrCode.startsWith('data:image') ? orderDetails.qrCode : `data:image/png;base64,${orderDetails.qrCode}`}
                        alt="Payment QR Code"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Save this QR code for making the payment after service completion
                  </p>
                  {/* {orderDetails.upiLink && (
                    <a
                      href={orderDetails.upiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-2 bg-white text-[#003B95] border border-[#003B95] rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Open in UPI App
                    </a>
                  )} */}
                </div>
              </div>

              {/* Due Date */}
              {/* <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Due Date</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#003B95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-gray-900">
                      {new Date(orderDetails.dueDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div> */}

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium text-[#003B95]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">${orderDetails.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-[#003B95]">${orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#003B95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Our team will assign a agent to your order and will deliver the service to your doorstep.</p>
                </div>
                {/* <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#003B95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">An agent will be assigned to your order and their details will be shared with you.</p>
                </div> */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#003B95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Payment will be collected after the service is completed to your satisfaction.</p>
                </div>
              </div>
            </div>

            {/* Return to Home */}
            <div className="text-center mt-8">
              <button
                onClick={() => router.push('/services')}
                className="px-6 py-2 bg-white text-[#003B95] border border-[#003B95] rounded-lg hover:bg-blue-50 transition-colors"
              >
                Continue Ordering
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PayLaterPage; 