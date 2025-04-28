'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProfessionalFormData {
  name: string;
  email: string;
  phone: string;
  serviceCategories: string[];
  description: string;
  location: string;
  availability: string;
  perPersonRate: string;
}

const serviceCategories = [
  'Tiffin Services',
  'Maid Services',
  'Cooking Services',
];

export default function ProfessionalRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfessionalFormData>({
    name: '',
    email: '',
    phone: '',
    serviceCategories: [],
    description: '',
    location: '',
    availability: '',
    perPersonRate: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => {
      const categories = prev.serviceCategories.includes(category)
        ? prev.serviceCategories.filter(c => c !== category)
        : [...prev.serviceCategories, category];
      
      return {
        ...prev,
        serviceCategories: categories,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate service categories
      if (formData.serviceCategories.length === 0) {
        throw new Error('Please select at least one service category');
      }

      // Generate HTML email body in the frontend
      const htmlBody = `
        <table style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #f0f0f0;">
          <tr>
            <td style="background: #003B95; color: #fff; padding: 24px 0; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">New Professional Registration</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px 24px 24px;">
              <p style="font-size: 16px; margin-bottom: 16px;">A new professional has registered on Servio:</p>
              <table style="width: 100%; background: #f8f9fa; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
                <tr><td style="padding: 8px 0;"><b>Name:</b></td><td>${formData.name}</td></tr>
                <tr><td style="padding: 8px 0;"><b>Email:</b></td><td>${formData.email}</td></tr>
                <tr><td style="padding: 8px 0;"><b>Phone:</b></td><td>${formData.phone}</td></tr>
                <tr><td style="padding: 8px 0;"><b>Services:</b></td><td>${formData.serviceCategories.join(', ')}</td></tr>
                <tr><td style="padding: 8px 0;"><b>Location:</b></td><td>${formData.location}</td></tr>
                <tr><td style="padding: 8px 0;"><b>Per Person Rate:</b></td><td>₹${formData.perPersonRate}</td></tr>
                <tr><td style="padding: 8px 0;"><b>Availability:</b></td><td>${formData.availability}</td></tr>
                <tr><td style="padding: 8px 0;"><b>Description:</b></td><td>${formData.description}</td></tr>
              </table>
              <div style="margin-top: 24px;">
                <span style="display: inline-block; background: #003B95; color: #fff; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Review Application in Admin Dashboard</span>
              </div>
            </td>
          </tr>
        </table>
      `;

      // Register the professional and send HTML body
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, htmlBody }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Registration successful! We will contact you soon.',
        });
        
        // Clear form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceCategories: [],
          description: '',
          location: '',
          availability: '',
          perPersonRate: '',
        });
      } else {
        throw new Error(data.message || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to register. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Register as a Professional</h1>
        
        {message && (
          <div className={`p-4 rounded-md mb-6 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="City, State"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Categories *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {serviceCategories.map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={category}
                        checked={formData.serviceCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor={category} className="ml-2 text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

             

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability *
                  </label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Monday to Friday, 9 AM - 6 PM"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Per Person Rate (₹) *
                  </label>
                  <input
                    type="number"
                    name="perPersonRate"
                    value={formData.perPersonRate}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description 
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your services and experience"
                />
              </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-md text-white font-medium ${
                  loading ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
} 