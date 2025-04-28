'use client';

import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { format, addDays, isAfter, setHours, setMinutes, addHours } from 'date-fns';

const CheckoutPage = () => {
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    scheduledDate: '',
    scheduledTime: ''
  });

  // Calculate minimum date (12 hours from now)
  const minDate = format(addHours(new Date(), 12), 'yyyy-MM-dd');
  
  // Generate time slots (8 AM to 9 PM)
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 9; // 8 AM to 9 PM
    return format(setHours(setMinutes(new Date(), 0), hour), 'HH:mm');
  });

  useEffect(() => {
    // Get user details from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData) {
      setFormData(prev => ({
        ...prev,
        fullName: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate form data
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address || 
          !formData.city || !formData.state || !formData.zipCode) {
        throw new Error('Please fill in all required fields');
      }

      // Validate phone number format
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Validate date and time selection
      if (!formData.scheduledDate || !formData.scheduledTime) {
        throw new Error('Please select both date and time for the service');
      }

      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      const now = new Date();
      const minDateTime = addHours(now, 12);

      if (!isAfter(scheduledDateTime, minDateTime)) {
        throw new Error('Service must be booked at least 12 hours in advance');
      }

      // Save customer details to localStorage
      localStorage.setItem('customerDetails', JSON.stringify(formData));
      localStorage.setItem('userPhone', formData.phone); // Save phone number separately
      localStorage.setItem('userName', formData.fullName);
      localStorage.setItem('userEmail', formData.email);

      // Create booking data with service details
      const bookingData = {
        ...formData,
        services: items.map(item => ({
          serviceId: item.service._id,
          name: item.service.category,
          price: item.service.price,
          quantity: item.quantity,
          description: item.service.description,
          image: item.service.image
        })),
        totalAmount: total,
        scheduledDateTime,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save booking data to localStorage for payment page
      localStorage.setItem('bookingData', JSON.stringify(bookingData));

      // Route to payment page
      router.push('/payment');
    } catch (error) {
      console.error('Form error:', error);
      alert(error instanceof Error ? error.message : 'Please fill in all required fields');
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

  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* User Details Form */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                      placeholder="Enter 10-digit phone number"
                      title="Please enter a valid 10-digit phone number"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter 10-digit number without spaces or special characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Date and Time Selection */}
                  <div className="space-y-4">
                    {/* <div className="bg-gray-50 p-4 rounded-lg"> */}
                      {/* <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Date & Time</h3> */}
                      {/* <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-lg font-semibold">
                            {formData.scheduledDate ? format(new Date(formData.scheduledDate), 'MMM dd, yyyy') : 'No date selected'}
                          </div>
                          <div className="text-lg font-semibold text-primary">
                            {formData.scheduledTime ? format(new Date(`2000-01-01T${formData.scheduledTime}`), 'h:mm a') : 'No time selected'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              scheduledDate: '',
                              scheduledTime: ''
                            }));
                          }}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Clear
                        </button>
                      </div> */}
                    {/* </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Date
                        </label>
                        <input
                          type="date"
                          name="scheduledDate"
                          value={formData.scheduledDate}
                          onChange={handleInputChange}
                          min={minDate}
                          required
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Service must be booked at least 12 hours in advance
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Time
                        </label>
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                          {timeSlots.map(time => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => handleInputChange({ target: { name: 'scheduledTime', value: time } } as any)}
                              className={`p-2 text-sm rounded-md transition-colors ${
                                formData.scheduledTime === time
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                            </button>
                          ))}
                        </div>
                        {!formData.scheduledTime && (
                          <p className="text-xs text-red-500 mt-1">Please select a time slot</p>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.service._id} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.service.category}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">₹{(item.service.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-6 bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>

            {/* Selected Date & Time Summary */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Date & Time</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="text-base font-medium">
                      {formData.scheduledDate ? format(new Date(formData.scheduledDate), 'MMM dd, yyyy') : 'No date selected'}
                    </div>
                    <div className="text-base font-medium text-primary">
                      {formData.scheduledTime ? format(new Date(`2000-01-01T${formData.scheduledTime}`), 'h:mm a') : 'No time selected'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        scheduledDate: '',
                        scheduledTime: ''
                      }));
                    }}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CheckoutPage; 