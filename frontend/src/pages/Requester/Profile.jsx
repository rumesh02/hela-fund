import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Calendar, Award, TrendingUp, Edit, X, Save, User, BookOpen, Hash, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (!authUser?.id) return;

    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get(`/users/${authUser.id}`),
          api.get(`/users/${authUser.id}/stats`),
        ]);
        setProfile(profileRes.data);
        setStats(statsRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser?.id]);

  const openEdit = () => {
    setSaveError(null);
    setEditForm({
      fullName: profile.fullName || '',
      avatar: profile.avatar || '',
      mobile: profile.mobile || '',
      bio: profile.bio || '',
    });
    setEditOpen(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveEdit = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await api.put(`/users/${authUser.id}`, {
        fullName: editForm.fullName,
        avatar: editForm.avatar,
        mobile: editForm.mobile,
        bio: editForm.bio,
      });
      setProfile(res.data);
      setEditOpen(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatCurrency = (amount) => `Rs. ${Number(amount).toLocaleString()}`;

  const getInitials = (name) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '?';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-red-500 text-lg">Failed to load profile: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">View and manage your profile information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="w-20 h-20 rounded-2xl object-cover shadow-xl ring-4 ring-blue-100"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-blue-100">
                    {getInitials(profile.fullName)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
                  <p className="text-blue-600 font-semibold">{profile.studentId}</p>
                  {profile.bio && (
                    <p className="text-gray-500 text-sm mt-1 max-w-xs">{profile.bio}</p>
                  )}
                </div>
              </div>
              <button
                onClick={openEdit}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                <Edit size={18} strokeWidth={2.5} />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Mail className="text-blue-600" size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Email</p>
                  <p className="text-sm font-bold text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Phone className="text-blue-600" size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Mobile</p>
                  <p className="text-sm font-bold text-gray-900">{profile.mobile || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <CreditCard className="text-blue-600" size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">NIC</p>
                  <p className="text-sm font-bold text-gray-900">{profile.nic}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Calendar className="text-blue-600" size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Joined</p>
                  <p className="text-sm font-bold text-gray-900">{formatDate(profile.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Info Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Award className="text-blue-600" size={20} />
              </div>
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen size={15} className="text-blue-500" />
                  <p className="text-sm text-gray-600">University</p>
                </div>
                <p className="text-lg font-semibold text-gray-900">{profile.university}</p>
              </div>

              <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen size={15} className="text-blue-500" />
                  <p className="text-sm text-gray-600">Faculty</p>
                </div>
                <p className="text-lg font-semibold text-gray-900">{profile.faculty}</p>
              </div>

              <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Hash size={15} className="text-blue-500" />
                  <p className="text-sm text-gray-600">Student ID</p>
                </div>
                <p className="text-lg font-semibold text-gray-900">{profile.studentId}</p>
              </div>

              {profile.studentIdImage && (
                <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={15} className="text-blue-500" />
                    <p className="text-sm text-gray-600">Student ID Image</p>
                  </div>
                  <img
                    src={profile.studentIdImage}
                    alt="Student ID"
                    className="h-16 rounded-lg object-cover border border-blue-100"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Requests', value: stats.totalRequests, icon: '📝' },
                { label: 'Completed', value: stats.completedRequests, icon: '✅' },
                { label: 'Success Rate', value: `${stats.successRate}%`, icon: '📈' },
                { label: 'Funds Received', value: formatCurrency(stats.fundsReceived), icon: '💰' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 text-center hover:shadow-xl transition-all"
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                  <p className="text-xs text-gray-600 mt-2 font-semibold uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Member Summary */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Account Overview</h3>
              <TrendingUp size={28} strokeWidth={2.5} />
            </div>
            <div className="space-y-4">
              <div className="bg-white bg-opacity-10 rounded-xl p-4">
                <p className="text-blue-200 text-xs font-semibold uppercase mb-1">Member Since</p>
                <p className="text-white font-bold text-lg">{formatDate(profile.createdAt)}</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4">
                <p className="text-blue-200 text-xs font-semibold uppercase mb-1">Verification Status</p>
                <p className={`font-bold text-lg ${profile.isVerified ? 'text-green-300' : 'text-yellow-300'}`}>
                  {profile.isVerified ? 'Verified' : 'Pending Verification'}
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4">
                <p className="text-blue-200 text-xs font-semibold uppercase mb-1">Account Role</p>
                <p className="text-white font-bold text-lg capitalize">{profile.role}</p>
              </div>
            </div>
          </div>

          {/* Bio Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About</h3>
            {profile.bio ? (
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-gray-400 italic">No bio added yet. Click Edit Profile to add one.</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setEditOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {editForm.avatar ? (
                    <img
                      src={editForm.avatar}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-blue-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      {getInitials(editForm.fullName)}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-4 py-2 border-2 border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-sm"
                  >
                    Upload Image
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, mobile: e.target.value }))}
                  placeholder="07XXXXXXXX"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  maxLength={500}
                  placeholder="Tell others a bit about yourself..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 text-right mt-1">{editForm.bio.length}/500</p>
              </div>

              {saveError && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{saveError}</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 px-5 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
