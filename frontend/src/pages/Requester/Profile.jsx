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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">View and manage your profile information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-blue-100">
                  {studentInfo.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{studentInfo.name}</h2>
                  <p className="text-blue-600 font-semibold">{studentInfo.studentId}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-semibold">
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
                  <p className="text-sm font-bold text-gray-900">{studentInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Phone className="text-blue-600" size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Phone</p>
                  <p className="text-sm font-bold text-gray-900">{studentInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <MapPin className="text-blue-600" size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Location</p>
                  <p className="text-sm font-bold text-gray-900">{studentInfo.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Calendar className="text-blue-600" size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Joined</p>
                  <p className="text-sm font-bold text-gray-900">{studentInfo.joinedDate}</p>
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
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 text-center hover:shadow-xl transition-all">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-2 font-semibold uppercase">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Badges Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Award className="text-blue-600" size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Badges & Achievements</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-2xl text-center transition-all shadow-lg hover:shadow-xl ${
                    badge.earned
                      ? badge.color + ' border-2'
                      : 'bg-gray-100 text-gray-400 opacity-60'
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
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Trust Score</h3>
              <TrendingUp size={28} strokeWidth={2.5} />
            </div>
            <div className="text-center mb-8">
              <div className="text-7xl font-bold mb-3">{trustScore}</div>
              <p className="text-blue-100 text-lg font-semibold">Out of 100</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full h-4 mb-4">
              <div
                className="bg-white rounded-full h-4 transition-all duration-500 shadow-lg"
                style={{ width: `${trustScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-100 text-center font-medium">
              Excellent! Your trust score is very high.
            </p>
          </div>

          {/* Activity Summary */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
                <span className="text-sm text-gray-700 font-semibold">Requests This Month</span>
                <span className="text-2xl font-bold text-blue-600">8</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
                <span className="text-sm text-gray-700 font-semibold">Active Conversations</span>
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
                <span className="text-sm text-gray-700 font-semibold">Avg. Response Time</span>
                <span className="text-2xl font-bold text-blue-600">2.5h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-semibold">Member Since</span>
                <span className="text-2xl font-bold text-blue-600">{studentInfo.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl text-left font-bold">
                📝 Create New Request
              </button>
              <button className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 text-gray-800 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all border border-gray-200 hover:border-blue-200 text-left font-bold">
                📜 View My Requests
              </button>
              <button className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 text-gray-800 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all border border-gray-200 hover:border-blue-200 text-left font-bold">
                💬 Check Messages
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
