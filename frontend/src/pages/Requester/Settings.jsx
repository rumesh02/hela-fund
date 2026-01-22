import { Bell, Lock, Globe, Palette, Shield, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newMessages: true,
    requestUpdates: true,
    weeklyDigest: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
  });

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handlePrivacyChange = (key) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and settings.</p>
        </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Bell className="text-blue-600" size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b-2 border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Email Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={() => handleNotificationChange('emailNotifications')}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4 border-b-2 border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Push Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">Receive push notifications on your device</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.pushNotifications}
                onChange={() => handleNotificationChange('pushNotifications')}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4 border-b-2 border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">New Messages</h3>
              <p className="text-sm text-gray-600 mt-1">Get notified about new messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.newMessages}
                onChange={() => handleNotificationChange('newMessages')}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4 border-b-2 border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Request Updates</h3>
              <p className="text-sm text-gray-600 mt-1">Get updates on your requests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.requestUpdates}
                onChange={() => handleNotificationChange('requestUpdates')}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Weekly Digest</h3>
              <p className="text-sm text-gray-600 mt-1">Receive a weekly summary email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weeklyDigest}
                onChange={() => handleNotificationChange('weeklyDigest')}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Shield className="text-blue-600" size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b-2 border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Profile Visibility</h3>
              <p className="text-sm text-gray-600 mt-1">Make your profile visible to other users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.profileVisible}
                onChange={() => handlePrivacyChange('profileVisible')}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4 border-b-2 border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Show Email</h3>
              <p className="text-sm text-gray-600 mt-1">Display your email on your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showEmail}
                onChange={() => handlePrivacyChange('showEmail')}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Show Phone Number</h3>
              <p className="text-sm text-gray-600 mt-1">Display your phone number on your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showPhone}
                onChange={() => handlePrivacyChange('showPhone')}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Other Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Lock className="text-blue-600" size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Security</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md">
              <h3 className="font-bold text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-600 mt-1">Update your password</p>
            </button>
            <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md">
              <h3 className="font-bold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 mt-1">Add an extra layer of security</p>
            </button>
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Globe className="text-blue-600" size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Language & Region</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Language</label>
              <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium">
                <option>English</option>
                <option>Sinhala</option>
                <option>Tamil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Timezone</label>
              <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium">
                <option>Asia/Colombo (UTC+5:30)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Palette className="text-blue-600" size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-4">
            <button className="p-6 border-2 border-blue-600 rounded-2xl text-center bg-gradient-to-br from-blue-50 to-white shadow-lg hover:shadow-xl transition-all">
              <div className="text-3xl mb-3">☀️</div>
              <p className="font-bold text-gray-900">Light</p>
            </button>
            <button className="p-6 border-2 border-gray-300 rounded-2xl text-center hover:border-blue-400 transition-all bg-white hover:shadow-lg">
              <div className="text-3xl mb-3">🌙</div>
              <p className="font-bold text-gray-900">Dark</p>
            </button>
            <button className="p-6 border-2 border-gray-300 rounded-2xl text-center hover:border-blue-400 transition-all bg-white hover:shadow-lg">
              <div className="text-3xl mb-3">🖥️</div>
              <p className="font-bold text-gray-900">System</p>
            </button>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <HelpCircle className="text-blue-600" size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
        </div>
        <div className="space-y-3">
          <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all border border-gray-200 hover:border-blue-300 font-bold shadow-sm hover:shadow-md">
            Help Center
          </button>
          <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all border border-gray-200 hover:border-blue-300 font-bold shadow-sm hover:shadow-md">
            Contact Support
          </button>
          <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all border border-gray-200 hover:border-blue-300 font-bold shadow-sm hover:shadow-md">
            Terms of Service
          </button>
          <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all border border-gray-200 hover:border-blue-300 font-bold shadow-sm hover:shadow-md">
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl text-lg">
          Save Changes
        </button>
      </div>
      </div>
    </div>
  );
};

export default Settings;
