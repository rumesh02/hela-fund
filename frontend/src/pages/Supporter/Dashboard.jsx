import { Heart, TrendingUp, CheckCircle, Clock, Banknote } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Contributions',
      value: '24',
      icon: Heart,
      color: 'bg-teal-600',
      textColor: 'text-teal-700',
      bgLight: 'bg-teal-50',
      borderColor: 'border-teal-100',
    },
    {
      title: 'Ongoing Support',
      value: '6',
      icon: Clock,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
    {
      title: 'Completed Helps',
      value: '18',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      title: 'Total Impact',
      value: '42',
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgLight: 'bg-purple-50',
      borderColor: 'border-purple-100',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Laptop Repair Assistance',
      requester: 'Kasun Perera',
      status: 'Ongoing',
      date: '2 hours ago',
      urgency: 'High',
    },
    {
      id: 2,
      title: 'Books for Engineering Course',
      requester: 'Nimali Silva',
      status: 'Completed',
      date: '1 day ago',
      urgency: 'Medium',
    },
    {
      id: 3,
      title: 'Transport to University',
      requester: 'Amila Fernando',
      status: 'Ongoing',
      date: '2 days ago',
      urgency: 'Low',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back, Supporter!</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your contributions and impact.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-lg border ${stat.borderColor} p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">{stat.title}</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">{stat.value}</p>
              </div>
              <div className={`${stat.bgLight} p-4 rounded-xl shadow-sm`}>
                <stat.icon className={stat.textColor} size={28} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-teal-600 text-sm font-semibold hover:text-teal-700 hover:underline transition-all">
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-teal-50 rounded-xl hover:from-teal-50 hover:to-teal-100 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-teal-200 hover:shadow-md"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{activity.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium border border-gray-200 shadow-sm">Requester: {activity.requester}</span>
                    <span className="font-medium">📅 {activity.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${
                      activity.urgency === 'High'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : activity.urgency === 'Medium'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {activity.urgency}
                  </span>
                  <span
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${
                      activity.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Trust Score Card */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Trust Score</h3>
              <TrendingUp size={28} strokeWidth={2.5} />
            </div>
            <div className="text-6xl font-bold mb-3">4.8</div>
            <p className="text-teal-100 text-base font-medium mb-6">Excellent! Keep up the good work!</p>
            <div className="bg-white bg-opacity-20 rounded-full h-3">
              <div className="bg-white rounded-full h-3 shadow-lg" style={{ width: '96%' }}></div>
            </div>
          </div>

          {/* Total Impact */}
          <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Total Impact</h3>
              <div className="bg-teal-50 p-3 rounded-xl">
                <Banknote className="text-teal-600" size={28} strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-4xl font-bold text-teal-600 mb-2">Rs. 42,500</div>
            <p className="text-sm text-gray-600 font-medium">From 24 contributions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
