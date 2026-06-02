import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  CheckCircle, XCircle, Clock, HandHeart, MapPin, Users,
  RefreshCw, Eye, X, FileText, ExternalLink, DollarSign, User,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORIES = ['All', 'Micro-Funding', 'Lost Item', 'Community Help'];

const isImageFile = (name = '') =>
  /\.(jpe?g|png|gif|webp|bmp)$/i.test(name);

const isPdfFile = (name = '') => /\.pdf$/i.test(name);

const RequestDetailModal = ({ request, onClose, onVerify, onBlock, actionLoading }) => {
  if (!request) return null;

  const proof = request.proofDocument;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{request.title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Submitted {new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition ml-4 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status + urgency row */}
          <div className="flex flex-wrap gap-2">
            {request.isVerified ? (
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle size={13} /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-semibold">
                <Clock size={13} /> Pending
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                request.urgency === 'High'
                  ? 'bg-red-100 text-red-700'
                  : request.urgency === 'Medium'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {request.urgency} Urgency
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
              {request.category}
            </span>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{request.description}</p>
          </div>

          {/* Requester */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <User size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Requester</p>
              {request.anonymous ? (
                <p className="text-sm font-medium text-gray-700">Anonymous</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-900">{request.requester?.name || 'Unknown'}</p>
                  {request.requester?.email && (
                    <p className="text-xs text-gray-500">{request.requester.email}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Category-specific fields */}
          {request.category === 'Lost Item' && request.itemLostLocation && (
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <div className="bg-rose-100 p-2 rounded-full">
                <MapPin size={18} className="text-rose-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lost Location</p>
                <p className="text-sm font-medium text-gray-900">{request.itemLostLocation}</p>
              </div>
            </div>
          )}

          {request.category === 'Micro-Funding' && request.amount != null && (
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <div className="bg-green-100 p-2 rounded-full">
                <DollarSign size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount Requested</p>
                <p className="text-sm font-medium text-gray-900">Rs. {Number(request.amount).toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Proof Document */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Proof / Documentation</p>
            {proof?.url ? (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {isImageFile(proof.name) ? (
                  <div>
                    <img
                      src={proof.url}
                      alt={proof.name}
                      className="w-full max-h-80 object-contain bg-gray-50"
                    />
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={15} className="text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600 truncate">{proof.name}</span>
                      </div>
                      <a
                        href={proof.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 transition flex-shrink-0 ml-3"
                      >
                        <ExternalLink size={13} />
                        Open
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-4 py-4 bg-gray-50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                        <FileText size={18} className="text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{proof.name}</p>
                        <p className="text-xs text-gray-500">
                          {isPdfFile(proof.name) ? 'PDF Document' : 'Document'}
                        </p>
                      </div>
                    </div>
                    <a
                      href={proof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition flex-shrink-0 ml-3"
                    >
                      <ExternalLink size={13} />
                      View Document
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No proof document uploaded.</p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => onVerify(request._id)}
            disabled={actionLoading === request._id || request.isVerified}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={15} />
            Verify
          </button>
          <button
            onClick={() => onBlock(request._id)}
            disabled={actionLoading === request._id || !request.isVerified}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-lg hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle size={15} />
            Block
          </button>
          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const VerifyRequests = () => {
  const { adminUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

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
      setSelectedRequest((prev) =>
        prev?._id === requestId ? { ...prev, isVerified: true } : prev
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
      setSelectedRequest((prev) =>
        prev?._id === requestId ? { ...prev, isVerified: false } : prev
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6 space-y-6">
      {/* Detail modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onVerify={handleVerify}
          onBlock={handleBlock}
          actionLoading={actionLoading}
        />
      )}

      {/* Header */}
      <div className="bg-white border-l-4 border-purple-600 rounded-xl shadow-md p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Requests</h1>
          <p className="text-gray-600 mt-1">Review and approve or block requester submissions</p>
        </div>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-60"
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
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
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
                ? 'bg-purple-600 text-white'
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
          <div className="overflow-x-auto scrollbar-subtle">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-purple-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Requester</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Urgency</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-purple-50 transition-all">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 max-w-xs truncate">{request.title}</div>
                      {request.description && (
                        <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{request.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {request.anonymous ? 'Anonymous' : request.requester?.fullName || request.requester?.name || 'Unknown'}
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
                          onClick={() => setSelectedRequest(request)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg hover:bg-indigo-200 transition"
                          title="View details"
                        >
                          <Eye size={14} />
                          Details
                        </button>
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
