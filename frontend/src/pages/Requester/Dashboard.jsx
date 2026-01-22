import { FileText, Clock, CheckCircle, XCircle, TrendingUp, Banknote } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const stats = [
    {
      title: 'Total Requests',
      value: '11',
      icon: FileText,
      color: 'bg-blue-600',
      textColor: 'text-blue-700',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Pending Requests',
      value: '3',
      icon: Clock,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
    {
      title: 'Completed Requests',
      value: '7',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      title: 'Rejected Requests',
      value: '1',
      icon: XCircle,
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      bgLight: 'bg-rose-50',
      borderColor: 'border-rose-100',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back, {user?.name || 'Requester'}!</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your requests and activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg ${stat.borderColor} p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
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
        {/* Recent Requests */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Requests</h2>
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:underline transition-all">
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{request.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium border border-gray-200 shadow-sm">{request.category}</span>
                    <span className="font-medium"> {request.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* <span
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${
                      request.urgency === 'High'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : request.urgency === 'Medium'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {request.urgency}
                  </span>
                  <span
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${
                      request.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {request.status}
                  </span> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Trust Score Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Trust Score</h3>
              <TrendingUp size={28} strokeWidth={2.5} />
            </div>
            <div className="text-6xl font-bold mb-3">93</div>
            <p className="text-blue-100 text-base font-medium mb-6">Excellent! Keep up the good work!</p>
            <div className="bg-white bg-opacity-20 rounded-full h-3">
              <div className="bg-white rounded-full h-3 shadow-lg" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Total Funds Received */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Total Funds</h3>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Banknote className="text-blue-800" size={28} strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-4xl font-bold text-blue-800 mb-2">Rs. 16,500</div>
            <p className="text-sm text-gray-600 font-medium">From 6 successful requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
