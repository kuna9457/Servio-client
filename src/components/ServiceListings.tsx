'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import ServiceModal from './ServiceModal';
import { useCart } from '../context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { Service } from '@/types/service';
import { servicesAPI } from '../services/api';
import SearchBar from './search/SearchBar';

type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'rating-asc' | 'newest';

// Custom debounce function
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

const ServiceListings = () => {
  const { addToCart, getCartCount, removeFromCart, updateQuantity } = useCart();
  const { selectedLocation } = useLocation();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tiffin Services');
  const [displayCount, setDisplayCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>('tiffin1');

  // Use our custom debounce hook
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 300);

  // Update search query and generate suggestions
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Generate suggestions based on current input
    if (value.length > 1) {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Generate search suggestions
  const generateSuggestions = (query: string): string[] => {
    const queryLower = query.toLowerCase();
    const uniqueSuggestions = new Set<string>();
    
    // Add service titles that match
    services.forEach(service => {
      if (service.title.toLowerCase().includes(queryLower)) {
        uniqueSuggestions.add(service.title);
      }
      
      // Add categories that match
      if (service.category.toLowerCase().includes(queryLower)) {
        uniqueSuggestions.add(service.category);
      }
      
      // Add provider names that match
      if (service.provider.name.toLowerCase().includes(queryLower)) {
        uniqueSuggestions.add(service.provider.name);
      }
    });
    
    // Add common service types if they match
    const commonServices = [
      'Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 
      'Painting', 'Gardening', 'Moving', 'Handyman',
      'Cooking', 'Tutoring', 'Pet Care', 'Photography',
      'Tiffin', 'Food', 'Veg', 'Non-Veg', 'Egg'
    ];
    
    commonServices.forEach(service => {
      if (service.toLowerCase().includes(queryLower)) {
        uniqueSuggestions.add(service);
      }
    });
    
    return Array.from(uniqueSuggestions).slice(0, 5);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAllServices();
        const filteredServices = response.data.filter(
          (service: Service) => service.location === selectedLocation
        );
        
        // Add sample tiffin services if none exist
        const hasTiffinServices = filteredServices.some(
          (service: Service) => service.category === 'Tiffin Services'
        );
        
        if (!hasTiffinServices) {
          const tiffinServices: Service[] = [
            {
              _id: 'tiffin-1',
              title: 'Customize Meal',
              description: 'Create your own meal plan with customizable portions and items. Choose from our wide range of vegetarian dishes and set your preferred quantities.',
              category: 'Tiffin Services',
              price: 100,
              location: selectedLocation,
              availability: true,
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              provider: {
                _id: 'Gourmet Delights',
                name: 'Gourmet Delights',
                location: selectedLocation
              },
              rating: 4.1,
              reviews: 26,
              popularity: 88,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'tiffin-2',
              title: 'Veg Tiffin',
              description: 'Daily fresh vegetarian meals including roti, sabzi, dal, rice, and salad. Customizable menu options available.',
              category: 'Tiffin Services',
              price: 80,
              location: selectedLocation,
              availability: true,
              image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              provider: {
                _id: 'Taste of Home',
                name: 'Taste of Home',
                location: selectedLocation
              },
              rating: 4.2,
              reviews: 31,
              popularity: 95,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'tiffin-3',
              title: 'Non-Veg Tiffin',
              description: 'High-quality non-vegetarian meals with chicken/egg curry, rice, roti, and accompaniments. Weekly menu rotation.',
              category: 'Tiffin Services',
              price: 100,
              location: selectedLocation,
              availability: true,
              image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              provider: {
                _id: 'Gourmet Delights',
                name: 'Gourmet Delights',
                location: selectedLocation
              },
              rating: 4.3,
              reviews: 39,
              popularity: 88,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'tiffin-4',
              title: 'Traditional Indian Homestyle Meals',
              description: 'Authentic Indian home-cooked meals prepared with traditional recipes and fresh ingredients. Includes regional specialties and seasonal dishes.',
              category: 'Tiffin Services',
              price: 110,
              location: selectedLocation,
              availability: true,
              image: 'https://images.unsplash.com/photo-1585937421612-70a0083564be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              provider: {
                _id: 'Spice of India',
                name: 'Spice of India',
                location: selectedLocation
              },
              rating: 4.2,
              reviews: 24,
              popularity: 82,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'tiffin-5',
              title: 'Baby & Toddler Meal Plans',
              description: 'Nutritious and balanced meals specially designed for babies and toddlers. Includes purees, soft foods, and finger foods appropriate for different age groups.',
              category: 'Tiffin Services',
              price: 120,
              location: selectedLocation,
              availability: true,
              image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              provider: {
                _id: 'Little Bites',
                name: 'Little Bites',
                location: selectedLocation
              },
              rating: 4.1,
              reviews: 12,
              popularity: 90,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'tiffin-6',
              title: 'Ayurvedic Meals',
              description: 'Balanced meals prepared according to Ayurvedic principles. Customized based on your dosha type and health requirements.',
              category: 'Tiffin Services',
              price: 3800,
              location: selectedLocation,
              availability: true,
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              provider: {
                _id: 'provider-tiffin-5',
                name: 'AyurVeda Kitchen',
                location: selectedLocation
              },
              rating: 4.8,
              reviews: 92,
              popularity: 85,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'tiffin-7',
              title: 'High-Protein Fitness Meals',
              description: 'Protein-rich meals designed for fitness enthusiasts. Includes lean proteins, complex carbs, and healthy fats. Customizable based on your fitness goals.',
              category: 'Tiffin Services',
              price: 3500,
              location: selectedLocation,
              availability: true,
              image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              provider: {
                _id: 'provider-tiffin-6',
                name: 'FitFuel',
                location: selectedLocation
              },
              rating: 4.9,
              reviews: 108,
              popularity: 92,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'tiffin-8',
              title: 'Desserts Add-on',
              description: 'Daily dessert options to complement your meal plan. Includes traditional Indian sweets, healthy desserts, and seasonal specials.',
              category: 'Tiffin Services',
              price: 800,
              location: selectedLocation,
              availability: true,
              image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              provider: {
                _id: 'provider-tiffin-7',
                name: 'Sweet Delights',
                location: selectedLocation
              },
              rating: 4.8,
              reviews: 65,
              popularity: 78,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'tiffin-9',
              title: 'Budget-Friendly Meal Plan',
              description: 'Affordable daily meals with basic but nutritious food items. Perfect for students and working professionals.',
              category: 'Tiffin Services',
              price: 1800,
              location: selectedLocation,
              availability: true,
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              provider: {
                _id: 'provider-tiffin-3',
                name: 'Economy Meals',
                location: selectedLocation
              },
              rating: 4.5,
              reviews: 76,
              popularity: 82,
              createdAt: new Date().toISOString()
            }
          ];
          
          setServices([...filteredServices, ...tiffinServices]);
        } else {
          setServices(filteredServices);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedLocation]);

  // Filter and sort services
  const filteredAndSortedServices = services
    .filter((service) => {
      const locationMatch = selectedLocation === 'All Locations' || service.location === selectedLocation;
      const categoryMatch = service.category === 'Tiffin Services';
      const searchMatch = debouncedSearchQuery === '' || 
        service.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        service.provider.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return locationMatch && categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return b.popularity - a.popularity;
      }
    });

  // Get unique categories
  const categories = ['Tiffin Services'];

  // Get initial categories to always show
  const initialCategories = ['Tiffin Services'];
  const remainingCategories = categories.filter(cat => !initialCategories.includes(cat));

  // Add price range filter functionality
  const filterByPriceRange = (service: Service) => {
    if (!priceRange) return true;
    const price = service.price;
    switch (priceRange) {
      case '0-50':
        return price <= 50;
      case '51-100':
        return price > 50 && price <= 100;
      case '101-200':
        return price > 100 && price <= 200;
      case '201+':
        return price > 200;
      default:
        return true;
    }
  };

  // Add rating filter
  const filterByRating = (service: Service) => {
    return service.rating >= minRating;
  };

  // Add location filter function
  const filterByLocation = (service: Service) => {
    if (!selectedLocation) return true; // Show all services if no location is selected
    return service.location === selectedLocation;
  };

  // Food categories for the horizontal menu
  const foodCategories = [
    { id: 'tiffin1', name: 'Punjabi Patiala', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'tiffin2', name: 'Rotli Rasoi', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'tiffin3', name: 'Ghar Ka Bhojan', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'tiffin4', name: 'Bhog Bhoj', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'tiffin5', name: 'Desi Dabba', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'tiffin6', name: 'Tandoori Tiffins', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'tiffin7', name: 'Food Station', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 'tiffin8', name: 'Maharastrian rasoi', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  ];

  // Filter services by food category (tiffin type)
  const filterByFoodCategory = (service: Service) => {
    if (selectedFoodCategory === 'all') return true;
    
    // Map each tiffin category to specific services
    const tiffinMapping: {[key: string]: string[]} = {
      'tiffin1': ['Customize Meal','Veg Tiffin', 'Non-Veg Tiffin'], // Punjabi Patiala
      'tiffin2': ['Veg Tiffin', 'Customize Meal'], // Rotli Rasoi
      'tiffin3': ['Non-Veg Tiffin', 'Customize Meal'], // Ghar Ka Bhojan
      'tiffin4': ['Veg Tiffin', 'Monthly Veg Thali','Customize Meal'], // Bhog Bhoj
      'tiffin5': ['Customize Meal'], // Desi Dabba
      'tiffin6': ['Non-Veg Tiffin', 'Non-Veg Tiffin','Customize Meal'], // Tandoori Tiffins
      'tiffin7': ['Customize Meal','Ayurvedic Meals'], // Food Station
      'tiffin8': ['Veg Tiffin','Customize Meal','Non-Veg Tiffin'] // Maharastrian rasoi
    };
    
    // Check if the service title contains any of the mapped tiffin names
    const mappedTitles = tiffinMapping[selectedFoodCategory] || [];
    return mappedTitles.some(title => service.title.includes(title));
  };

  // Update the finalFilteredServices to include food category filter
  const finalFilteredServices = filteredAndSortedServices
    .filter(filterByLocation)
    .filter(filterByPriceRange)
    .filter(filterByRating)
    .filter(filterByFoodCategory);

  const displayedServices = finalFilteredServices.slice(0, displayCount);

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

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
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

  // Group services by category when "All" is selected
  const groupedServices = selectedCategory === 'All' 
    ? services.reduce((acc, service) => {
        if (!acc[service.category]) {
          acc[service.category] = [];
        }
        acc[service.category].push(service);
        return acc;
      }, {} as { [key: string]: Service[] })
    : { [selectedCategory]: finalFilteredServices };

  // Add location availability message
  const renderLocationMessage = () => {
    if (!selectedLocation) return null;
    
    const servicesInLocation = services.filter(service => service.location === selectedLocation);
    
    if (servicesInLocation.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-600 mb-4">
            No services available in {selectedLocation} at the moment.
          </div>
          <div className="text-sm text-gray-500">
            Please try selecting a different location or check back later.
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Reset selectedFoodCategory when location changes only
  useEffect(() => {
    if (selectedLocation) {
      setSelectedFoodCategory('tiffin1');
    }
  }, [selectedLocation]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#003B95] mb-4 sm:mb-8 px-1">Our Services</h1>

      {/* Search and Filter Section */}
      <div className="mb-4 sm:mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
          {/* Search Bar */}
        <div className="relative mb-4 sm:mb-6 mx-1 sm:mx-0">
          <SearchBar 
              value={searchQuery}
            onChange={handleSearchChange}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs sm:text-sm text-gray-700"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Pills and Filters */}
        <div className="flex items-center justify-between gap-3 mb-4 mx-1 sm:mx-0">
          {/* Category Pills */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-[#003B95] text-white shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Show All Filters Button */}
          <button
            onClick={() => setShowAllFilters(!showAllFilters)}
            className="shrink-0 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#003B95] hover:text-[#002F77] gap-1 bg-gray-50 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            {showAllFilters ? 'Hide Filters' : 'Show All Filters'}
            <svg
              className={`w-4 h-4 transition-transform ${showAllFilters ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          </div>

        {/* Additional Filters */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden mx-1 sm:mx-0 ${
          showAllFilters ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
          {/* Sort Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort By</label>
          <div className="relative">
            <select
              value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-[#003B95] focus:border-transparent text-sm bg-gray-50"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="rating-asc">Lowest Rated</option>
            </select>
            <svg
              className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
              </div>
          </div>

          {/* Price Range Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Range</label>
          <div className="relative">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-[#003B95] focus:border-transparent text-sm bg-gray-50"
            >
              <option value="">All Prices</option>
              <option value="0-50">₹0 - ₹50</option>
              <option value="51-100">₹51 - ₹100</option>
              <option value="101-200">₹101 - ₹200</option>
              <option value="201+">₹201+</option>
            </select>
            <svg
              className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Rating</label>
              <div className="flex flex-wrap items-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  minRating === rating
                    ? 'bg-[#003B95] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {rating}+
              </button>
            ))}
          </div>
        </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 mx-1 sm:mx-0">
          Showing {displayedServices.length} of {finalFilteredServices.length} services
        </div>
      </div>

      {/* Location message */}
      {renderLocationMessage()}

      {/* Food Category Horizontal Menu - Only show for All or Tiffin Services */}
      {(selectedCategory === 'All' || selectedCategory === 'Tiffin Services') && (
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4 overflow-x-auto no-scrollbar">
          <h3 className="text-lg font-semibold text-[#003B95] mb-4 px-1">Select Tiffin Type</h3>
          <div className="flex space-x-6 pb-2 px-1 min-w-max">
            {foodCategories.map((category) => (
              <div 
                key={category.id}
                onClick={() => setSelectedFoodCategory(category.id)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden transition-all duration-300 ${
                  selectedFoodCategory === category.id 
                    ? 'ring-2 ring-[#003B95] transform scale-105 shadow-sm' 
                    : 'ring-1 ring-gray-200 group-hover:ring-gray-300'
                }`}>
                  <div className="relative w-full h-full">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <span className={`mt-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                  selectedFoodCategory === category.id ? 'text-[#003B95]' : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid */}
      {selectedCategory === 'All' ? (
        <div className="space-y-8">
          {Object.entries(groupedServices).map(([category, services]) => {
            const filteredServices = services.filter(filterByLocation);
            if (filteredServices.length === 0) return null;
            
            return (
              <div key={category} className="space-y-4">
                {/* Category Heading */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#003B95]">{category}</h2>
                  <span className="text-sm text-gray-500">{filteredServices.length} services</span>
                </div>
                
                {/* Services Grid for this Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Apply food category filter if it's Tiffin Services */}
                  {(category === 'Tiffin Services' ? filteredServices.filter(filterByFoodCategory) : filteredServices).map((service) => (
          <div
            key={service._id}
            onClick={() => handleServiceClick(service)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
          >
                      <div className="relative h-48 sm:h-52">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
                      <div className="p-4 sm:p-5">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{service.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                            <span className="text-[#003B95] font-semibold text-base sm:text-lg">₹{service.price}</span>
                            <span className="text-gray-500 text-xs sm:text-sm ml-1 sm:ml-2">/Person</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                            <span className="text-gray-600 text-xs sm:text-sm ml-1">{service.rating}</span>
                            <span className="text-gray-500 text-xs sm:text-sm ml-1">({service.reviews})</span>
                </div>
              </div>
                        <div className="mt-3 sm:mt-4 flex justify-between items-center">
                          <span className="text-gray-500 text-xs sm:text-sm">{service.location}</span>
                {renderCartButton(service)}
              </div>
            </div>
          </div>
        ))}
      </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Render single category view
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-1 sm:px-0">
          {/* Apply food category filter if it's Tiffin Services */}
          {(selectedCategory === 'Tiffin Services' ? finalFilteredServices.filter(filterByFoodCategory) : finalFilteredServices).map((service) => (
            <div
              key={service._id}
              onClick={() => handleServiceClick(service)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="relative h-48 sm:h-52">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{service.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-[#003B95] font-semibold text-base sm:text-lg">₹{service.price}</span>
                    {/* <span className="text-gray-500 text-xs sm:text-sm ml-1 sm:ml-2">/</span> */}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-600 text-xs sm:text-sm ml-1">{service.rating}</span>
                    <span className="text-gray-500 text-xs sm:text-sm ml-1">({service.reviews})</span>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex justify-between items-center">
                  <span className="text-gray-500 text-xs sm:text-sm">{service.location}</span>
                  {renderCartButton(service)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {displayedServices.length < finalFilteredServices.length && (
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={() => setDisplayCount(prev => prev + 6)}
            className="bg-[#003B95] text-white px-6 sm:px-8 py-2.5 rounded-lg hover:bg-[#002F77] transition-all duration-200 text-sm sm:text-base shadow-sm hover:shadow-md"
          >
            Load More ({finalFilteredServices.length - displayedServices.length} remaining)
          </button>
        </div>
      )}

      {/* No Results Message */}
      {displayedServices.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-base sm:text-lg">No services found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setPriceRange('');
              setMinRating(0);
              setDisplayCount(6);
            }}
            className="mt-4 text-[#003B95] hover:text-[#002F77] text-sm sm:text-base font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Service Modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default ServiceListings; 