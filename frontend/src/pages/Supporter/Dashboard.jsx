import { useState, useEffect } from 'react';
import { Heart, TrendingUp, CheckCircle, Clock, Banknote, Target, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const getRequestStatusStyle = (status) => {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'active':    return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Inactive':  return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'expired':   return 'bg-orange-100 text-orange-700 border-orange-200';
    default:          return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const getPaymentStatusStyle = (status) => {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'pending':   return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'failed':    return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'refunded':  return 'bg-violet-100 text-violet-700 border-violet-200';
    default:          return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await api.get('/contributions/my-contributions');
        if (response.success) {
          setContributions(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch contributions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContributions();
  }, []);

  // --- Derived stats ---
  const totalContributions = contributions.length;

  const uniqueRequestIds = [...new Set(contributions.map(c => c.request?._id).filter(Boolean))];
  const uniqueRequestsCount = uniqueRequestIds.length;

  const ongoingRequestIds = [...new Set(
    contributions.filter(c => c.request?.status === 'active').map(c => c.request?._id)
  )];
  const completedRequestIds = [...new Set(
    contributions.filter(c => c.request?.status === 'completed').map(c => c.request?._id)
  )];

  const totalAmountGiven = contributions
    .filter(c => c.paymentStatus === 'completed')
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  const avgContribution = totalContributions > 0
    ? Math.round(totalAmountGiven / totalContributions)
    : 0;

  const largestContribution = contributions.reduce((max, c) => Math.max(max, c.amount || 0), 0);

  const categoryCounts = contributions.reduce((acc, c) => {
    const cat = c.request?.category;
    if (cat) acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const completionRate = uniqueRequestsCount > 0
    ? Math.round((completedRequestIds.length / uniqueRequestsCount) * 100)
    : 0;

  const stats = [
    {
      title: 'Total Contributions',
      value: totalContributions,
      icon: Heart,
      textColor: 'text-teal-700',
      bgLight: 'bg-teal-50',
    },
    {
      title: 'Ongoing Support',
      value: ongoingRequestIds.length,
      icon: Clock,
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50',
    },
    {
      title: 'Completed Helps',
      value: completedRequestIds.length,
      icon: CheckCircle,
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50',
    },
    {
      title: 'Requests Helped',
      value: uniqueRequestsCount,
      icon: Target,
      textColor: 'text-purple-700',
      bgLight: 'bg-purple-50',
    },
  ];

  const recentActivity = contributions.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back, {user?.name || 'Supporter'}!</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your contributions and impact.</p>
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
            <button
              onClick={() => navigate('/supporter/my-contributions')}
              className="text-teal-600 text-sm font-semibold hover:text-teal-700 hover:underline transition-all"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Heart size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No contributions yet</p>
                <p className="text-sm mt-1">Browse requests and start making a difference</p>
              </div>
            ) : (
              recentActivity.map((contribution) => (
                <div
                  key={contribution._id}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-teal-50 rounded-xl hover:from-teal-50 hover:to-teal-100 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-teal-200 hover:shadow-md"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-base truncate">
                        {contribution.request?.title || 'Unknown Request'}
                      </h3>
                      <span className="font-bold text-teal-700 text-sm whitespace-nowrap">
                        Rs. {contribution.amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium border border-gray-200 shadow-sm whitespace-nowrap">
                        {contribution.request?.category || '—'}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {new Date(contribution.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getRequestStatusStyle(contribution.request?.status)}`}>
                      {contribution.request?.status
                        ? contribution.request.status.charAt(0).toUpperCase() + contribution.request.status.slice(1)
                        : '—'}
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getPaymentStatusStyle(contribution.paymentStatus)}`}>
                      {contribution.paymentStatus?.charAt(0).toUpperCase() + contribution.paymentStatus?.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Total Given Card */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Total Given</h3>
              <TrendingUp size={28} strokeWidth={2.5} />
            </div>
            <div className="text-4xl font-bold mb-2">Rs. {totalAmountGiven.toLocaleString()}</div>
            <p className="text-teal-100 text-base font-medium mb-4">
              From {totalContributions} contributions
            </p>
            <div className="bg-white bg-opacity-20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 shadow-lg transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-teal-200 text-sm mt-2">{completionRate}% of supported requests completed</p>
          </div>

          {/* Contribution Insights */}
          <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-gray-900">Insights</h3>
              <div className="bg-teal-50 p-3 rounded-xl">
                <BarChart3 className="text-teal-600" size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="text-sm text-gray-500 font-medium">Avg. Contribution</span>
                <span className="font-bold text-gray-900">Rs. {avgContribution.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="text-sm text-gray-500 font-medium">Largest Gift</span>
                <span className="font-bold text-gray-900">Rs. {largestContribution.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-500 font-medium">Top Category</span>
                <span className="font-bold text-gray-900 text-sm text-right">{topCategory}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
