'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const ConfirmationPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get order details from localStorage
    const storedOrderDetails = localStorage.getItem('orderDetails');
    if (storedOrderDetails) {
      setOrderDetails(JSON.parse(storedOrderDetails));
    }
    
    // Clear order details from localStorage
    localStorage.removeItem('orderDetails');
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading confirmation details...</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
        <p className="text-gray-600 mb-8">No order details found.</p>
        <Link href="/" className="text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600">
              Thank you for your payment. Your transaction has been completed successfully.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Order Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium">{orderDetails.transactionId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">₹{orderDetails.amount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">UPI (QR Code)</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">Items</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.service} x {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>₹{orderDetails.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>₹{orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t">
              <p className="text-gray-600 mb-4">
                A confirmation email has been sent to your registered email address.
              </p>
              <p className="text-gray-600">
                You have earned {Math.floor(orderDetails.total / 100)} reward points for this transaction.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/" 
              className="inline-block bg-primary text-white py-3 px-6 rounded-md hover:bg-primary-dark transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ConfirmationPage;