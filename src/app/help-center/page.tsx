'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaQuestionCircle, FaShieldAlt, FaUserCog, FaTimesCircle, FaHeadset, FaCalendarTimes, FaCalendar } from 'react-icons/fa';

const helpSections = [
  {
    title: 'FAQ',
    description: 'Find answers to commonly asked questions about our services, booking process, and more.',
    icon: FaQuestionCircle,
    href: '/help-center/faq',
    color: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Safety Information',
    description: 'Learn about our safety measures, verification process, and how we ensure your security.',
    icon: FaShieldAlt,
    href: '/help-center/safety',
    color: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  {
    title: 'Customer Service',
    description: 'Get in touch with our support team for any queries or assistance you may need.',
    icon: FaHeadset,
    href: '/help-center/customer-service',
    color: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    title: 'Rescheduling Policy',
    description: 'Understand our rescheduling policies for different services.',
    icon: FaCalendar ,
    href: '/help-center/rescheduling',
    color: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
  },
  {
    title: 'Service Guarantee',
    description: 'Learn about our service quality guarantees and what to do if you\'re not satisfied.',
    icon: FaUserCog,
    href: '/help-center/guarantee',
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
  },
];

export default function HelpCenterPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#003B95] text-white py-16"> 
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">How Can We Help You?</h1>
            <p className="text-xl text-white/90">
              Find answers to your questions or get in touch with our support team
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          

          {/* Help Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className={`group block ${section.color} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${section.iconColor} bg-white shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-gray-600">{section.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          
        </div>
      </div>
    </div>
  );
} 


// {/* Contact Support Section */}
// <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
// <div className="max-w-3xl mx-auto text-center">
//   <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
//   <p className="text-gray-600 mb-6">
//     Our support team is available 24/7 to assist you with any questions or concerns.
//   </p>
//   <div className="flex flex-col sm:flex-row justify-center gap-4">
//     <a
//       href="mailto:support@servio.com"
//       className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
//     >
//       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//       </svg>
//       Email Support
//     </a>
//     {/* <a
//       href="tel:+1234567890"
//       className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//     >
//       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//       </svg>
//       Call Support
//     </a> */}
//   </div>
// </div>
// </div>