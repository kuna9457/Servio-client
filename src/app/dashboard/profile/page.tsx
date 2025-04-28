'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import axios from 'axios';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileSettings() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
  });
  const [originalData, setOriginalData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordStep, setPasswordStep] = useState<'initial' | 'verify' | 'change'>('initial');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      };
      setProfileData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('https://servio-server.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.status === 200) {
        setMessage({
          type: 'success',
          text: 'Profile updated successfully',
        });
        setOriginalData(profileData);
        setIsEditing(false);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setMessage(null);
  };

  const handleInitiatePasswordChange = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Check if user email exists
      if (!user?.email) {
        throw new Error('User email not found. Please try logging in again.');
      }

      // Log the request details
      console.log('Initiating password change for email:', user.email);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch('https://servio-server.onrender.com/api/users/initiate-password-change', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.status === 200) {
        setMessage({
          type: 'success',
          text: 'Verification code sent to your email',
        });
        setPasswordStep('verify');
      }
    } catch (error) {
      console.error('Password change initiation error:', error);
      
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Failed to send verification code. Please try again.';
        
        setMessage({
          type: 'error',
          text: errorMessage,
        });
      } else {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Failed to send verification code. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('https://servio-server.onrender.com/api/users/verify-code', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (response.status === 200) {
        setMessage({
          type: 'success',
          text: 'Code verified successfully',
        });
        setPasswordStep('change');
      }
    } catch (error) {
      console.error('Code verification error:', error);
      setMessage({
        type: 'error',
        text: 'Invalid verification code. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const response = await fetch('https://servio-server.onrender.com/api/users/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          verificationCode,
        }),
      });

      if (response.status === 200) {
        setMessage({
          type: 'success',
          text: 'Password changed successfully',
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordStep('initial');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to change password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h1>

        {message && (
          <div
            className={`p-4 rounded-md mb-6 ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Edit Profile
              </button>
            ) : null}
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50"
                  required
                  disabled
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-gray-900">{profileData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{profileData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-gray-900">{profileData.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Password Change Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
          {message && (
            <div className={`mb-4 p-4 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          
          {passwordStep === 'initial' && (
            <button
              onClick={handleInitiatePasswordChange}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Sending...' : 'Change Password'}
            </button>
          )}

          {passwordStep === 'verify' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter 6-digit code"
                />
              </div>
              <button
                onClick={handleVerifyCode}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          )}

          {passwordStep === 'change' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 