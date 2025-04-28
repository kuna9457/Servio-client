'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Service } from '@/types/service';
import { servicesAPI } from '@/services/api';

const processSteps = [
  {
    title: 'Browse Services',
    description: 'Explore our wide range of professional services, from home cleaning to plumbing. Each service is carefully curated to meet your needs.',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    title: 'Book a Service',
    description: 'Select your preferred service, choose a date and time, and book instantly. Our platform makes scheduling easy and convenient.',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: 'Track Progress',
    description: 'Monitor your service in real-time. Get updates on arrival time, service progress, and completion status.',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  {
    title: 'Rate & Review',
    description: 'Share your experience and help others make informed decisions. Your feedback helps us maintain high service standards.',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  }
];

const features = [
  {
    title: 'Verified Service Providers',
    description: 'All our service providers undergo thorough background checks and verification processes.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Secure Payments',
    description: 'Your payments are processed securely through our trusted payment gateway.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    title: '24/7 Support',
    description: 'Our customer support team is available round the clock to assist you.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
];

const transformServiceForCart = (service: Service) => {
  return {
    _id: service._id,
    category: service.category,
    provider: service.provider.name,
    price: service.price,
    image: service.image,
    description: service.description,
  };
};

export default function WhatWeDo() {
  const { addToCart, getCartCount, removeFromCart, updateQuantity } = useCart();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAllServices();
        setServices(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = ['All', ...Array.from(new Set(services.map(service => service.category)))];
  const displayedServices = services.slice(0, displayCount);

  const handleAddToCart = (service: Service) => {
    addToCart(transformServiceForCart(service));
  };

  const handleRemoveFromCart = (serviceId: string) => {
    removeFromCart(serviceId);
  };

  const handleUpdateQuantity = (serviceId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(serviceId);
    } else {
      updateQuantity(serviceId, newQuantity);
    }
  };

  const renderCartButton = (service: Service) => {
    const count = getCartCount(service._id);
    
    if (count === 0) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(service);
          }}
          className="bg-[#003B95] text-white px-3 py-1 rounded-md text-sm hover:bg-[#002F77] transition-colors"
        >
          Add to Cart
        </button>
      );
    } else {
      return (
        <div className="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateQuantity(service._id, count - 1);
            }}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-sm font-medium">{count}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateQuantity(service._id, count + 1);
            }}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      );
    }
  };

  return (
    <div className="bg-[#003B95]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#003B95] opacity-5"></div>
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent text-white"
          >
            What We Do
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-50 max-w-2xl mx-auto"
          >
            We connect customers with trusted service providers, making it easy to find and book professional
            services for your home and business needs.
          </motion.p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-16"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#003B95] to-[#002F77] opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
                <div className="bg-[#003B95] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-16"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-[#003B95] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

   

      {/* Service Provider Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">For Service Providers</h2>
              <p className="text-gray-600 mb-8">
                Join our platform to grow your business and reach more customers. We provide tools and support
                to help you succeed.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Easy booking management',
                  'Secure payment processing',
                  'Customer management tools',
                  'Marketing support'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center text-gray-600"
                  >
                    <svg className="w-5 h-5 text-[#003B95] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Link
                href="/professional"
                className="inline-block bg-[#003B95] text-white px-8 py-4 rounded-lg hover:bg-[#002F77] transition-colors shadow-lg hover:shadow-xl"
              >
                Become a Provider
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src="/nework.jpg"
                alt="Professional service provider working on a home improvement project"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl order-2 md:order-1"
            >
              <Image
                src="/cust.jpg"
                alt="Satisfied customer receiving professional service at home"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-1 md:order-2"
            >
              <h2 className="text-3xl font-bold mb-6">For Customers</h2>
              <p className="text-gray-600 mb-8">
                Find and book trusted service providers for all your needs. Our platform makes it easy to
                compare services and make informed decisions.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Verified service providers',
                  'Easy booking process',
                  'Real-time tracking',
                  'Secure payments'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center text-gray-600"
                  >
                    <svg className="w-5 h-5 text-[#003B95] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Link
                href="/services"
                className="inline-block bg-[#003B95] text-white px-8 py-4 rounded-lg hover:bg-[#002F77] transition-colors shadow-lg hover:shadow-xl"
              >
                Book a Service
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 