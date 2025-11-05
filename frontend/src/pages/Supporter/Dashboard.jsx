import { Heart, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      id: 1,
      title: 'Total Contributions',
      value: '24',
      icon: Heart,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+3 this month'
    },
    {
      id: 2,
      title: 'Completed Helps',
      value: '18',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '75% success rate'
    },
    {
      id: 3,
      title: 'Ongoing Support',
      value: '6',
      icon: Clock,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      trend: 'Active now'
    },
    {
      id: 4,
      title: 'Trust Score',
      value: '4.8',
      icon: TrendingUp,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: 'Out of 5.0'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Helped with',
      request: 'Laptop Repair Assistance',
      requester: 'Kasun Perera',
      time: '2 hours ago',
      status: 'ongoing'
    },
    {
      id: 2,
      action: 'Completed',
      request: 'Books for Engineering Course',
      requester: 'Nimali Silva',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      action: 'Offered help for',
      request: 'Transport to University',
      requester: 'Amila Fernando',
      time: '2 days ago',
      status: 'pending'
    },
    {
      id: 4,
      action: 'Completed',
      request: 'Internet Data Package',
      requester: 'Sanduni Rathnayake',
      time: '3 days ago',
      status: 'completed'
    }
  ];

  const badges = [
    { name: 'First Help', emoji: '🎯', earned: true },
    { name: 'Quick Responder', emoji: '⚡', earned: true },
    { name: 'Trusted Helper', emoji: '🌟', earned: true },
    { name: 'Community Champion', emoji: '🏆', earned: false }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      ongoing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Amantha! 👋</h1>
        <p className="text-gray-600 mt-2">Here's your impact summary and recent activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">{activity.action}</span>{' '}
                    <span className="text-blue-600 font-medium">"{activity.request}"</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requester: {activity.requester} • {activity.time}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${getStatusBadge(
                    activity.status
                  )}`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium">
            View All Activity
          </button>
        </div>

        {/* Badges & Achievements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Badges</h2>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg text-center ${
                  badge.earned
                    ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300'
                    : 'bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{badge.emoji}</div>
                <p className="text-xs font-medium text-gray-700">{badge.name}</p>
              </div>
            ))}
          </div>

          {/* Quick Action */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              Browse New Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
