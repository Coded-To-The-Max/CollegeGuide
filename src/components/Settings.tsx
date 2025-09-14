import React, { useState } from 'react';
import { User as UserIcon, LogOut, Globe, Save, Edit } from 'lucide-react';
import { User, Country } from '../types';

interface SettingsProps {
  user: User;
  onUpdateProfile: (updates: Partial<User>) => Promise<void>;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateProfile, onLogout }) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    country: user.country,
    residence: user.residence,
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const countries: Country[] = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    onUpdateProfile({
      displayName: formData.displayName,
      country: formData.country,
      residence: formData.residence,
    })
      .then(() => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <UserIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Edit className="inline w-4 h-4 mr-1" />
                  Preferred Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, displayName: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How should we address you?"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This name will be used by the AI assistant and displayed in your profile
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline w-4 h-4 mr-1" />
                  Country where planning to attend university
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, country: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline w-4 h-4 mr-1" />
                  Country of current residence
                </label>
                <select
                  value={formData.residence}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, residence: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>

              {isSaved && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-green-700 text-sm">✅ Settings saved successfully!</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account</h3>
            <div className="space-y-3">
              {/* Email instead of Username */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Email</p>
                  <p className="text-sm text-gray-600">@{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Study Destination</p>
                  <p className="text-sm text-gray-600">
                    {countries.find((c) => c.code === user.country)?.flag}{' '}
                    {countries.find((c) => c.code === user.country)?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Current Location</p>
                  <p className="text-sm text-gray-600">
                    {countries.find((c) => c.code === user.residence)?.flag}{' '}
                    {countries.find((c) => c.code === user.residence)?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
            <button
              onClick={onLogout}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">💡 Tip</h4>
            <p className="text-sm text-blue-700">
              Keep your display name and location settings updated to receive personalized assistance
              and relevant college suggestions for your region.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
