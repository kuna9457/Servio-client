'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { render } from '@react-email/components';
import OrderConfirmationEmail from '@/components/email/OrderConfirmationEmail';
import { useCheckout } from '@/context/CheckoutContext';
import CheckoutRoute from '@/components/auth/CheckoutRoute';
import { useRouteProtection } from '@/context/RouteProtectionContext';

interface OrderDetails {
  transactionId: string;
  customerName: string;
  amount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    category: string;
    type: string;
    cuisine: string;
    image: string;
    provider: {
      _id: string;
      name: string;
      location: string;
    };
  }>;
  subtotal: number;
  tax: number;
  total: number;
  dueDate?: string;
  qrCode?: string;
  upiLink?: string;
  paymentMethod: string;
}

const PendingVerificationPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  const { checkoutStarted, paymentCompleted } = useCheckout();
  const { isRouteValid } = useRouteProtection();

  useEffect(() => {
    if (!isRouteValid) {
      router.push('/services');
      return;
    }

    if (!checkoutStarted || !paymentCompleted) {
      router.push('/services');
      return;
    }

    const storedOrderDetails = localStorage.getItem('orderDetails');
    if (storedOrderDetails) {
      const parsedDetails = JSON.parse(storedOrderDetails);
      setOrderDetails(parsedDetails);
    }
    setIsLoading(false);

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [checkoutStarted, paymentCompleted, isRouteValid, router]);

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
    <CheckoutRoute>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-400 mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#003B95]">Order Received</h1>
                <p className="text-gray-600 mt-2">Sit back and relax — we'll assign an agent once your payment is confirmed.<br/> If not done yet, your order will switch to the Pay Later option.</p>
              </div>

              {/* Order Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Order #{orderDetails.transactionId}</h2>
                    <p className="text-sm text-gray-500">Placed on {new Date().toLocaleDateString()}</p>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      verificationStatus === 'pending' ? 'bg-yellow-400' :
                      verificationStatus === 'verified' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {verificationStatus === 'pending' ? 'Pending Verification' :
                       verificationStatus === 'verified' ? 'Verified' : 'Verification Failed'}
                    </span>
                  </div> */}
                </div>

                {/* Progress Steps */}
                {/* <div className="relative mb-8">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#003B95] text-white flex items-center justify-center mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Order Placed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full ${
                        verificationStatus === 'pending' ? 'bg-gray-200' : 'bg-[#003B95]'
                      } text-white flex items-center justify-center mb-2`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Payment Verification</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-500">Order Confirmed</span>
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
                        <span className="font-medium text-[#003B95]">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#003B95] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order Summary
                  </h2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          {/* <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          /> */}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">{item.type}</h3>
                            <span className="text-[#003B95] font-medium">₹{item.price.toFixed(2)}</span>
                          </div>
                          <div className=" space-y-1">
                            {/* <p className="text-sm text-gray-600">
                              <span className="font-medium">Category:</span> {item.category}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Provider:</span> {item.provider?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Cuisine:</span> {item.cuisine || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Location:</span> {item.provider?.location || 'N/A'}
                            </p> */}
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Quantity:</span> {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{orderDetails.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="font-medium">₹{orderDetails.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount</span>
                      <span className="text-[#003B95]">₹{orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Details</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Transaction ID:</span> {orderDetails.transactionId}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Payment Method:</span> {orderDetails.paymentMethod === 'qr' ? 'UPI Payment' : 'Pay Later'}
                      </p>
                      {orderDetails.paymentMethod === 'pay_later' && orderDetails.dueDate && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Due Date:</span> {new Date(orderDetails.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  {verificationStatus === 'pending' ? (
                    <>
                      Auto-refreshing in <span className="font-medium text-[#003B95]">{countdown}</span> seconds
                    </>
                  ) : (
                    'Verification complete'
                  )}
                </p>
                <button
                  onClick={() => router.push('/services')}
                  className="px-6 py-2 bg-white text-[#003B95] border border-[#003B95] rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Continue Ordering
                </button>
              </div>
               {/* Support Section */}
               <div className="bg-gray-50 border-t border-gray-200 py-8 mt-8">
                <div className="container mx-auto px-4">
                  <div className="max-w-6xl mx-auto text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                        <p className="text-gray-600 mb-4">If you have any questions or need assistance with your payment, our support team is here to help.</p>
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href="mailto:support@tiffinwala.com" className="text-[#003B95] hover:text-[#002F77] font-medium">
                            support@tiffinwala.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </CheckoutRoute>
  );
};

export default PendingVerificationPage; 