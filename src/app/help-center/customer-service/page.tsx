'use client';

import Link from 'next/link';

export default function CustomerService() {
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

        <h1 className="text-3xl font-bold mb-8">Customer Service</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Phone Support</h3>
                <p className="text-gray-600 mb-2">24/7 Customer Service</p>
                <p className="text-2xl font-bold text-primary">(555) 123-4567</p>
                <p className="text-sm text-gray-500 mt-2">Average wait time: 2 minutes</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Email Support</h3>
                <p className="text-gray-600 mb-2">Response within 24 hours</p>
                <p className="text-2xl font-bold text-primary">support@example.com</p>
                <p className="text-sm text-gray-500 mt-2">For non-urgent inquiries</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Support Hours</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-2 text-gray-600">
                <p>• Monday - Friday: 24/7</p>
                <p>• Saturday: 24/7</p>
                <p>• Sunday: 24/7</p>
                <p className="mt-4">Emergency support available 24/7</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Common Support Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Booking Support</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Schedule changes</li>
                  <li>• Payment issues</li>
                  <li>• Service modifications</li>
                  <li>• Booking confirmation</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Technical Support</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• App/Website issues</li>
                  <li>• Account problems</li>
                  <li>• Payment processing</li>
                  <li>• Technical glitches</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Live Chat Support</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                Get instant help from our support team through our live chat feature. Available 24/7 for
                quick assistance with your queries.
              </p>
              <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors">
                Start Live Chat
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Social Media Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="#" className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <svg className="w-8 h-8 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <p className="mt-2 text-gray-600">Facebook</p>
              </a>
              <a href="#" className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <svg className="w-8 h-8 mx-auto text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <p className="mt-2 text-gray-600">Twitter</p>
              </a>
              <a href="#" className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <svg className="w-8 h-8 mx-auto text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-3.81.016-4.851.071-1.054.055-1.624.249-2.164.415-.549.217-.95.477-1.37.896-.419.419-.679.819-.896 1.37-.165.54-.359 1.11-.413 2.164-.057 1.042-.07 1.447-.07 4.851s.015 3.81.074 4.851c.061 1.054.256 1.624.421 2.164.224.549.479.95.899 1.37.419.419.824.679 1.38.896.54.165 1.11.359 2.164.413 1.042.057 1.447.07 4.851.07 3.405 0 3.81-.015 4.851-.074 1.054-.061 1.624-.256 2.164-.421.549-.224.95-.479 1.37-.899.419-.419.679-.824.896-1.38.165-.54.359-1.11.413-2.164.057-1.042.07-1.447.07-4.851s-.015-3.81-.074-4.851c-.061-1.054-.256-1.624-.421-2.164-.224-.549-.479-.95-.899-1.37-.419-.419-.824-.679-1.38-.896-.54-.165-1.11-.359-2.164-.413-1.042-.057-1.447-.07-4.851-.07zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
                <p className="mt-2 text-gray-600">Instagram</p>
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Submit a Ticket</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                For complex issues or detailed inquiries, submit a support ticket and our team will get back to
                you within 24 hours.
              </p>
              <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors">
                Create Support Ticket
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 