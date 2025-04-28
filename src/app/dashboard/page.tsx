'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface Booking {
  _id: string;
  services: {
    serviceId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingDate: string;
  scheduledDate: string;
  paymentId: {
    _id: string;
    status: string;
    amount: number;
    paymentMethod: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${backendUrl}/api/bookings/my-bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch bookings');
        }

        const data = await response.json();
        if (data.success) {
          setBookings(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch bookings');
        }
      } catch (error: any) {
        console.error('Error fetching bookings:', error);
        setError(error.message || 'Failed to fetch bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      const data = await response.json();
      if (data.success) {
        // Update the bookings list
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        ));
      } else {
        throw new Error(data.error || 'Failed to cancel booking');
      }
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      setError(error.message || 'Failed to cancel booking');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const rescheduleBooking = async (bookingId: string, newDate: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      if (!selectedDate || !selectedTime) {
        toast.error('Please select both date and time');
        return;
      }

      // Combine date and time
      const scheduledDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes);

      // Ensure the date is in the future
      if (scheduledDateTime <= new Date()) {
        toast.error('Please select a future date and time');
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/reschedule`,
        { scheduledDate: scheduledDateTime.toISOString() },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update the booking in the state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId 
              ? { ...booking, scheduledDate: scheduledDateTime.toISOString() }
              : booking
          )
        );
        toast.success('Booking rescheduled successfully');
        setIsRescheduleModalOpen(false);
        setSelectedBooking(null);
        setSelectedDate(null);
        setSelectedTime('');
      } else {
        throw new Error(response.data.error || 'Failed to reschedule booking');
      }
    } catch (error: any) {
      console.error('Error rescheduling booking:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to reschedule booking');
    }
  };

  const isBookingPastDue = (scheduledDate: string) => {
    const scheduledDateTime = new Date(scheduledDate);
    const now = new Date();
    return scheduledDateTime < now;
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">My Bookings</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                View and manage your service bookings
              </p>
            </div>
            
            <div className="border-t border-gray-200">
              {isLoading ? (
                <div className="px-4 py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by booking a service.</p>
                  <div className="mt-6">
                    <Link
                      href="/services"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Browse Services
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Booking Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scheduled Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking._id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{booking.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(booking.bookingDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(booking.scheduledDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setIsViewModalOpen(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </button>
                              {!isBookingPastDue(booking.scheduledDate) && (
                                <button
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setIsRescheduleModalOpen(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Reschedule
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reschedule Modal */}
        {isRescheduleModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reschedule Booking</h3>
              
              
              <div className="mb-4">
                
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  minDate={new Date()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsRescheduleModalOpen(false);
                    setSelectedBooking(null);
                    setSelectedDate(null);
                    setSelectedTime('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => rescheduleBooking(selectedBooking._id, selectedDate?.toISOString() || '')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Booking Modal */}
        {isViewModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedBooking(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Booking ID</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking._id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="mt-1 text-sm text-gray-900">₹{selectedBooking.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Booking Date</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBooking.bookingDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Scheduled Date</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBooking.scheduledDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Status</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.paymentId?.status || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.paymentId?.paymentMethod || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Services</p>
                  <div className="border border-gray-200 rounded-md">
                    {selectedBooking.services.map((service, index) => (
                      <div key={index} className="px-4 py-3 border-b border-gray-200 last:border-b-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{service.name}</p>
                            <p className="text-sm text-gray-500">Quantity: {service.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">₹{service.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 