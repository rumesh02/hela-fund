import { FileText, Clock, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Requests',
      value: '24',
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'Pending Requests',
      value: '8',
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgLight: 'bg-yellow-50',
    },
    {
      title: 'Completed Requests',
      value: '14',
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
    },
    {
      title: 'Rejected Requests',
      value: '2',
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50',
    },
  ];

  const recentRequests = [
    {
      id: 1,
      title: 'Lost Student ID Card',
      category: 'Lost Item',
      status: 'Pending',
      date: '2025-11-04',
      urgency: 'High',
    },
    {
      id: 2,
      title: 'Textbook for Semester',
      category: 'Micro-Funding',
      status: 'Completed',
      date: '2025-11-03',
      urgency: 'Medium',
    },
    {
      id: 3,
      title: 'Study Group Formation',
      category: 'Community Help',
      status: 'Pending',
      date: '2025-11-02',
      urgency: 'Low',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your requests.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgLight} p-3 rounded-lg`}>
                <stat.icon className={stat.textColor} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{request.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-white rounded text-xs">{request.category}</span>
                    <span>{request.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.urgency === 'High'
                        ? 'bg-red-100 text-red-700'
                        : request.urgency === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {request.urgency}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Trust Score Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Trust Score</h3>
              <TrendingUp size={24} />
            </div>
            <div className="text-4xl font-bold mb-2">85</div>
            <p className="text-indigo-100 text-sm">Keep up the good work!</p>
            <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Total Funds Received */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Funds Received</h3>
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900">Rs. 15,000</div>
            <p className="text-sm text-gray-600 mt-2">From 6 successful requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
