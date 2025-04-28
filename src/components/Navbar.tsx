'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import LoginModal from './auth/LoginModal';
import CartIcon from './cart/CartIcon';
import SearchBar from './search/SearchBar';
import { useUser } from '../context/UserContext';
import AuthModal from './auth/AuthModal';
import Image from 'next/image';
import LocationSelector from './LocationSelector';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, logout } = useUser();
  const profileRef = useRef<HTMLDivElement>(null);
  const { items: cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const locations = [
    'All Locations',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad'
  ];

  const isActive = (path: string) => pathname === path;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (value.length > 1) {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Scroll to services section and trigger search
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const generateSuggestions = (query: string): string[] => {
    const queryLower = query.toLowerCase();
    const uniqueSuggestions = new Set<string>();
    
    const commonServices = [
      'Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 
      'Painting', 'Gardening', 'Moving', 'Handyman',
      'Cooking', 'Tutoring', 'Pet Care', 'Photography'
    ];
    
    commonServices.forEach(service => {
      if (service.toLowerCase().includes(queryLower)) {
        uniqueSuggestions.add(service);
      }
    });
    
    return Array.from(uniqueSuggestions).slice(0, 5);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    
    // Scroll to services section
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSignInClick = () => {
    setIsMobileMenuOpen(false);
    setIsAuthModalOpen(true);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo.png"
                alt="Logo"
                width={90}
                height={90}
                className="rounded-full transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
          <Link 
              href="/dashboard" 
              className={`relative text-sm font-medium px-2 py-1 transition-all duration-300 ${
                isActive('/dashboard') 
                  ? 'text-[#003B95]' 
                  : 'text-gray-600 hover:text-[#003B95]'
              }`}
            >
              Dashboard
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#003B95] transform transition-all duration-300 ${
                isActive('/dashboard') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
            <Link 
              href="/services" 
              className={`relative text-sm font-medium px-2 py-1 transition-all duration-300 ${
                isActive('/services') 
                  ? 'text-[#003B95]' 
                  : 'text-gray-600 hover:text-[#003B95]'
              }`}
            >
              Services
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#003B95] transform transition-all duration-300 ${
                isActive('/services') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
            <Link 
              href="/what-we-do" 
              className={`relative text-sm font-medium px-2 py-1 transition-all duration-300 ${
                isActive('/what-we-do') 
                  ? 'text-[#003B95]' 
                  : 'text-gray-600 hover:text-[#003B95]'
              }`}
            >
              What We Do
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#003B95] transform transition-all duration-300 ${
                isActive('/what-we-do') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
            <Link 
              href="/professional" 
              className={`relative text-sm font-medium px-2 py-1 transition-all duration-300 ${
                isActive('/professional') 
                  ? 'text-[#003B95]' 
                  : 'text-gray-600 hover:text-[#003B95]'
              }`}
            >
              Register as Professional
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#003B95] transform transition-all duration-300 ${
                isActive('/professional') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Location Selector */}
            <div className="relative w-48">
              <LocationSelector />
            </div>

            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative text-gray-600 hover:text-[#003B95] p-1 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#003B95] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth/Profile Button */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-[#003B95] transition-all duration-300 hover:scale-105"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#003B95] to-[#002F77] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 animate-fadeIn border border-gray-100">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#003B95] transition-colors duration-300"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#003B95] transition-colors duration-300"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#003B95] transition-colors duration-300"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gradient-to-r from-[#003B95] to-[#002F77] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button and cart */}
          <div className="md:hidden flex items-center space-x-4">
            <Link 
              href="/cart" 
              className="relative text-gray-600 hover:text-[#003B95] p-1 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#003B95] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#003B95] hover:bg-gray-100 focus:outline-none transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6 transform rotate-180 transition-transform duration-300" />
              ) : (
                <FiMenu className="h-6 w-6 transform hover:rotate-90 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Mobile Menu Side Panel */}
      <div
        className={`fixed inset-y-0 right-0 transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } w-64 bg-white shadow-lg transition-all duration-300 ease-in-out z-50`}
        style={{ marginTop: '64px' }}
      >
        <div className="px-4 py-6">
          {/* Location Selector - Mobile */}
          <div className="mb-6">
            <LocationSelector />
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-4">
            <Link
              href="/services"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                isActive('/services')
                  ? 'text-[#003B95] bg-gray-50 transform scale-105'
                  : 'text-gray-600 hover:text-[#003B95] hover:bg-gray-50 hover:transform hover:scale-105'
              }`}
            >
              Services
            </Link>
            <Link
              href="/what-we-do"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                isActive('/what-we-do')
                  ? 'text-[#003B95] bg-gray-50 transform scale-105'
                  : 'text-gray-600 hover:text-[#003B95] hover:bg-gray-50 hover:transform hover:scale-105'
              }`}
            >
              What We Do
            </Link>
            <Link
              href="/professional"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                isActive('/professional')
                  ? 'text-[#003B95] bg-gray-50 transform scale-105'
                  : 'text-gray-600 hover:text-[#003B95] hover:bg-gray-50 hover:transform hover:scale-105'
              }`}
            >
              Register as Professional
            </Link>
          </div>

          {/* Mobile Auth/Profile Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            {user ? (
              <div className="space-y-4">
                <Link
                  href="/dashboard"
                  className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-50 hover:text-[#003B95] rounded-md transition-all duration-300 hover:transform hover:scale-105"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-50 hover:text-[#003B95] rounded-md transition-all duration-300 hover:transform hover:scale-105"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-50 hover:text-[#003B95] rounded-md transition-all duration-300 hover:transform hover:scale-105"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignInClick}
                className="w-full bg-[#003B95] text-white px-4 py-2 rounded-md hover:bg-[#002F77] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ marginTop: '64px' }}
        />
      )}
    </nav>
  );
};

export default Navbar;