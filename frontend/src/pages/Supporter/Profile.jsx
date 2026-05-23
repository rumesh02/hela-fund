import { useEffect, useMemo, useState } from 'react';
import { User, Mail, Edit2, Save, X, Shield } from 'lucide-react';
import api from '../../utils/api';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/me');
        const user = response?.data;

        if (!isMounted) {
          return;
        }

        setProfile(user);
        setFormData({
          name: (user?.role === 'requester' ? user?.fullName : user?.name) || '',
          email: user?.email || '',
          bio: user?.bio || ''
        });
        setError('');
      } catch (loadError) {
        if (isMounted) {
          setError(loadError?.message || 'Failed to load profile.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const profileStats = useMemo(() => {
    return {
      totalContributions: profile?.totalContributions ?? 0,
      joinedDate: profile?.createdAt || null,
      isVerified: Boolean(profile?.isVerified)
    };
  }, [profile]);

  const initials = useMemo(() => {
    if (!formData.name) {
      return 'U';
    }
    return formData.name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [formData.name]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload = profile?.role === 'requester'
        ? { fullName: formData.name, bio: formData.bio }
        : { name: formData.name, bio: formData.bio };

      const response = await api.put('/auth/profile', payload);

      const updatedUser = response?.data;
      setProfile(updatedUser);
      setFormData({
        name: (updatedUser?.role === 'requester' ? updatedUser?.fullName : updatedUser?.name) || '',
        email: updatedUser?.email || '',
        bio: updatedUser?.bio || ''
      });
      setError('');
      setIsEditing(false);
    } catch (saveError) {
      setError(saveError?.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.role === 'requester' ? profile?.fullName || '' : profile?.name || '',
      email: profile?.email || '',
      bio: profile?.bio || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6">
        <div className="bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your profile information and view your impact</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card & Stats */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                {initials}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{formData.name || 'Supporter'}</h2>
              <p className="text-gray-600 mt-1">{formData.email}</p>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Shield className="text-green-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">Verification</span>
                </div>
                <div className="text-sm font-semibold text-gray-800">
                  {profileStats.isVerified ? 'Verified supporter' : 'Not verified yet'}
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 w-full flex items-center justify-center space-x-2 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  <Edit2 size={16} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Contributions</span>
                <span className="font-bold text-gray-800">{profileStats.totalContributions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Account Status</span>
                <span className={profileStats.isVerified ? 'font-bold text-green-600' : 'font-bold text-gray-600'}>
                  {profileStats.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium text-gray-800">
                  {profileStats.joinedDate
                    ? new Date(profileStats.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-60"
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
