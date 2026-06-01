import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Clock, HandHeart, MapPin, Users, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORIES = ['All', 'Micro-Funding', 'Lost Item', 'Community Help'];

const VerifyRequests = () => {
  const { adminUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // all | verified | pending
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const categoryParam =
        activeCategory !== 'All' ? `?category=${encodeURIComponent(activeCategory)}` : '';
      const res = await fetch(`${API_URL}/admin/requests${categoryParam}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch requests');
      setRequests(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeCategory]);

  const handleVerify = async (requestId) => {
    setActionLoading(requestId);
    try {
      const res = await fetch(`${API_URL}/admin/requests/${requestId}/verify`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to verify request');
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, isVerified: true } : r))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlock = async (requestId) => {
    setActionLoading(requestId);
    try {
      const res = await fetch(`${API_URL}/admin/requests/${requestId}/block`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to block request');
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, isVerified: false } : r))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'verified') return r.isVerified === true;
    if (statusFilter === 'pending') return r.isVerified === false;
    return true;
  });

  const verifiedCount = requests.filter((r) => r.isVerified).length;
  const pendingCount = requests.filter((r) => !r.isVerified).length;

  const categoryIcon = (cat) => {
    if (cat === 'Micro-Funding') return <HandHeart size={16} className="inline mr-1" />;
    if (cat === 'Lost Item') return <MapPin size={16} className="inline mr-1" />;
    if (cat === 'Community Help') return <Users size={16} className="inline mr-1" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border-l-4 border-indigo-600 rounded-xl shadow-md p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Requests</h1>
          <p className="text-gray-600 mt-1">Review and approve or block requester submissions</p>
        </div>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{requests.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow border border-emerald-100 p-5">
          <p className="text-sm text-emerald-600 font-medium uppercase tracking-wider">Verified</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{verifiedCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow border border-amber-100 p-5">
          <p className="text-sm text-amber-600 font-medium uppercase tracking-wider">Pending</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{pendingCount}</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-2">
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              {categoryIcon(cat)}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-4 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Show:</span>
        {[
          { value: 'all', label: 'All' },
          { value: 'verified', label: 'Verified' },
          { value: 'pending', label: 'Pending' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              statusFilter === opt.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-500">
          {filteredRequests.length} request{filteredRequests.length !== 1 && 's'}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-500 mt-4">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-indigo-50 transition-all">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 max-w-xs truncate">
                        {request.title}
                      </div>
                      {request.description && (
                        <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">
                          {request.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {categoryIcon(request.category)}
                        {request.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {request.anonymous
                          ? 'Anonymous'
                          : request.requester?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.urgency === 'High'
                            ? 'bg-red-100 text-red-700'
                            : request.urgency === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {request.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {request.isVerified ? (
                        <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold w-fit">
                          <CheckCircle size={13} />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-semibold w-fit">
                          <Clock size={13} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVerify(request._id)}
                          disabled={actionLoading === request._id || request.isVerified}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Verify request"
                        >
                          <CheckCircle size={14} />
                          Verify
                        </button>
                        <button
                          onClick={() => handleBlock(request._id)}
                          disabled={actionLoading === request._id || !request.isVerified}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Block request"
                        >
                          <XCircle size={14} />
                          Block
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyRequests;
