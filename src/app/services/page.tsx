'use client';

import ServiceListings from '@/components/ServiceListings';

const ServicesPage = () => {
  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8 px-1">Our Services</h1> */}
      <ServiceListings />
    </div>
  );
};

export default ServicesPage; 