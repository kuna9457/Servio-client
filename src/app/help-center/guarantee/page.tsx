'use client';

import Link from 'next/link';

export default function ServiceGuarantee() {
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

        <h1 className="text-3xl font-bold mb-8">Service Guarantee</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Guarantee to You</h2>
            <p className="text-gray-600 mb-4">
              We stand behind the quality of our services with comprehensive guarantees to ensure your complete
              satisfaction. Our commitment to excellence is backed by specific guarantees for different aspects
              of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Quality Guarantees</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Service Quality</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 100% satisfaction guarantee</li>
                  <li>• Professional service providers</li>
                  <li>• Quality materials and equipment</li>
                  <li>• Consistent service standards</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Timing Guarantee</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• On-time service delivery</li>
                  <li>• Punctual arrival</li>
                  <li>• Efficient service completion</li>
                  <li>• Real-time updates</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Money-Back Guarantee</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                If you're not completely satisfied with our service, we offer a money-back guarantee under the
                following conditions:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Request must be made within 24 hours of service</li>
                <li>• Valid reason for dissatisfaction</li>
                <li>• Service provider verification</li>
                <li>• Full refund within 5-7 business days</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Service Provider Guarantees</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ul className="space-y-2 text-gray-600">
                <li>• Background-checked professionals</li>
                <li>• Licensed and insured service providers</li>
                <li>• Regular training and certification</li>
                <li>• Professional conduct standards</li>
                <li>• Quality assurance monitoring</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Additional Protections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Insurance Coverage</h3>
                <p className="text-gray-600">
                  All our services are covered by comprehensive insurance to protect both customers and service
                  providers in case of any accidents or damages.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Quality Control</h3>
                <p className="text-gray-600">
                  Our quality control team regularly monitors service delivery and customer satisfaction to
                  maintain our high standards.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Making a Claim</h2>
            <p className="text-gray-600 mb-4">
              If you need to make a claim under any of our guarantees, our support team is here to help:
            </p>
            <div className="bg-primary text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
              <p className="text-lg">Phone: (555) 123-4567</p>
              <p className="text-lg">Email: support@example.com</p>
              <p className="text-lg">Hours: 24/7 Support Available</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 