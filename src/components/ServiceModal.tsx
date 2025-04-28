'use client';

import { useCart } from '../context/CartContext';
import { Service } from '@/types/service';
import { useState } from 'react';
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';

interface ServiceModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (service: Service) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, isOpen, onClose, onAddToCart }) => {
  const { getCartCount, removeFromCart, updateQuantity } = useCart();
  const count = getCartCount(service._id);
  const [customQuantities, setCustomQuantities] = useState<{ [key: string]: number }>({
    'Sabzi': 1,
    'Roti': 3,
    'Dal': 250,
    'Rice': 300,
    'Pickles': 50,
    'Papad': 1,
    'Salad': 200
  });

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(service._id);
    } else {
      updateQuantity(service._id, newQuantity);
    }
  };

  const handleQuantityChange = (item: string, value: number | string) => {
    let newValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    newValue = Math.max(0, newValue); // Ensure value doesn't go below 0
    setCustomQuantities(prev => ({
      ...prev,
      [item]: newValue
    }));
  };

  const getQuantityDisplay = (item: string, quantity: number) => {
    switch (item) {
      case 'Roti':
      case 'Papad':
        return `${quantity} piece${quantity !== 1 ? 's' : ''}`;
      case 'Dal':
      case 'Rice':
      case 'Salad':
        return `${quantity}g`;
      case 'Pickles':
        return `${quantity}g (2 types)`;
      case 'Sabzi':
      default:
        return `${quantity}`;
    }
  };

  const renderCartButton = () => {
    if (count === 0) {
      return (
        <button
          onClick={() => onAddToCart(service)}
          className="bg-[#003B95] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#002F77] transition-colors"
        >
          Add to Cart
        </button>
      );
    } else {
      return (
        <div className="flex items-center justify-center gap-4 bg-gray-100 rounded-lg p-3">
          <button
            onClick={() => handleUpdateQuantity(count - 1)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-lg font-medium">{count}</span>
          <button
            onClick={() => handleUpdateQuantity(count + 1)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      );
    }
  };

  // Tiffin service menu data
  const tiffinMenu = {
    veg: [
      { name: 'Roti', quantity: '3 pieces (150g each)', price: 30, sabzi: 1 },
      { name: 'Dal', quantity: '250g', price: 40, sabzi: 1 },
      { name: 'Rice', quantity: '300g', price: 30, sabzi: 1 },
      { name: 'Pickles', quantity: '50g (2 types)', price: 10, sabzi: 1 },
      { name: 'Papad', quantity: '1 piece (20g)', price: 10, sabzi: 1 },
      { name: 'Salad', quantity: '200g', price: 20, sabzi: 1 }
    ],
    nonVeg: [
      { name: 'Roti', quantity: '3 pieces', price: 30, sabzi: 1 },
      { name: 'Chicken Curry', quantity: '1 bowl', price: 80, sabzi: 1 },
      { name: 'Rice', quantity: '1 bowl', price: 30, sabzi: 1 },
      { name: 'Pickles', quantity: '2 types', price: 10, sabzi: 1 },
      { name: 'Papad', quantity: '1 piece', price: 10, sabzi: 1 },
      { name: 'Salad', quantity: '1 bowl', price: 20, sabzi: 1 }
    ],
    egg: [
      { name: 'Roti', quantity: '3 pieces', price: 30, sabzi: 1 },
      { name: 'Egg Curry', quantity: '1 bowl', price: 60, sabzi: 1 },
      { name: 'Rice', quantity: '1 bowl', price: 30, sabzi: 1 },
      { name: 'Pickles', quantity: '2 types', price: 10, sabzi: 1 },
      { name: 'Papad', quantity: '1 piece', price: 10, sabzi: 1 },
      { name: 'Salad', quantity: '1 bowl', price: 20, sabzi: 1 }
    ]
  };

  // Check if this is a tiffin service
  const isTiffinService = service.category === 'Tiffin Services';

  const includedServices = {
    'House Cleaning': [
      'Dusting and wiping surfaces',
      'Vacuuming and mopping floors',
      'Bathroom cleaning',
      'Kitchen cleaning',
      'Making beds'
    ],
    'Plumbing': [
      'Pipe repair and replacement',
      'Fixture installation',
      'Drain cleaning',
      'Leak detection',
      'Water heater services'
    ],
    // Add more for other categories...
  };

  const excludedServices = {
    'House Cleaning': [
      'Window washing',
      'Carpet deep cleaning',
      'Wall washing',
      'Furniture moving',
      'Outdoor cleaning'
    ],
    'Plumbing': [
      'Gas line installation',
      'Major renovations',
      'Septic system work',
      'Water main installation',
      'Sprinkler system repair'
    ],
    // Add more for other categories...
  };

  const procedures = {
    'House Cleaning': [
      'Initial assessment of cleaning needs',
      'Preparation of cleaning supplies and equipment',
      'Systematic cleaning from top to bottom',
      'Special attention to high-traffic areas',
      'Final inspection and touch-ups'
    ],
    'Plumbing': [
      'Initial diagnostic inspection',
      'Problem identification and quote provision',
      'Required repairs or installations',
      'Testing and quality assurance',
      'Clean-up and final inspection'
    ],
    // Add more for other categories...
  };

  const descriptions = {
    'House Cleaning': 'Professional house cleaning services tailored to your needs. Our experienced cleaners use high-quality products and follow systematic procedures to ensure your home is spotless and sanitized.',
    'Plumbing': 'Expert plumbing services for all your residential and commercial needs. Our licensed plumbers provide reliable solutions for repairs, installations, and maintenance.',
    // Add more for other categories...
  };

  const isCustomizableMeal = service.title === 'Customize Meal';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      style={{ marginTop: '64px' }} // Add margin from navbar
      onClick={handleOverlayClick}
    >
      
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative my-8 max-h-[calc(100vh-128px)] overflow-y-auto">
        {/* Close button */}
        {/* <button
          onClick={onClose}
          className="absolute top-4 -right-1 text-gray-400 hover:text-gray-500 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
          aria-label="Close modal"
        >
          <FiX className="w-6 h-6" />
        </button> */}

        <div className="relative h-64 w-full mb-8">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h2>
            <p className="text-lg text-gray-600 mb-4">
              Professional {service.category} service provided by {service.provider.name}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {service.rating} ({service.reviews} reviews)
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {service.provider.location}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
            <p className="text-gray-600">
              {service.description}
            </p>
          </div>

          {/* Tiffin Service Menu */}
          {isTiffinService && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu</h3>
              
              {/* Veg Items */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-green-600 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {service.title === 'Customize Meal' ? 'Customize Your Meal' : 'Vegetarian Items'}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {tiffinMenu.veg.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        {service.title === 'Customize Meal' ? (
                          <div className="mt-1 flex items-center justify-between">
                            <input
                              type="number"
                              value={customQuantities[item.name]}
                              onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                              className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#003B95] focus:border-transparent"
                              min="0"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuantityChange(item.name, customQuantities[item.name] - 1)}
                                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleQuantityChange(item.name, customQuantities[item.name] + 1)}
                                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm ml-2">({item.quantity})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-gray-500 italic mb-4">
                {service.title === 'Customize Meal' 
                  ? '* Enter your preferred quantities for each item. Our chefs will prepare your meal according to your specifications.'
                  : '* All items are freshly prepared daily. Quantities may vary slightly.'}
              </p>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <span className="text-2xl font-bold text-[#003B95]">₹{service.price}</span>
                </div>
                {renderCartButton()}
              </div>
            </div>
          )}

          
        </div>
      </div>
    </div>
  );
};

export default ServiceModal; 