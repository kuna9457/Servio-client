import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Servio, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p>
                Servio is a platform that connects service providers with customers. We provide a marketplace where 
                professionals can offer their services and customers can find and book these services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
              <p>To use our service, you must:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                {/* <li>Be at least 18 years of age</li> */}
                <li>Register for an account with accurate information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Service Provider Responsibilities</h2>
              <p>Service providers on our platform must:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide accurate information about their services</li>
                <li>Maintain professional standards and qualifications</li>
                <li>Honor bookings and appointments</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Maintain appropriate insurance coverage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Customer Responsibilities</h2>
              <p>Customers using our platform must:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide accurate booking information</li>
                <li>Respect service providers' time and policies</li>
                <li>Pay for services as agreed</li>
                <li>Provide honest feedback and reviews</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Payments and Fees</h2>
              <p>
                Servio may charge fees for certain services. All fees are clearly displayed before you use the service. 
                We use secure payment processing systems, but we are not responsible for any issues that may arise with 
                third-party payment processors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Rescheduling Policy</h2>
              <p>
              Rescheduling policies may vary by service provider. Please review the specific Rescheduling policy 
                before booking a service. 
              </p>
            </section>

                {/* <section>
                <h2 className="text-xl font-semibold mb-4">8. Intellectual Property</h2>
                <p>
                    All content on Servio, including but not limited to text, graphics, logos, and software, is the 
                    property of Servio or its content suppliers and is protected by international copyright laws.
                </p>
                </section> */}

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p>
                Servio shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any changes by updating 
                the "Last updated" date of these terms.
              </p>
              <p className="mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
                <br />
                Email: KunalKumar9457.kk@gmail.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 