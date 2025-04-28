'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What services does Servio offer?",
    answer: "Servio offers a variety of home services including tiffin services, maid services, and cooking services. We connect you with verified professionals who can help with your daily household needs."
  },
  {
    question: "How do I book a service?",
    answer: "Booking a service is simple! Just browse through our service categories, select the service you need, choose your preferred professional, and book through our platform. You can pay online or opt for pay-later options."
  },
  {
    question: "How are the professionals verified?",
    answer: "All professionals on our platform go through a thorough verification process including background checks, document verification, and skill assessment. We ensure that only qualified and trustworthy professionals are listed."
  },
  {
    question: "What are the payment options available?",
    answer: "We offer multiple payment options including online payment (UPI, cards, net banking) and pay-later options. You can choose the most convenient method during checkout."
  },
  {
    question: "Can I reschedule a booking?",
    answer: "Yes, you can reschedule your booking through your account dashboard. Please check our rescheduling policy for specific terms and conditions."
  },
  {
    question: "How do I become a professional on Servio?",
    answer: "You can register as a professional by filling out our registration form. We'll review your application and get back to you within 2-3 business days. Visit our 'Register as Professional' page to get started."
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "We value your satisfaction. If you're not happy with the service, please contact our customer support within 24 hours of service completion. We'll work with you to resolve the issue."
  },
  {
    question: "Are the prices fixed or negotiable?",
    answer: "The prices listed on our platform are fixed and transparent. Each professional sets their rates based on their expertise and service quality. You can see the exact pricing before booking."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach our customer support team through email at support@servio.com or call us at our helpline number. We're available 24/7 to assist you."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take data security very seriously. All your personal information is encrypted and protected according to industry standards. We never share your information with third parties without your consent."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-white">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for?
          </p>
          <a
            href="/help-center"
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
} 