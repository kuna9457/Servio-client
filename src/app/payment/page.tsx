'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { render } from '@react-email/components';
import OrderConfirmationEmail from '@/components/email/OrderConfirmationEmail';
import { useCheckout } from '@/context/CheckoutContext';
import CheckoutRoute from '@/components/auth/CheckoutRoute';
import { useRouteProtection } from '@/context/RouteProtectionContext';

interface PaymentMethod {
  id: 'qr' | 'pay_later';
  name: string;
  icon: string;
}

interface PaymentRequest {
  transactionId: string;
  amount: number;
  qrCode: string;
  upiLink: string;
  paymentMethod: string;
}

interface CartItem {
  id: string;
  service: {
    _id: string;
    category: string;
    provider: string;
    price: number;
    image: string;
    description: string;
  };
  quantity: number;
}

type PaymentMethodType = 'qr' | 'pay_later';

const paymentMethods: PaymentMethod[] = [
  { id: 'qr', name: 'QR Code Payment', icon: '📲' },
  { id: 'pay_later', name: 'Pay Later', icon: '⏰' }
];

const PaymentPage = () => {
  const router = useRouter();
  const { items, getTotal, clearCart, updateQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('qr');
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [dueDate, setDueDate] = useState('');
  
  // Add new state variables for card payment
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const { startCheckout, completePayment } = useCheckout();
  const { isRouteValid } = useRouteProtection();

  useEffect(() => {
    // Mark checkout as started when component mounts
    startCheckout();
  }, [startCheckout]);

  useEffect(() => {
    if (!isRouteValid) {
      router.push('/services');
      return;
    }
  }, [isRouteValid, router]);

  const handleGenerateQRCode = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      // Create payment order with QR code
      const response = await fetch('/api/payments/create-qr-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: getTotal() * 1.1,
          currency: 'INR',
          cartItems: items.map(item => ({
            name: item.service.category,
            quantity: item.quantity,
            price: item.service.price
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      // Log the entire response for debugging
      console.log('API Response:', data);

      // Set payment request with QR code data
      setPaymentRequest({
        transactionId: data.data.transactionId || data.transactionId,
        amount: data.data.amount || data.amount,
        qrCode: data.data.qrCode || data.qrCode,
        upiLink: data.data.upiLink || data.upiLink,
        paymentMethod: 'qr'
      });

    } catch (error: any) {
      console.error('Error generating QR code:', error);
      setErrors({ 
        general: `Failed to generate QR code: ${error.message}. Please try again or contact support if the issue persists.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!paymentRequest) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/payments/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          transactionId: paymentRequest.transactionId,
          cartItems: items // Send cart items for booking creation
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify payment');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      // Store order details for the pending verification page
      const orderDetails = {
        transactionId: paymentRequest.transactionId,
        customerName: localStorage.getItem('userName') || 'Customer',
        amount: paymentRequest.amount,
        items: items.map(item => ({
          name: item.service.category,
          quantity: item.quantity,
          price: item.service.price
        })),
        subtotal: getTotal(),
        tax: getTotal() * 0.1,
        total: getTotal() * 1.1,
        paymentMethod: 'qr'
      };

      // Send confirmation email from frontend
      try {
        const emailHtml = render(
          <OrderConfirmationEmail orderDetails={orderDetails} />
        );

        const emailResponse = await fetch('/api/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            customerEmail: localStorage.getItem('userEmail'),
            customerName: localStorage.getItem('userName'),
            subject: `New Booking-${paymentRequest.transactionId}`,
            orderDetails: {
              orderId: paymentRequest.transactionId,
              scheduledDate: new Date().toISOString(),
              status: 'pending',
              services: items.map(item => ({
                name: item.service.category,
                quantity: item.quantity,
                price: item.service.price
              })),
              amount: paymentRequest.amount,
              paymentMethod: 'qr'
            }
          })
        });

        if (!emailResponse.ok) {
          console.error('Failed to send confirmation email:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
      
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      clearCart();
      setIsRedirecting(true);
      
      // Redirect to pending verification page after a short delay
      setTimeout(() => {
        router.push('/pending-verification');
      }, 2000);
      
      // After successful verification
      completePayment();
      
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      setErrors({ general: error.message || 'Failed to verify payment' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayLater = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      // Create payment order for pay later
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: getTotal() * 1.1,
          paymentMethod: 'pay_later',
          cartItems: items.map(item => ({
            name: item.service.category,
            quantity: item.quantity,
            price: item.service.price
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      // Verify the payment
      const verifyResponse = await fetch('/api/payments/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          transactionId: data.data.transactionId,
          cartItems: items,
          paymentMethod: 'pay_later'
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Failed to verify payment');
      }

      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        throw new Error(verifyData.error);
      }

      // Store order details for the confirmation page
      const orderDetails = {
        transactionId: data.data.transactionId,
        customerName: localStorage.getItem('userName') || 'Customer',
        amount: data.data.amount,
        items: items.map(item => ({
          name: item.service.category,
          quantity: item.quantity,
          price: item.service.price
        })),
        subtotal: getTotal(),
        tax: getTotal() * 0.1,
        total: getTotal() * 1.1,
        paymentMethod: 'pay_later',
        qrCode: data.data.qrCode,
        upiLink: data.data.upiLink
      };

      // Send confirmation email from frontend
      try {
        const emailHtml = render(
          <OrderConfirmationEmail orderDetails={orderDetails} />
        );

        const emailResponse = await fetch('/api/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            customerEmail: localStorage.getItem('userEmail'),
            customerName: localStorage.getItem('userName'),
            subject: `New Booking-${data.data.transactionId}`,
            orderDetails: {
              orderId: data.data.transactionId,
              scheduledDate: new Date().toISOString(),
              status: 'pending',
              services: items.map(item => ({
                name: item.service.category,
                quantity: item.quantity,
                price: item.service.price
              })),
              amount: data.data.amount,
              paymentMethod: 'pay_later'
            }
          })
        });

        if (!emailResponse.ok) {
          console.error('Failed to send confirmation email:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }

      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      clearCart();
      router.push('/pay-later');

      // After successful pay later setup
      completePayment();

    } catch (error: any) {
      console.error('Error processing pay later:', error);
      setErrors({
        general: `Failed to process pay later request: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToPayment = () => {
    if (selectedMethod === 'pay_later') {
      handlePayLater();
    } else if (selectedMethod === 'qr') {
      handleGenerateQRCode();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    handleContinueToPayment();
  };

  const handleUpdateQuantity = (serviceId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(serviceId, newQuantity);
    }
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      const paymentRequest = {
        amount: getTotal() * 1.1, // Include 10% tax
        currency: 'INR',
        items: items.map(item => ({
          name: item.service.category,
          quantity: item.quantity,
          price: item.service.price
        })),
        paymentMethod: selectedMethod,
        customerEmail: localStorage.getItem('userEmail'),
        customerName: localStorage.getItem('userName') || 'Customer',
        transactionId: `TXN-${Date.now()}` // Generate a unique transaction ID
      };

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentRequest)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      if (selectedMethod === 'qr') {
        // Store order details for the pending verification page
        const orderDetails = {
          transactionId: paymentRequest.transactionId,
          customerName: paymentRequest.customerName,
          amount: paymentRequest.amount,
          items: paymentRequest.items,
          subtotal: getTotal(),
          tax: getTotal() * 0.1,
          total: getTotal() * 1.1,
          paymentMethod: 'qr'
        };

        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
        router.push('/pending-verification');
      } else if (selectedMethod === 'pay_later') {
        // Store order details for the pay later page
        const orderDetails = {
          transactionId: data.data.transactionId,
          customerName: paymentRequest.customerName,
          amount: data.data.amount,
          items: paymentRequest.items,
          subtotal: getTotal(),
          tax: getTotal() * 0.1,
          total: getTotal() * 1.1,
          paymentMethod: 'pay_later'
        };

        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
        router.push('/pay-later');
      }
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CheckoutRoute>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#003B95]">Complete Your Purchase</h1>
                <p className="text-gray-600 mt-2">Secure payment processing</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
                    <h2 className="text-lg font-semibold text-[#003B95] mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Order Summary
                    </h2>
                    
                    {/* Detailed Order Items */}
                    <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                      {items.map((item) => (
                        <div key={item.service._id} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.service.image}
                              alt={item.service.category}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.service.category}</h3>
                            <p className="text-sm text-gray-500">{item.service.provider}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[#003B95] font-medium">₹{item.service.price.toFixed(2)}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium">₹{getTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (10%)</span>
                        <span className="font-medium">₹{(getTotal() * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-[#003B95]">₹{(getTotal() * 1.1).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Support Section */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Need Help?</h3>
                        <p className="text-sm text-gray-600 mb-2">If you have any questions about your order, our support team is here to help.</p>
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href="mailto:support@tiffinwala.com" className="text-sm text-[#003B95] hover:text-[#002F77] font-medium">
                            support@tiffinwala.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-[#003B95] mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Select Payment Method
                    </h2>

                    <div className="space-y-4">
                      {/* QR Code Payment */}
                      {selectedMethod === 'qr' && (
                        <div className="text-center p-6 border border-gray-200 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Scan QR Code to Pay</h3>
                          <div className="flex justify-center mb-4">
                            <div className="relative w-64 h-64 bg-white rounded-lg shadow-sm">
                              {paymentRequest?.qrCode ? (
                                <div className="w-full h-full p-2">
                                  <img
                                    src={paymentRequest.qrCode.startsWith('data:image') ? paymentRequest.qrCode : `data:image/png;base64,${paymentRequest.qrCode}`}
                                    alt="Payment QR Code"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                  <p className="text-gray-500">
                                    {isLoading ? 'Generating QR code...' : 'Click "Generate QR Code" to proceed'}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {paymentRequest?.qrCode ? 'Scan this QR code with your UPI app to complete the payment' : ''}
                          </p>
                          <div className="space-y-3">
                            {paymentRequest?.qrCode ? (
                              <>
                                <button
                                  onClick={handleVerifyPayment}
                                  disabled={isLoading}
                                  className="w-full py-2.5 px-4 bg-[#003B95] text-white rounded-lg hover:bg-[#002F77] transition-colors disabled:opacity-50"
                                >
                                  {isLoading ? 'Verifying...' : 'I have made the payment'}
                                </button>
                                
                              </>
                            ) : (
                              <button
                                onClick={handleGenerateQRCode}
                                disabled={isLoading}
                                className="w-full py-2.5 px-4 bg-[#003B95] text-white rounded-lg hover:bg-[#002F77] transition-colors disabled:opacity-50"
                              >
                                {isLoading ? 'Generating QR...' : 'Generate QR Code'}
                              </button>
                            )}
                          </div>
                          {errors.general && (
                            <p className="mt-3 text-sm text-red-600">{errors.general}</p>
                          )}
                        </div>
                      )}

                      {/* Pay Later Option */}
                      {selectedMethod === 'pay_later' && (
                        <div className="p-6 border border-gray-200 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Pay Later</h3>
                          <button
                            onClick={handlePayLater}
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 bg-[#003B95] text-white rounded-lg hover:bg-[#002F77] transition-colors disabled:bg-gray-400"
                          >
                            {isLoading ? 'Processing...' : 'Confirm Pay Later'}
                          </button>
                        </div>
                      )}

                      {/* Payment Method Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setSelectedMethod('qr')}
                          className={`p-4 border rounded-lg flex items-center gap-3 transition-all ${
                            selectedMethod === 'qr'
                              ? 'border-[#003B95] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`p-2 rounded-full ${
                            selectedMethod === 'qr' ? 'bg-[#003B95]' : 'bg-gray-100'
                          }`}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="font-medium">UPI Payment</span>
                        </button>
                        <button
                          onClick={() => setSelectedMethod('pay_later')}
                          className={`p-4 border rounded-lg flex items-center gap-3 transition-all ${
                            selectedMethod === 'pay_later'
                              ? 'border-[#003B95] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`p-2 rounded-full ${
                            selectedMethod === 'pay_later' ? 'bg-[#003B95]' : 'bg-gray-100'
                          }`}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="font-medium">Pay Later</span>
                        </button>
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

export default PaymentPage; 