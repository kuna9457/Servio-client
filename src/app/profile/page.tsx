'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { authAPI } from '@/services/api';
import { User } from '@/services/api';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiLock, FiMail, FiPhone, FiMapPin, FiHome, FiMap, FiUser } from 'react-icons/fi';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [originalData, setOriginalData] = useState<Partial<User>>({});
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Load saved profile data from localStorage
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfileData(parsedProfile);
      setOriginalData(parsedProfile);
    } else {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || ''
      };
      setProfileData(userData);
      setOriginalData(userData);
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev: Partial<User>) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setIsLoading(true);
    try {
      await authAPI.updateProfile(profileData);
      localStorage.setItem('profileData', JSON.stringify(profileData));
      setOriginalData(profileData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const handleInitiatePasswordChange = async () => {
    if (!user?.email) return;

    setIsVerifying(true);
    try {
      await authAPI.initiatePasswordReset({ email: user.email });
      toast.success('Verification code sent to your email!');
      setShowOtpInput(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send verification code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!user?.email) return;

    setIsVerifying(true);
    try {
      await authAPI.verifyResetCode({ email: user.email, code: verificationCode });
      toast.success('Code verified successfully!');
      setShowNewPasswordFields(true);
      setShowOtpInput(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !verificationCode) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authAPI.resetPassword({
        email: user.email,
        code: verificationCode,
        newPassword: passwordData.newPassword
      });
      
      // Show success message
      toast.success('Password changed successfully!');
      
      // Reset all states
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setVerificationCode('');
      setShowNewPasswordFields(false);
      setShowOtpInput(false);
      
      // Stay on the same page
      setIsChangingPassword(false);
    } catch (error: any) {
      // Show error message
      toast.error(error.response?.data?.message || 'Failed to change password. Please try again.');
      setIsChangingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-primary text-white p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold shadow-lg">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-white/80">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Profile Form */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <FiEdit2 className="text-lg" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiX className="text-lg" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    <FiSave className="text-lg" />
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiUser className="mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
                      required
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiMail className="mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
                      required
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiPhone className="mr-2" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiMapPin className="mr-2" />
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FiHome className="mr-2" />
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FiMap className="mr-2" />
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={profileData.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiMapPin className="mr-2" />
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={profileData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Password Change Section */}
            <div className="mt-8 border-t pt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FiLock className="mr-2" />
                Change Password
              </h3>
              
              {!showOtpInput && !showNewPasswordFields && (
                <button
                  onClick={handleInitiatePasswordChange}
                  disabled={isVerifying}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  <FiLock className="text-lg" />
                  <span>{isVerifying ? 'Sending Code...' : 'Change Password'}</span>
                </button>
              )}

              {showOtpInput && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter Verification Code
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter the code sent to your email"
                        required
                      />
                      <button
                        onClick={handleVerifyCode}
                        disabled={isVerifying || !verificationCode}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                      >
                        {isVerifying ? 'Verifying...' : 'Verify Code'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showNewPasswordFields && (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isChangingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 