import { Mail, Phone, MapPin, Calendar, Award, TrendingUp, Edit } from 'lucide-react';

const Profile = () => {
  const studentInfo = {
    name: 'Rumesh Elpitiya',
    email: 'elpitiyaebdrt.22@uom.lk',
    phone: '+94 77 325 0137',
    faculty: 'Faculty of IT',
    year: '3rd Year',
    studentId: '225026V',
    joinedDate: 'November 2025',
    location: 'Moratuwa, Sri Lanka',
  };

  const trustScore = 85;

  const badges = [
    { name: 'Verified Student', icon: '✓', color: 'bg-blue-100 text-blue-700', earned: true },
    { name: 'Trusted Requester', icon: '⭐', color: 'bg-yellow-100 text-yellow-700', earned: true },
    { name: 'Community Helper', icon: '🤝', color: 'bg-green-100 text-green-700', earned: true },
    { name: 'Quick Responder', icon: '⚡', color: 'bg-purple-100 text-purple-700', earned: false },
    { name: 'Top Contributor', icon: '🏆', color: 'bg-orange-100 text-orange-700', earned: false },
  ];

  const stats = [
    { label: 'Total Requests', value: '24', icon: '📝' },
    { label: 'Completed', value: '14', icon: '✅' },
    { label: 'Success Rate', value: '85%', icon: '📈' },
    { label: 'Funds Received', value: 'Rs. 15,000', icon: '💰' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">View and manage your profile information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {studentInfo.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{studentInfo.name}</h2>
                  <p className="text-gray-600">{studentInfo.studentId}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Edit size={18} />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{studentInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{studentInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">{studentInfo.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm font-medium text-gray-900">{studentInfo.joinedDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Faculty</p>
                <p className="text-lg font-semibold text-gray-900">{studentInfo.faculty}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Year of Study</p>
                <p className="text-lg font-semibold text-gray-900">{studentInfo.year}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Badges Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-indigo-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Badges & Achievements</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg text-center transition-all ${
                    badge.earned
                      ? badge.color
                      : 'bg-gray-100 text-gray-400 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="text-sm font-medium">{badge.name}</p>
                  {!badge.earned && (
                    <p className="text-xs mt-1">Not earned yet</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Trust Score & Quick Actions */}
        <div className="space-y-6">
          {/* Trust Score Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Trust Score</h3>
              <TrendingUp size={24} />
            </div>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold mb-2">{trustScore}</div>
              <p className="text-indigo-100">Out of 100</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full h-3 mb-4">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${trustScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-indigo-100 text-center">
              Excellent! Your trust score is very high.
            </p>
          </div>

          {/* Activity Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Requests This Month</span>
                <span className="text-lg font-bold text-gray-900">8</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Active Conversations</span>
                <span className="text-lg font-bold text-gray-900">4</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Avg. Response Time</span>
                <span className="text-lg font-bold text-gray-900">2.5h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-lg font-bold text-gray-900">{studentInfo.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-left font-medium">
                Create New Request
              </button>
              <button className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left font-medium">
                View My Requests
              </button>
              <button className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left font-medium">
                Check Messages
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
