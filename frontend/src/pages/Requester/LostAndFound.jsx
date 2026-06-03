import { useState } from 'react';
import {
  MapPin, Plus, X, Brain, Sparkles, Clock, CheckCircle2,
  Eye, Calendar, Tag, Mail, User, Zap, Filter, Package, Target
} from 'lucide-react';

const CATEGORIES = ['Bags & Accessories', 'Electronics', 'Documents & Cards', 'Personal Items', 'Jewellery', 'Keys', 'Clothing', 'Other'];

const mockMyLostReports = [
  {
    id: '1',
    title: 'Black Nike Backpack',
    description: 'Black Nike backpack with a distinctive red keychain on the zipper. Contains a silver MacBook laptop, blue notebooks, and a grey pencil case. Lost near the main library entrance after evening study session.',
    location: 'Main Library',
    date: '2026-05-28',
    status: 'searching',
    urgency: 'High',
    category: 'Bags & Accessories',
  },
  {
    id: '2',
    title: 'University ID Card',
    description: 'University student ID card. Name: Rumesh Tharaka, ID: S20200312. Lost between the cafeteria and the engineering block. Very urgent as needed for upcoming exams.',
    location: 'Cafeteria Area',
    date: '2026-05-30',
    status: 'searching',
    urgency: 'High',
    category: 'Documents & Cards',
  },
  {
    id: '3',
    title: 'Blue Hydro Flask',
    description: 'Blue 32oz Hydro Flask water bottle with a small dent on the bottom. Has a university sticker on the side. Lost during sports practice.',
    location: 'Sports Complex',
    date: '2026-06-01',
    status: 'matched',
    urgency: 'Low',
    category: 'Personal Items',
  },
  {
    id: '4',
    title: 'Wireless Earbuds Case',
    description: 'White Apple AirPods Pro charging case (without earbuds). Small crack on the hinge. Name written inside lid. Lost in the computer lab.',
    location: 'Computer Lab 3',
    date: '2026-04-15',
    status: 'closed',
    urgency: 'Medium',
    category: 'Electronics',
  },
];

const mockAIResults = [
  {
    id: 'f1',
    title: 'Black Backpack Found',
    description: 'Found a black backpack near the main library entrance on May 29th. Contains notebooks and what looks like a laptop. Has a coloured zipper pull — possibly red or orange.',
    location: 'Main Library Entrance',
    foundDate: '2026-05-29',
    reportedBy: 'Kamal Perera',
    contact: 'kamal.p@university.lk',
    matchScore: 94,
    highlights: ['Black backpack', 'Near library', 'Laptop & notebooks inside', 'Coloured zipper detail'],
  },
  {
    id: 'f2',
    title: 'Dark Sports Bag with Items',
    description: 'Found a dark-colored bag near the second-floor study area of the library. Contains electronics and study materials.',
    location: 'Library 2nd Floor',
    foundDate: '2026-05-30',
    reportedBy: 'Sarah Mendis',
    contact: '077-234-5678',
    matchScore: 67,
    highlights: ['Dark bag', 'Library area', 'Electronics inside'],
  },
  {
    id: 'f3',
    title: 'Bag with Stationery Items',
    description: 'A bag with personal items including stationery and some small items was found near the reading area.',
    location: 'Reading Area',
    foundDate: '2026-06-01',
    reportedBy: 'Anonymous',
    contact: 'library@university.lk',
    matchScore: 38,
    highlights: ['Bag found', 'Near library complex'],
  },
];

const AI_STAGES = [
  'Reading your description...',
  'Extracting key features & keywords...',
  'Scanning found items database...',
  'Calculating similarity scores...',
  'Ranking best matches...',
];

const getStatusConfig = (status) => {
  switch (status) {
    case 'searching': return { label: 'Searching', color: 'bg-amber-100 text-amber-700 border-amber-200', Icon: Clock };
    case 'matched': return { label: 'Match Found', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', Icon: CheckCircle2 };
    case 'closed': return { label: 'Closed', color: 'bg-gray-100 text-gray-500 border-gray-200', Icon: CheckCircle2 };
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

const getMatchMeta = (score) => {
  if (score >= 80) return { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300', border: 'border-emerald-200', bg: 'bg-emerald-50/40', label: 'Strong Match' };
  if (score >= 55) return { bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 border-amber-300', border: 'border-amber-200', bg: 'bg-amber-50/30', label: 'Possible Match' };
  return { bar: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600 border-gray-300', border: 'border-gray-200', bg: 'bg-white', label: 'Weak Match' };
};

const LostAndFound = () => {
  const [activeTab, setActiveTab] = useState('my-reports');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [aiText, setAiText] = useState('');
  const [aiSearching, setAiSearching] = useState(false);
  const [aiStage, setAiStage] = useState(0);
  const [aiResults, setAiResults] = useState(null);

  const [reportForm, setReportForm] = useState({
    title: '', category: '', urgency: 'Medium', description: '', location: '', dateLost: '',
  });

  const stats = {
    searching: mockMyLostReports.filter(r => r.status === 'searching').length,
    matched: mockMyLostReports.filter(r => r.status === 'matched').length,
    closed: mockMyLostReports.filter(r => r.status === 'closed').length,
  };

  const filtered = statusFilter === 'all'
    ? mockMyLostReports
    : mockMyLostReports.filter(r => r.status === statusFilter);

  const handleAiSearch = () => {
    if (!aiText.trim() || aiSearching) return;
    setAiSearching(true);
    setAiResults(null);
    setAiStage(0);
    let s = 0;
    const iv = setInterval(() => {
      s++;
      if (s < AI_STAGES.length) {
        setAiStage(s);
      } else {
        clearInterval(iv);
        setAiSearching(false);
        setAiResults(mockAIResults);
      }
    }, 550);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setShowReportModal(false);
    setReportForm({ title: '', category: '', urgency: 'Medium', description: '', location: '', dateLost: '' });
    alert('Lost item report submitted! You will be notified when a match is found.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lost & Found</h1>
          <p className="text-gray-600 mt-1">Track your lost items and use AI to find potential matches.</p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          Report Lost Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
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
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Match Found</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.matched}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="bg-gray-50 p-3 rounded-xl"><Package size={22} className="text-gray-500" /></div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Closed</p>
              <p className="text-3xl font-bold text-gray-600">{stats.closed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('my-reports')}
            className={`flex-1 py-4 px-6 font-semibold text-sm transition-all ${
              activeTab === 'my-reports'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-blue-50'
            }`}
          >
            My Lost Reports
          </button>
          <button
            onClick={() => setActiveTab('ai-finder')}
            className={`flex-1 py-4 px-6 font-semibold text-sm flex items-center justify-center gap-2 transition-all relative ${
              activeTab === 'ai-finder'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                : 'text-violet-700 bg-violet-50 hover:bg-violet-100'
            }`}
          >
            <Brain size={16} />
            Find with AI
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'ai-finder' ? 'bg-white/25 text-white' : 'bg-violet-600 text-white'
            }`}>AI</span>
          </button>
        </div>

        {/* My Reports Tab */}
        {activeTab === 'my-reports' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="bg-blue-50 p-2 rounded-xl">
                <Filter size={18} className="text-blue-600" />
              </div>
              {[
                { key: 'all', label: 'All' },
                { key: 'searching', label: 'Searching' },
                { key: 'matched', label: 'Match Found' },
                { key: 'closed', label: 'Closed' },
              ].map(({ key, label }) => (
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

            {filtered.length === 0 ? (
              <div className="text-center py-14">
                <Package size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="font-semibold text-gray-400">No lost reports found.</p>
                <button onClick={() => setShowReportModal(true)} className="mt-3 text-blue-600 font-semibold text-sm hover:underline">
                  + Report a lost item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((item) => {
                  const { label, color, Icon: StatusIcon } = getStatusConfig(item.status);
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
                              <StatusIcon size={11} />
                              {label}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getUrgencyStyle(item.urgency)}`}>
                              {item.urgency}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
                            <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                            <span className="flex items-center gap-1"><Tag size={12} /> {item.category}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => { setSelectedItem(item); setShowDetailsModal(true); }}
                          className="flex items-center gap-1.5 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition-all"
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
        )}

        {/* AI Finder Tab */}
        {activeTab === 'ai-finder' && (
          <div>
            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 text-white">
              <div className="max-w-2xl mx-auto text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="bg-white/15 backdrop-blur-sm p-3.5 rounded-2xl border border-white/20 shadow-lg">
                    <Brain size={32} />
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm p-3.5 rounded-2xl border border-white/20 shadow-lg">
                    <Sparkles size={32} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">AI-Powered Lost Item Finder</h2>
                <p className="text-violet-100 text-sm leading-relaxed max-w-lg mx-auto">
                  Describe your lost item in natural language — our AI analyzes keywords, features, and context to find the best matches from all reported found items.
                </p>
                <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-white/10 text-violet-100 text-xs px-3 py-1.5 rounded-full border border-white/15">
                    <Zap size={13} /> Instant Analysis
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 text-violet-100 text-xs px-3 py-1.5 rounded-full border border-white/15">
                    <Sparkles size={13} /> Smart Matching
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 text-violet-100 text-xs px-3 py-1.5 rounded-full border border-white/15">
                    <Target size={13} /> Confidence Scores
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Describe your lost item{' '}
                  <span className="text-gray-400 font-normal">(more detail = better matches)</span>
                </label>
                <textarea
                  value={aiText}
                  onChange={(e) => { setAiText(e.target.value); setAiResults(null); }}
                  rows={5}
                  placeholder="Example: I lost a black Nike backpack near the main library. It has a red keychain on the zipper. Inside there's a silver MacBook laptop, blue spiral notebooks, and a grey pencil case. I think I left it on May 28th around 6pm..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-500 text-gray-700 resize-none transition-all outline-none"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  Tip: Include color, brand, size, contents, and where/when you last had it for best results.
                </p>
              </div>

              <button
                onClick={handleAiSearch}
                disabled={!aiText.trim() || aiSearching}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all ${
                  aiText.trim() && !aiSearching
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {aiSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                    Analyzing your description...
                  </>
                ) : (
                  <>
                    <Brain size={20} />
                    Find My Lost Item with AI
                    <Sparkles size={18} />
                  </>
                )}
              </button>

              {/* Stage Progress */}
              {aiSearching && (
                <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5">
                  <p className="text-sm font-bold text-violet-800 mb-4 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-300 border-t-violet-700" />
                    AI Analysis in Progress
                  </p>
                  <div className="space-y-3">
                    {AI_STAGES.map((stage, i) => (
                      <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                        i < aiStage ? 'text-emerald-600' :
                        i === aiStage ? 'text-violet-800 font-semibold' :
                        'text-gray-300'
                      }`}>
                        {i < aiStage ? (
                          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        ) : i === aiStage ? (
                          <div className="h-4 w-4 rounded-full border-2 border-violet-400 border-t-violet-700 animate-spin flex-shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                        )}
                        {stage}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Results */}
              {aiResults && !aiSearching && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {aiResults.length} Potential Matches Found
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                      Sorted by match strength
                    </span>
                  </div>

                  {aiResults.map((result) => {
                    const mc = getMatchMeta(result.matchScore);
                    return (
                      <div key={result.id} className={`border-2 ${mc.border} ${mc.bg} rounded-2xl p-5 transition-all hover:shadow-md`}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="font-bold text-gray-900 text-base">{result.title}</h4>
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border flex-shrink-0 ${mc.badge}`}>
                            <Target size={12} />
                            {result.matchScore}% — {mc.label}
                          </span>
                        </div>

                        <div className="h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
                          <div className={`h-full rounded-full ${mc.bar}`} style={{ width: `${result.matchScore}%` }} />
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{result.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {result.highlights.map((h, i) => (
                            <span key={i} className="bg-violet-100 text-violet-700 text-xs px-2.5 py-1 rounded-full font-medium">
                              ✓ {h}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-3 border-t border-gray-200">
                          <span className="flex items-center gap-1.5"><MapPin size={12} className="text-gray-400" /> {result.location}</span>
                          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-gray-400" /> Found {result.foundDate}</span>
                          <span className="flex items-center gap-1.5"><User size={12} className="text-gray-400" /> {result.reportedBy}</span>
                          <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400" /> {result.contact}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Report Lost Item Modal */}
      {showReportModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold">Report Lost Item</h2>
              <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-blue-800 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Title *</label>
                <input
                  type="text"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  placeholder="e.g., Black Nike Backpack"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                  <select
                    value={reportForm.category}
                    onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Urgency</label>
                  <select
                    value={reportForm.urgency}
                    onChange={(e) => setReportForm({ ...reportForm, urgency: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  rows={4}
                  placeholder="Describe the item — color, brand, distinguishing features, contents..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Seen Location *</label>
                  <input
                    type="text"
                    value={reportForm.location}
                    onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                    placeholder="e.g., Main Library"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date Lost *</label>
                  <input
                    type="date"
                    value={reportForm.dateLost}
                    onChange={(e) => setReportForm({ ...reportForm, dateLost: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold">Item Details</h2>
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
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm text-gray-700 mt-1">{selectedItem.category}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Description</p>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedItem.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Last Seen Location</p>
                  <p className="text-gray-700 text-sm flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" /> {selectedItem.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Date Lost</p>
                  <p className="text-gray-700 text-sm">{selectedItem.date}</p>
                </div>
              </div>
              {selectedItem.status === 'searching' && (
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-violet-800 mb-1 flex items-center gap-2">
                    <Brain size={15} /> Try AI Finder
                  </p>
                  <p className="text-xs text-violet-600">
                    Use the AI Finder tab — paste this item's description to automatically match against all reported found items.
                  </p>
                </div>
              )}
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
