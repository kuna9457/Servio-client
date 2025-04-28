'use client';

import Link from 'next/link';

export default function SafetyInformation() {
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

        <h1 className="text-3xl font-bold mb-8">Safety Information</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Safety Commitment</h2>
            <p className="text-gray-600 mb-4">
              At our service platform, your safety is our top priority. We implement comprehensive safety measures
              to ensure a secure and reliable service experience for both customers and service providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Service Provider Verification</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Thorough background checks for all service providers</li>
              <li>Identity verification and documentation review</li>
              <li>Regular safety training and certification requirements</li>
              <li>Continuous monitoring of service quality and safety records</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Safety Protocols</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">For Customers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Secure payment processing</li>
                  <li>• Real-time service tracking</li>
                  <li>• Emergency contact system</li>
                  <li>• Service provider ratings and reviews</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">For Service Providers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Personal safety equipment</li>
                  <li>• Insurance coverage</li>
                  <li>• Emergency support system</li>
                  <li>• Regular safety assessments</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">COVID-19 Safety Measures</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-2 text-gray-600">
                <li>• Regular health screenings for service providers</li>
                <li>• Personal protective equipment requirements</li>
                <li>• Sanitization protocols between services</li>
                <li>• Contactless service options available</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Emergency Procedures</h2>
            <p className="text-gray-600 mb-4">
              In case of any emergency or safety concern, our 24/7 support team is always available to assist you.
              We have established protocols to handle various emergency situations promptly and effectively.
            </p>
            <div className="bg-primary text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Emergency Contact</h3>
              <p className="text-lg">24/7 Support Line: (555) 123-4567</p>
              <p className="text-lg">Emergency Email: emergency@example.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 