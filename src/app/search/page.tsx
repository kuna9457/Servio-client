'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import ServiceCard from '@/components/ServiceCard';
import { Service } from '@/types/service';

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { selectedLocation } = useLocation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/services/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(selectedLocation || '')}`);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError('Failed to load services. Please try again.');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchServices();
    }
  }, [query, selectedLocation]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003B95]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{query}"
        {selectedLocation && ` in ${selectedLocation}`}
      </h1>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No services found matching your search.</p>
          <p className="text-gray-500 mt-2">Try different keywords or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 