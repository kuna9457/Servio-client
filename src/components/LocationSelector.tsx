import { useState, useRef, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';

const locations = [
  'Ghansoli',
  'Airoli',
  'Kopar khairane',
  'Rabale',
  'Vashi',
];

const LocationSelector = () => {
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsOpen(false);
    localStorage.setItem('selectedLocation', location);
  };

  return (
    <div className="relative" ref={locationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 text-sm transition-colors ${
          selectedLocation 
            ? 'text-[#003B95]' 
            : 'text-gray-600 hover:text-[#003B95]'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{selectedLocation || 'Select Location'}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => handleLocationSelect(location)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                selectedLocation === location
                  ? 'bg-[#003B95] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSelector; 