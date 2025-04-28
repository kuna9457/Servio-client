'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

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
    transactionId?: string;
  };
  notes?: string;
}

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/bookings/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch booking details');
        }

        const data = await response.json();
        if (data.success) {
          setBooking(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch booking details');
        }
      } catch (error: any) {
        console.error('Error fetching booking details:', error);
        setError(error.message || 'Failed to fetch booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [params.id, router]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
          <div className="mt-6 text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
            <p className="mt-2 text-gray-600">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Booking Details
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Booking ID: {booking._id}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Booking Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(booking.bookingDate)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Scheduled Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(booking.scheduledDate)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Services</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      {booking.services.map((service, index) => (
                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <span className="ml-2 flex-1 w-0 truncate">{service.name}</span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className="font-medium text-gray-900">₹{service.price.toFixed(2)}</span>
                            <span className="ml-2 text-gray-500">x{service.quantity}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Payment Details</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-gray-500">Payment ID</p>
                          <p className="font-medium">{booking.paymentId._id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Payment Method</p>
                          <p className="font-medium">{booking.paymentId.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Transaction ID</p>
                          <p className="font-medium">{booking.paymentId.transactionId || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Amount</p>
                          <p className="font-medium">₹{booking.paymentId.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </dd>
                </div>
                {booking.notes && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900">{booking.notes}</dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:px-6">
              <div className="flex justify-between">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Dashboard
                </Link>
                {booking.status === 'pending' && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this booking?')) {
                        // Handle cancellation
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 