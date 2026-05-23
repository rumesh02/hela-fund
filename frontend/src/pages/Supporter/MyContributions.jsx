import { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, MessageSquare, Eye } from 'lucide-react';
import api from '../../utils/api';

const MyContributions = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/contributions/my-contributions');
        setContributions(response.data || []);
      } catch (err) {
        console.error('Error fetching contributions:', err);
        setError(err.message || 'Failed to fetch contributions');
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: Clock },
      ongoing: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: Clock },
      completed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: XCircle }
    };
    return styles[status] || styles.pending;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Micro-Funding': '💰',
      'Lost Item': '🔍',
      'Community Help': '🤝',
      Electronics: '💻',
      Books: '📚',
      Transport: '🚌',
      Medical: '⚕️',
      Food: '🍽️',
      Other: '📦'
    };
    return icons[category] || '📦';
  };

  const getContributionStatus = (contribution) => {
    const paymentStatus = contribution.paymentStatus || 'pending';
    if (paymentStatus === 'completed') {
      if (contribution.request?.status === 'completed') return 'completed';
      return 'ongoing';
    }
    if (paymentStatus === 'pending') return 'pending';
    return 'cancelled';
  };

  const filteredContributions = contributions.filter((contrib) => {
    const status = getContributionStatus(contrib);
    return selectedStatus === 'all' || status === selectedStatus;
  });

  const stats = {
    total: contributions.length,
    pending: contributions.filter((c) => getContributionStatus(c) === 'pending').length,
    ongoing: contributions.filter((c) => getContributionStatus(c) === 'ongoing').length,
    completed: contributions.filter((c) => getContributionStatus(c) === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Contributions</h1>
        <p className="text-gray-600 mt-1">Track all the requests you've helped with</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Total Contributions</p>
          <p className="text-4xl font-bold text-gray-900 mt-3">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <p className="text-sm text-blue-700 font-semibold uppercase tracking-wider mb-1">Pending</p>
          <p className="text-4xl font-bold text-blue-800 mt-3">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
          <p className="text-sm text-amber-700 font-semibold uppercase tracking-wider mb-1">Ongoing</p>
          <p className="text-4xl font-bold text-amber-800 mt-3">{stats.ongoing}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <p className="text-sm text-emerald-700 font-semibold uppercase tracking-wider mb-1">Completed</p>
          <p className="text-4xl font-bold text-emerald-800 mt-3">{stats.completed}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'ongoing', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-6 py-3 rounded-xl font-medium capitalize transition-all duration-200 ${
                selectedStatus === status
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-teal-50 hover:text-teal-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Contributions List */}
      <div className="space-y-4">
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contributions...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Contributions</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && filteredContributions.map((contribution) => {
          const derivedStatus = getContributionStatus(contribution);
          const statusStyle = getStatusBadge(derivedStatus);
          const StatusIcon = statusStyle.icon;
          const category = contribution.request?.category;
          const amountValue = contribution.amount || 0;
          const currency = contribution.currency || 'LKR';
          const requesterName = contribution.request?.requester?.name || 'Anonymous';
          const requestAmount = contribution.request?.amount || 0;

          return (
            <div
              key={contribution._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Left Section - Request Info */}
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-3xl">{getCategoryIcon(category)}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {contribution.request?.title || 'Request'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Requester:</span> {requesterName}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">Category: {category || 'N/A'}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        Contributed: {new Date(contribution.createdAt).toLocaleDateString()}
                      </div>
                      {contribution.request?.status === 'completed' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={14} className="mr-1" />
                          Request Completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section - Status & Actions */}
                <div className="flex flex-col lg:items-end space-y-3">
                  {/* Amount */}
                  <div className="text-lg font-bold text-teal-600">
                    {currency} {amountValue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Needed: {currency} {requestAmount.toLocaleString()}
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                  >
                    <StatusIcon size={16} />
                    <span className="capitalize">{derivedStatus}</span>
                  </span>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm">
                      <MessageSquare size={16} />
                      <span>Message</span>
                    </button>
                    <button className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                      <Eye size={16} />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {!loading && !error && filteredContributions.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No contributions found</h3>
          <p className="text-gray-600 mb-4">
            You haven't made any contributions with this status yet
          </p>
          <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium">
            Browse Requests
          </button>
        </div>
      )}
    </div>
  );
};

export default MyContributions;
