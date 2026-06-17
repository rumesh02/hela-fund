import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Plus, X, Clock, CheckCircle2, Eye, Calendar,
  Package, Search, Filter, Sparkles, ShieldCheck, AlertCircle,
  FileText, ExternalLink
} from 'lucide-react';
import api from '../../utils/api';

const isImageFile = (name = '') => /\.(jpe?g|png|gif|webp|bmp)$/i.test(name);
const isPdfFile = (name = '') => /\.pdf$/i.test(name);

// Map the backend Request status to a Lost & Found friendly status
const getStatusConfig = (status) => {
  switch (status) {
    case 'active':
      return { label: 'Searching', color: 'bg-amber-100 text-amber-700 border-amber-200', Icon: Clock };
    case 'completed':
      return { label: 'Found', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', Icon: CheckCircle2 };
    case 'Inactive':
    case 'cancelled':
      return { label: 'Closed', color: 'bg-gray-100 text-gray-500 border-gray-200', Icon: X };
    case 'expired':
      return { label: 'Expired', color: 'bg-rose-100 text-rose-600 border-rose-200', Icon: AlertCircle };
    default:
      return { label: status, color: 'bg-gray-100 text-gray-500 border-gray-200', Icon: Clock };
  }
};

const getUrgencyStyle = (urgency) => {
  switch (urgency) {
    case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    default: return 'bg-gray-100 text-gray-500 border-gray-200';
  }
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const LostAndFound = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/requests/my-requests');
        if (response.success) {
          setReports(response.data.filter((r) => r.category === 'Lost Item'));
        } else {
          setError(response.message || 'Failed to fetch your lost item reports');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching your reports');
        console.error('Error fetching lost item reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, []);

  const stats = {
    total: reports.length,
    searching: reports.filter((r) => r.status === 'active').length,
    found: reports.filter((r) => r.status === 'completed').length,
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Searching' },
    { key: 'completed', label: 'Found' },
    { key: 'Inactive', label: 'Closed' },
  ];

  const filtered = statusFilter === 'all'
    ? reports
    : reports.filter((r) => r.status === statusFilter);

  const goToCreate = () => navigate('/requester/create-request');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lost &amp; Found</h1>
          <p className="text-gray-600 mt-1">Track the lost item reports you've submitted.</p>
        </div>
        <button
          onClick={goToCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          Report Lost Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow border border-blue-100 p-5 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-xl"><Package size={22} className="text-blue-600" /></div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reports</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow border border-amber-100 p-5 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 p-3 rounded-xl"><Clock size={22} className="text-amber-600" /></div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Searching</p>
              <p className="text-3xl font-bold text-amber-600">{stats.searching}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow border border-emerald-100 p-5 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-3 rounded-xl"><CheckCircle2 size={22} className="text-emerald-600" /></div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Found</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.found}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Find with AI — coming soon teaser */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl shadow-md px-5 py-4">
        <div className="bg-white/15 p-2.5 rounded-xl border border-white/20">
          <Sparkles size={20} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Find with AI</p>
          <p className="text-violet-100 text-xs">Soon you'll be able to match your lost items against reported found items automatically.</p>
        </div>
        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Coming Soon</span>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Filter bar */}
        <div className="flex items-center gap-3 p-6 pb-0 flex-wrap">
          <div className="bg-blue-50 p-2 rounded-xl">
            <Filter size={18} className="text-blue-600" />
          </div>
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                statusFilter === key
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              <p className="text-gray-600 font-medium mt-4">Loading your lost item reports...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle size={44} className="mx-auto mb-3 text-rose-400" />
              <p className="text-rose-600 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-14">
              <Search size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-400">
                {reports.length === 0
                  ? "You haven't reported any lost items yet."
                  : 'No reports match this filter.'}
              </p>
              {reports.length === 0 && (
                <button
                  onClick={goToCreate}
                  className="mt-3 text-blue-600 font-semibold text-sm hover:underline"
                >
                  + Report a lost item
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((item) => {
                const { label, color, Icon: StatusIcon } = getStatusConfig(item.status);
                return (
                  <div
                    key={item._id}
                    className="border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 text-base leading-tight">{item.title}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${color}`}>
                        <StatusIcon size={11} />
                        {label}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-1">{item.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {item.itemLostLocation || 'Unknown location'}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(item.createdAt)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getUrgencyStyle(item.urgency)}`}>
                          {item.urgency}
                        </span>
                        {item.isVerified ? (
                          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <ShieldCheck size={12} /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => { setSelectedItem(item); setShowDetailsModal(true); }}
                        className="flex items-center gap-1.5 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                      >
                        <Eye size={14} />
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Item Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold">Lost Item Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-blue-800 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Title</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{selectedItem.title}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusConfig(selectedItem.status).color}`}>
                    {getStatusConfig(selectedItem.status).label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Urgency</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyStyle(selectedItem.urgency)}`}>
                    {selectedItem.urgency}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Verification</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedItem.isVerified ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                  }`}>
                    {selectedItem.isVerified ? <ShieldCheck size={12} /> : <Clock size={12} />}
                    {selectedItem.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Description</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedItem.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Last Seen Location</p>
                  <p className="text-gray-700 text-sm flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" /> {selectedItem.itemLostLocation || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Reported On</p>
                  <p className="text-gray-700 text-sm">{formatDate(selectedItem.createdAt)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Proof / Documentation</p>
                {selectedItem.proofDocument?.url ? (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {isImageFile(selectedItem.proofDocument.name) ? (
                      <div>
                        <img
                          src={selectedItem.proofDocument.url}
                          alt={selectedItem.proofDocument.name}
                          className="w-full max-h-72 object-contain bg-gray-50"
                        />
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={15} className="text-gray-500 flex-shrink-0" />
                            <span className="text-xs text-gray-600 truncate">{selectedItem.proofDocument.name}</span>
                          </div>
                          <a
                            href={selectedItem.proofDocument.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition flex-shrink-0 ml-3"
                          >
                            <ExternalLink size={13} />
                            Open
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between px-4 py-4 bg-gray-50">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                            <FileText size={18} className="text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{selectedItem.proofDocument.name}</p>
                            <p className="text-xs text-gray-500">
                              {isPdfFile(selectedItem.proofDocument.name) ? 'PDF Document' : 'Document'}
                            </p>
                          </div>
                        </div>
                        <a
                          href={selectedItem.proofDocument.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition flex-shrink-0 ml-3"
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
            <div className="px-6 pb-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostAndFound;
