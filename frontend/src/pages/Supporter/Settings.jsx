import { useState } from 'react';
import { Bell, Moon, Globe, Shield, Lock, Eye, Mail, Smartphone } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    newRequestAlerts: true,
    messageNotifications: true,
    contributionUpdates: true,
    weeklyDigest: false,
    
    // Privacy Settings
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    
    // Appearance
    theme: 'light',
    language: 'en',
    
    // Security
    twoFactorAuth: false
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="text-teal-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Notification Settings</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Choose how you want to be notified about updates and activities
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.emailNotifications ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.emailNotifications ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-800">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                </div>
                <button
                  onClick={() => handleToggle('pushNotifications')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.pushNotifications ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.pushNotifications ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-800">New Request Alerts</p>
                  <p className="text-sm text-gray-500">Get notified about new help requests</p>
                </div>
                <button
                  onClick={() => handleToggle('newRequestAlerts')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.newRequestAlerts ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.newRequestAlerts ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-800">Message Notifications</p>
                  <p className="text-sm text-gray-500">Alerts for new messages</p>
                </div>
                <button
                  onClick={() => handleToggle('messageNotifications')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.messageNotifications ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.messageNotifications ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-800">Contribution Updates</p>
                  <p className="text-sm text-gray-500">Updates on your contributions</p>
                </div>
                <button
                  onClick={() => handleToggle('contributionUpdates')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.contributionUpdates ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.contributionUpdates ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Weekly Digest</p>
                  <p className="text-sm text-gray-500">Summary of weekly activities</p>
                </div>
                <button
                  onClick={() => handleToggle('weeklyDigest')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.weeklyDigest ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.weeklyDigest ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="text-teal-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Privacy Settings</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Control who can see your information and contact you
            </p>

            <div className="space-y-4">
              <div className="py-3 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-800">Profile Visibility</p>
                    <p className="text-sm text-gray-500">Who can see your profile</p>
                  </div>
                </div>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => handleSelect('profileVisibility', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="public">Public - Everyone</option>
                  <option value="verified">Verified Users Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-800">Show Email Address</p>
                  <p className="text-sm text-gray-500">Display email on profile</p>
                </div>
                <button
                  onClick={() => handleToggle('showEmail')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.showEmail ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.showEmail ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-800">Show Phone Number</p>
                  <p className="text-sm text-gray-500">Display phone on profile</p>
                </div>
                <button
                  onClick={() => handleToggle('showPhone')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.showPhone ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.showPhone ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Allow Messages</p>
                  <p className="text-sm text-gray-500">Let requesters message you</p>
                </div>
                <button
                  onClick={() => handleToggle('allowMessages')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.allowMessages ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.allowMessages ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Moon className="text-teal-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Appearance</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Customize how the platform looks to you
            </p>

            <div className="space-y-4">
              <div className="py-3 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-800">Theme</p>
                    <p className="text-sm text-gray-500">Choose your preferred theme</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleSelect('theme', 'light')}
                    className={`px-4 py-3 border-2 rounded-lg transition ${
                      settings.theme === 'light'
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">☀️</div>
                      <p className="text-sm font-medium">Light</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSelect('theme', 'dark')}
                    className={`px-4 py-3 border-2 rounded-lg transition ${
                      settings.theme === 'dark'
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🌙</div>
                      <p className="text-sm font-medium">Dark</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSelect('theme', 'auto')}
                    className={`px-4 py-3 border-2 rounded-lg transition ${
                      settings.theme === 'auto'
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🔄</div>
                      <p className="text-sm font-medium">Auto</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="py-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-800">Language</p>
                    <p className="text-sm text-gray-500">Select your preferred language</p>
                  </div>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => handleSelect('language', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="si">Sinhala (සිංහල)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Actions Sidebar */}
        <div className="space-y-6">
          {/* Security Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="text-teal-600" size={24} />
              <h2 className="text-lg font-bold text-gray-800">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Two-Factor Auth</p>
                  <p className="text-xs text-gray-500">Extra security layer</p>
                </div>
                <button
                  onClick={() => handleToggle('twoFactorAuth')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.twoFactorAuth ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.twoFactorAuth ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                Change Password
              </button>

              <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                View Login History
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
            <h3 className="font-bold text-teal-800 mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-teal-700">
              <li>• Keep notifications on to stay updated</li>
              <li>• Enable 2FA for better security</li>
              <li>• Make your profile public to gain trust</li>
            </ul>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="font-bold text-red-800 mb-3">⚠️ Danger Zone</h3>
            <div className="space-y-2">
              <button className="w-full py-2 px-4 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium">
                Deactivate Account
              </button>
              <button className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium shadow-lg">
          Save All Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
