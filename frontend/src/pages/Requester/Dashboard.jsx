import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, TrendingUp, Banknote, Activity, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const getStatusStyle = (status) => {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'active':    return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Inactive':  return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'expired':   return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'draft':     return 'bg-slate-100 text-slate-600 border-slate-200';
    default:          return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const getUrgencyStyle = (urgency) => {
  switch (urgency) {
    case 'High':   return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Low':    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    default:       return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests/my-requests');
        if (response.success) {
          setRequests(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const totalRequests       = requests.length;
  const pendingVerification = requests.filter(r => !r.isVerified && r.status === 'active').length;
  const completedRequests   = requests.filter(r => r.status === 'completed').length;
  const activeRequests      = requests.filter(r => r.isVerified && r.status === 'active').length;
  const totalFunds          = requests.reduce((sum, r) => sum + (r.currentAmount || 0), 0);
  const totalSupporters     = requests.reduce((sum, r) => sum + (r.supporters?.length || 0), 0);
  const totalViews          = requests.reduce((sum, r) => sum + (r.views || 0), 0);
  const successRate         = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;

  const stats = [
    {
      title: 'Total Requests',
      value: totalRequests,
      icon: FileText,
      textColor: 'text-blue-700',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'Awaiting Verification',
      value: pendingVerification,
      icon: Clock,
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50',
    },
    {
      title: 'Completed',
      value: completedRequests,
      icon: CheckCircle,
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50',
    },
    {
      title: 'Active Requests',
      value: activeRequests,
      icon: Activity,
      textColor: 'text-violet-700',
      bgLight: 'bg-violet-50',
    },
  ];

  const recentRequests = requests.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold tracking-wider">{stat.title}</p>
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
            <button
              onClick={() => navigate('/requester/my-requests')}
              className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:underline transition-all"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentRequests.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <FileText size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No requests yet</p>
                <p className="text-sm mt-1">Create your first request to get started</p>
              </div>
            ) : (
              recentRequests.map((request) => (
                <div
                  key={request._id}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{request.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium border border-gray-200 shadow-sm whitespace-nowrap">
                        {request.category}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getUrgencyStyle(request.urgency)}`}>
                      {request.urgency}
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusStyle(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    {!request.isVerified && request.status === 'active' && (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-bold border bg-amber-50 text-amber-600 border-amber-200">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Success Rate Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Success Rate</h3>
              <TrendingUp size={28} strokeWidth={2.5} />
            </div>
            <div className="text-6xl font-bold mb-3">{successRate}%</div>
            <p className="text-blue-100 text-base font-medium mb-6">
              {completedRequests} of {totalRequests} requests completed
            </p>
            <div className="bg-white bg-opacity-20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 shadow-lg transition-all duration-500"
                style={{ width: `${successRate}%` }}
              />
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
            <div className="text-4xl font-bold text-blue-800 mb-2">
              Rs. {totalFunds.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 font-medium">Received across all requests</p>

            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <Eye size={14} />
                  <span className="text-xs font-medium">Total Views</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{totalViews}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <Users size={14} />
                  <span className="text-xs font-medium">Supporters</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{totalSupporters}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
