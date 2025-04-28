import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Welcome to Servio. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our website 
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Identity Data (name, username, date of birth)</li>
                <li>Contact Data (email address, phone number)</li>
                <li>Profile Data (username, password, preferences)</li>
                <li>Usage Data (how you use our website and services)</li>
                <li>Technical Data (IP address, browser type, device information)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p>We use your personal data for the following purposes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
              <p>
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
                used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, 
                contractors, and other third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Your Legal Rights</h2>
              <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: KunalKumar9457.kk@gmail.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p className="mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 