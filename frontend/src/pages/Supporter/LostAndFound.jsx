import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Search, X, Eye, Upload, Filter, Clock,
  CheckCircle2, Calendar, Package, Phone, Mail,
  User, Plus, Camera, ShieldCheck, MessageSquare,
  FileText, ExternalLink, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORIES = ['Bags & Accessories', 'Electronics', 'Documents & Cards', 'Personal Items', 'Jewellery', 'Keys', 'Clothing', 'Other'];

const isImageFile = (name = '') => /\.(jpe?g|png|gif|webp|bmp)$/i.test(name);
const isPdfFile = (name = '') => /\.pdf$/i.test(name);

const getStatusConfig = (status) => {
  switch (status) {
    case 'active': return { label: 'Searching', color: 'bg-amber-100 text-amber-700 border-amber-200', Icon: Clock };
    case 'completed': return { label: 'Found', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', Icon: CheckCircle2 };
    case 'Inactive':
    case 'cancelled': return { label: 'Closed', color: 'bg-gray-100 text-gray-500 border-gray-200', Icon: X };
    case 'expired': return { label: 'Expired', color: 'bg-rose-100 text-rose-600 border-rose-200', Icon: AlertCircle };
    default: return { label: status, color: 'bg-gray-100 text-gray-500 border-gray-200', Icon: Clock };
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
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('browse');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [foundForm, setFoundForm] = useState({
    title: '', description: '', location: '', foundDate: '',
    category: '', contactName: '', contactPhone: '', contactEmail: '',
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch all lost item requests
  useEffect(() => {
    const fetchLostReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/requests?category=${encodeURIComponent('Lost Item')}&limit=100`);
        if (response.success) {
          setReports(response.data);
        } else {
          setError(response.message || 'Failed to fetch lost item reports');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching lost item reports');
        console.error('Error fetching lost reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLostReports();
  }, []);

  // Prefill the supporter's contact info into the found form
  useEffect(() => {
    if (user) {
      setFoundForm((prev) => ({
        ...prev,
        contactName: prev.contactName || user.name || user.fullName || '',
        contactEmail: prev.contactEmail || user.email || '',
      }));
    }
  }, [user]);

  const activeReports = reports.filter((r) => r.status === 'active');
  const matchedReports = reports.filter((r) => r.status === 'completed');

  const filteredReports = reports.filter((item) => {
    const urgMatch = urgencyFilter === 'all' || item.urgency === urgencyFilter;
    const searchMatch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.itemLostLocation || '').toLowerCase().includes(searchQuery.toLowerCase());
    return urgMatch && searchMatch;
  });

  const handleImageUpload = (files) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImages((prev) => [...prev, { name: file.name, url: ev.target.result, file }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImageUpload(e.dataTransfer.files);
  };

  const handleFoundSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSubmitError('Please login to report a found item.');
        setSubmitting(false);
        return;
      }

      const body = new FormData();
      body.append('title', foundForm.title);
      body.append('description', foundForm.description);
      body.append('category', foundForm.category);
      body.append('location', foundForm.location);
      body.append('foundDate', foundForm.foundDate);
      body.append('contactName', foundForm.contactName);
      body.append('contactPhone', foundForm.contactPhone);
      body.append('contactEmail', foundForm.contactEmail);
      uploadedImages.forEach((img) => {
        if (img.file) body.append('images', img.file);
      });

      const response = await fetch(`${API_URL}/founds`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.message || 'Failed to report found item.');
      }
    } catch (err) {
      setSubmitError(err.message || 'An error occurred while submitting.');
      console.error('Error submitting found item:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // "I Found This" → open a chat with the requester
  const handleFoundThis = (item) => {
    if (item.anonymous || !item.requester?._id) return;
    navigate('/supporter/messages', {
      state: {
        userId: item.requester._id,
        userName: item.requester.name || item.requester.fullName || 'User',
        userAvatar: item.requester.avatar || null,
      },
    });
  };

  const resetFoundForm = () => {
    setSubmitted(false);
    setSubmitError('');
    setFoundForm({
      title: '', description: '', location: '', foundDate: '', category: '',
      contactName: user?.name || user?.fullName || '', contactPhone: '', contactEmail: user?.email || '',
    });
    setUploadedImages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lost &amp; Found</h1>
          <p className="text-gray-600 mt-1">Help reunite people with their lost belongings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
            <p className="text-xl font-bold text-amber-600">{activeReports.length}</p>
            <p className="text-xs text-amber-700 font-medium">Active Searches</p>
          </div>
          <div className="text-center bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
            <p className="text-xl font-bold text-emerald-600">{matchedReports.length}</p>
            <p className="text-xs text-emerald-700 font-medium">Found</p>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-4 px-6 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'browse' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-teal-50'
            }`}
          >
            <Search size={15} />
            Browse Lost Reports
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'browse' ? 'bg-white/25 text-white' : 'bg-teal-100 text-teal-700'
            }`}>{reports.length}</span>
          </button>
          <button
            onClick={() => { setActiveTab('report-found'); resetFoundForm(); }}
            className={`flex-1 py-4 px-6 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'report-found' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-teal-50'
            }`}
          >
            <Plus size={15} />
            Report Found Item
          </button>
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="p-6 space-y-5">
            {/* Search + Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by item name, description or location..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-teal-50 p-2 rounded-xl">
                  <Filter size={16} className="text-teal-600" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Urgency:</span>
                {['all', 'High', 'Medium', 'Low'].map((u) => (
                  <button
                    key={u}
                    onClick={() => setUrgencyFilter(u)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      urgencyFilter === u ? 'bg-teal-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {u === 'all' ? 'All' : u}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
                <p className="text-gray-600 font-medium mt-4">Loading lost item reports...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <AlertCircle size={44} className="mx-auto mb-3 text-rose-400" />
                <p className="text-rose-600 font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-all"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 font-medium">
                  Showing {filteredReports.length} of {reports.length} reports
                </p>

                {filteredReports.length === 0 ? (
                  <div className="text-center py-14">
                    <Package size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-semibold text-gray-400">
                      {reports.length === 0 ? 'No lost item reports yet.' : 'No reports match your filters.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredReports.map((item) => {
                      const { label, color, Icon: StatusIcon } = getStatusConfig(item.status);
                      const reporterName = item.anonymous ? 'Anonymous' : (item.requester?.name || item.requester?.fullName || 'Unknown');
                      const canMessage = !item.anonymous && item.requester?._id;
                      return (
                        <div key={item._id} className="border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:border-teal-200 transition-all flex flex-col">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${color}`}>
                              <StatusIcon size={10} />
                              {label}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{item.description}</p>

                          <div className="space-y-1 mb-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <MapPin size={12} className="text-gray-300" />
                              {item.itemLostLocation || 'Unknown location'}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Calendar size={12} className="text-gray-300" />
                              Reported {formatDate(item.createdAt)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getUrgencyStyle(item.urgency)}`}>
                              {item.urgency} Priority
                            </span>
                            <span className="text-xs text-gray-400">by {reporterName}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => { setSelectedItem(item); setShowDetailsModal(true); }}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                            >
                              <Eye size={13} /> View Details
                            </button>
                            {item.status === 'active' && canMessage && (
                              <button
                                onClick={() => handleFoundThis(item)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl text-xs font-bold hover:from-teal-700 hover:to-teal-800 transition-all shadow-sm"
                              >
                                <CheckCircle2 size={13} /> I Found This!
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Report Found Item Tab */}
        {activeTab === 'report-found' && (
          <div className="p-6">
            {submitted ? (
              <div className="text-center py-16">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={40} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Found Item Reported!</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                  Thank you! Your report has been saved. We will match it against lost item reports and help notify the owner.
                </p>
                <button
                  onClick={resetFoundForm}
                  className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition-all"
                >
                  Report Another Found Item
                </button>
              </div>
            ) : (
              <form onSubmit={handleFoundSubmit} className="max-w-2xl mx-auto space-y-5">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-bold text-gray-900">Report a Found Item</h3>
                  <p className="text-sm text-gray-500 mt-1">Help someone get their belonging back — fill in what you found and where.</p>
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {submitError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Title *</label>
                  <input
                    type="text"
                    value={foundForm.title}
                    onChange={(e) => setFoundForm({ ...foundForm, title: e.target.value })}
                    placeholder="Black Backpack, ID Card, Keys"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                    <select
                      value={foundForm.category}
                      onChange={(e) => setFoundForm({ ...foundForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Select...</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date Found *</label>
                    <input
                      type="date"
                      value={foundForm.foundDate}
                      onChange={(e) => setFoundForm({ ...foundForm, foundDate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                  <textarea
                    value={foundForm.description}
                    onChange={(e) => setFoundForm({ ...foundForm, description: e.target.value })}
                    rows={4}
                    placeholder="Describe what the item looks like - color, brand, contents, any distinguishing features"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Where Found *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={foundForm.location}
                      onChange={(e) => setFoundForm({ ...foundForm, location: e.target.value })}
                      placeholder="Main Library Entrance, 2nd Floor"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Photos of the Item{' '}
                    <span className="text-gray-400 font-normal">(optional, helps with matching)</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-7 text-center hover:border-teal-400 hover:bg-teal-50/40 transition-all cursor-pointer"
                    onClick={() => document.getElementById('found-image-upload').click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <Camera size={30} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag &amp; drop images</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Up to 5 images</p>
                    <input
                      id="found-image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden aspect-square bg-gray-100 group">
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setUploadedImages((prev) => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                      {uploadedImages.length < 5 && (
                        <button
                          type="button"
                          onClick={() => document.getElementById('found-image-upload').click()}
                          className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-teal-400 hover:text-teal-500 transition-all"
                        >
                          <Upload size={20} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 space-y-4">
                  <p className="text-sm font-bold text-teal-800 flex items-center gap-2">
                    <User size={15} />
                    Your Contact Information
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={foundForm.contactName}
                      onChange={(e) => setFoundForm({ ...foundForm, contactName: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm bg-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone *</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={foundForm.contactPhone}
                          onChange={(e) => setFoundForm({ ...foundForm, contactPhone: e.target.value })}
                          placeholder="07X-XXX-XXXX"
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm bg-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={foundForm.contactEmail}
                          onChange={(e) => setFoundForm({ ...foundForm, contactEmail: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-base transition-all ${
                      submitting
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Submit Found Item Report
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white p-5 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold">Lost Item Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-teal-800 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Item</p>
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
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Priority</p>
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
                  <p className="text-sm text-gray-700 flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" /> {selectedItem.itemLostLocation || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Reported On</p>
                  <p className="text-sm text-gray-700">{formatDate(selectedItem.createdAt)}</p>
                </div>
              </div>

              {/* Proof / Documentation */}
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
                            className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-800 transition flex-shrink-0 ml-3"
                          >
                            <ExternalLink size={13} />
                            Open
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between px-4 py-4 bg-gray-50">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="bg-teal-100 p-2 rounded-lg flex-shrink-0">
                            <FileText size={18} className="text-teal-600" />
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
                          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition flex-shrink-0 ml-3"
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

              {/* Reporter */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Reported By</p>
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <User size={16} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedItem.anonymous ? 'Anonymous' : (selectedItem.requester?.name || selectedItem.requester?.fullName || 'Unknown')}
                    </p>
                    {!selectedItem.anonymous && selectedItem.requester?.email && (
                      <p className="text-xs text-gray-500">{selectedItem.requester.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
              >
                Close
              </button>
              {selectedItem.status === 'active' && !selectedItem.anonymous && selectedItem.requester?._id && (
                <button
                  onClick={() => { setShowDetailsModal(false); handleFoundThis(selectedItem); }}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all text-sm shadow-md"
                >
                  <MessageSquare size={15} /> I Found This — Message Owner
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostAndFound;
