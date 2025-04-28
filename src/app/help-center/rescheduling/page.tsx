'use client';

import Link from 'next/link';

export default function ReschedulingOptions() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/help-center"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Help Center
        </Link>

        <h1 className="text-3xl font-bold mb-8">Rescheduling Options</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Rescheduling Policy</h2>
            <p className="text-gray-600 mb-4">
              We understand that plans can change. Our flexible rescheduling policy allows you to modify or cancel
              your service booking with minimal hassle. Here's how our rescheduling system works:
            </p>
          </section>

          {/* <section>
            <h2 className="text-2xl font-semibold mb-4">Cancellation Timeframes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Free Cancellation</h3>
                <p className="text-gray-600 mb-2">Available up to 24 hours before the scheduled service</p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Full refund of payment</li>
                  <li>• No cancellation fee</li>
                  <li>• Instant confirmation</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Late Cancellation</h3>
                <p className="text-gray-600 mb-2">Between 24 hours and 2 hours before service</p>
                <ul className="space-y-2 text-gray-600">
                  <li>• 50% refund of payment</li>
                  <li>• Small cancellation fee</li>
                  <li>• Subject to availability</li>
                </ul>
              </div>
            </div>
          </section> */}

          <section>
            <h2 className="text-2xl font-semibold mb-4">How to Reschedule</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  Log in to your account
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  Go to "Dashboard"
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  Select the booking you want to reschedule
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">4.</span>
                  Click "Reschedule Booking"
                </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">5.</span>
                    Select Date and Time
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">5.</span>
                    Confirm Rescheduling
                  </li>

              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Rescheduling Options</h2>
            <p className="text-gray-600 mb-4">
              Instead of canceling, you can also reschedule your service to a more convenient time:
            </p>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ul className="space-y-2 text-gray-600">
                <li>• Free rescheduling up to 24 hours before service</li>
                <li>• Multiple rescheduling options available</li>
                <li>• Maintain your original price</li>
                <li>• No additional fees</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              If you need assistance with rescheduling or have any questions, our support team is here to help.
            </p>
            <div className="bg-gray-100 text-black p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
              {/* <p className="text-lg">Phone: (555) 123-4567</p> */}
              <p className="text-lg">Email: kunalkumar9457.kk@gmail.com</p>
              {/* <p className="text-lg">Hours: 24/7 Support Available</p> */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 