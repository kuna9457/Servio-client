'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
const Footer = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
           
          <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
              {/* <span className="ml-2 text-base sm:text-lg font-semibold text-gray-900">ServiceHub</span> */}
            </Link>
            <p className="text-gray-400">
              Connecting you with trusted service providers for all your needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className={`text-gray-400 hover:text-white transition-colors ${
                    isActive('/') ? 'text-white' : ''
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className={`text-gray-400 hover:text-white transition-colors ${
                    isActive('/services') ? 'text-white' : ''
                  }`}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/what-we-do"
                  className={`text-gray-400 hover:text-white transition-colors ${
                    isActive('/what-we-do') ? 'text-white' : ''
                  }`}
                >
                  What We Do
                </Link>
              </li>
              <li>
                <Link
                  href="/professional"
                  className={`text-gray-400 hover:text-white transition-colors ${
                    isActive('/professional') ? 'text-white' : ''
                  }`}
                >
                  Register as Professional
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help-center"
                  className={`text-gray-400 hover:text-white transition-colors ${
                    isActive('/help-center') ? 'text-white' : ''
                  }`}
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center/safety"
                  className={`text-gray-400 hover:text-white transition-colors ${
                    isActive('/help-center/safety') ? 'text-white' : ''
                  }`}
                >
                  Safety Information
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center/rescheduling"
                  className={`text-gray-400 hover:text-white transition-colors ${
                    isActive('/help-center/rescheduling') ? 'text-white' : ''
                  }`}
                >
                  Rescheduling Options
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center/faq"
                  className={`text-gray-400 hover:text-white transition-colors ${
                    isActive('/help-center/faq') ? 'text-white' : ''
                  }`}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <span className="block">Email:</span>
                {/* <a href="mailto:support@servicehub.com" className="hover:text-white transition-colors"> */}
                  KunalKumar9457.kk@gmail.com
                {/* </a> */}
              </li>
              {/* <li className="text-gray-400">
                <span className="block">Phone:</span>
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  (123) 456-7890
                </a>
              </li> */}
              {/* <li className="text-gray-400">
                <span className="block">Address:</span>
                <span>123 Service Street</span>
                <span>New York, NY 10001</span>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Servio. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
              <Link 
                href="/professional" 
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
              >
                Register as Professional
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 