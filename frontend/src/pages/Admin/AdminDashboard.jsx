import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Users, FileText, TrendingUp, Shield, LogOut, Bell,
  CheckCircle, Clock, AlertCircle, Banknote, RefreshCw,
  ClipboardCheck, BarChart3, ArrowRight, UserCheck, UserX,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
    <div className={`p-4 rounded-xl ${color} flex-shrink-0`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const MiniStatCard = ({ icon: Icon, label, value, textColor, bgColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${bgColor}`}>
      <Icon className={`w-5 h-5 ${textColor}`} />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const urgencyStyle = (urgency) => {
  switch (urgency) {
    case 'High':   return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
    default:       return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  }
};

const AdminDashboard = () => {
  const { adminUser, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!adminUser?.token) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${adminUser.token}` };
        const [usersRes, requestsRes] = await Promise.all([
          fetch(`${API_URL}/admin/users`, { headers }),
          fetch(`${API_URL}/admin/requests`, { headers }),
        ]);
        const [usersData, requestsData] = await Promise.all([
          usersRes.json(),
          requestsRes.json(),
        ]);
        if (usersData.success) setUsers(usersData.data);
        if (requestsData.success) setRequests(requestsData.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [adminUser, refreshKey]);

  const handleLogout = () => {
    adminLogout();
    window.location.href = '/adminlogin';
  };

  // --- User stats ---
  const totalUsers       = users.length;
  const totalRequesters  = users.filter(u => u.role === 'requester').length;
  const totalSupporters  = users.filter(u => u.role === 'supporter').length;
  const verifiedUsers    = users.filter(u => u.isVerified).length;
  const unverifiedUsers  = totalUsers - verifiedUsers;
  const recentUsers      = users.slice(0, 5);

  // --- Request stats ---
  const totalRequests       = requests.length;
  const activeRequests      = requests.filter(r => r.status === 'active').length;
  const completedRequests   = requests.filter(r => r.status === 'completed').length;
  const verifiedRequests    = requests.filter(r => r.isVerified).length;
  const pendingVerification = requests.filter(r => !r.isVerified && r.status === 'active');
  const totalFundsRaised    = requests.reduce((sum, r) => sum + (r.currentAmount || 0), 0);
  const totalContributions  = requests.reduce((sum, r) => sum + (r.contributionsCount || 0), 0);

  const categoryBreakdown = requests.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const categoryColors = {
    'Micro-Funding':   { bar: 'bg-purple-500', text: 'text-purple-600' },
    'Lost Item':       { bar: 'bg-blue-500',   text: 'text-blue-600'   },
    'Community Help':  { bar: 'bg-teal-500',   text: 'text-teal-600'   },
  };

  const val = (v) => loading ? '—' : v;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logoCircle.png" alt="Hela Fund" className="w-9 h-9" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Hela Fund</h1>
              <p className="text-xs text-purple-600 font-semibold tracking-wide uppercase">Admin Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              {pendingVerification.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>

            <div className="flex items-center gap-3 bg-purple-50 rounded-xl px-4 py-2">
              <div className="bg-purple-600 p-1.5 rounded-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{adminUser?.name || 'Admin'}</p>
                <p className="text-gray-500 text-xs">{adminUser?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Welcome back, {adminUser?.name || 'Admin'} 👋
              </h2>
              <p className="text-purple-200">
                {loading
                  ? 'Loading platform overview...'
                  : pendingVerification.length > 0
                  ? `${pendingVerification.length} request${pendingVerification.length > 1 ? 's' : ''} awaiting your verification.`
                  : 'All caught up — no pending verifications.'}
              </p>
            </div>
            <div className="hidden md:block bg-white/10 p-5 rounded-2xl">
              <Shield className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Users"
            value={val(totalUsers)}
            color="bg-blue-500"
            sub={loading ? '' : `${totalRequesters} requesters · ${totalSupporters} supporters`}
          />
          <StatCard
            icon={FileText}
            label="Active Requests"
            value={val(activeRequests)}
            color="bg-teal-500"
            sub={loading ? '' : `${totalRequests} total requests`}
          />
          <StatCard
            icon={AlertCircle}
            label="Pending Verification"
            value={val(pendingVerification.length)}
            color={!loading && pendingVerification.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}
            sub="requests awaiting review"
          />
          <StatCard
            icon={Banknote}
            label="Funds Raised"
            value={loading ? '—' : `Rs. ${totalFundsRaised.toLocaleString()}`}
            color="bg-purple-500"
            sub={loading ? '' : `${totalContributions} contributions`}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MiniStatCard icon={UserCheck}      label="Verified Users"      value={val(verifiedUsers)}    textColor="text-emerald-600" bgColor="bg-emerald-50" />
          <MiniStatCard icon={UserX}          label="Unverified Users"    value={val(unverifiedUsers)}  textColor="text-amber-600"   bgColor="bg-amber-50"   />
          <MiniStatCard icon={CheckCircle}    label="Completed Requests"  value={val(completedRequests)} textColor="text-teal-600"   bgColor="bg-teal-50"    />
          <MiniStatCard icon={ClipboardCheck} label="Verified Requests"   value={val(verifiedRequests)} textColor="text-purple-600"  bgColor="bg-purple-50"  />
        </div>

        {/* Pending Verification + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Verification List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-800">Awaiting Verification</h3>
                {!loading && pendingVerification.length > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingVerification.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate('/admin/verify-requests')}
                className="flex items-center gap-1 text-purple-600 text-sm font-semibold hover:text-purple-700 hover:underline"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-10 text-gray-400">Loading...</div>
              ) : pendingVerification.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle size={36} className="mx-auto mb-2 text-emerald-400" />
                  <p className="text-gray-500 font-medium">All caught up!</p>
                  <p className="text-sm text-gray-400">No requests pending verification.</p>
                </div>
              ) : (
                pendingVerification.slice(0, 5).map((req) => (
                  <div
                    key={req._id}
                    onClick={() => navigate('/admin/verify-requests')}
                    className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{req.title}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-gray-500">{req.category}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-500">
                          {req.requester?.fullName || req.requester?.name || 'Unknown'}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`ml-3 flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold border ${urgencyStyle(req.urgency)}`}>
                      {req.urgency}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Quick Actions</h3>

            <button
              onClick={() => navigate('/admin/verify-requests')}
              className="flex items-center justify-between p-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <ClipboardCheck className="w-5 h-5 text-teal-600" />
                <span className="font-medium text-teal-700 text-sm">Verify Requests</span>
              </div>
              <div className="flex items-center gap-2">
                {!loading && pendingVerification.length > 0 && (
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingVerification.length}
                  </span>
                )}
                <ArrowRight size={16} className="text-teal-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-700 text-sm">Manage Users</span>
              </div>
              <div className="flex items-center gap-2">
                {!loading && unverifiedUsers > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unverifiedUsers}
                  </span>
                )}
                <ArrowRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                <span className="font-medium text-gray-600 text-sm">{loading ? 'Refreshing…' : 'Refresh Data'}</span>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Summary strip */}
            <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-800">{val(totalRequests)}</p>
                <p className="text-xs text-gray-400 font-medium">Total Requests</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{val(totalContributions)}</p>
                <p className="text-xs text-gray-400 font-medium">Contributions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users + Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recently Joined */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Recently Joined</h3>
              <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-1 text-purple-600 text-sm font-semibold hover:underline"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : recentUsers.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No users yet.</p>
              ) : (
                recentUsers.map((u) => (
                  <div key={u._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${u.role === 'requester' ? 'bg-blue-500' : 'bg-teal-500'}`}>
                        {(u.fullName || u.name || u.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                          {u.fullName || u.name || u.email}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{u.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`w-2 h-2 rounded-full ${u.isVerified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <h3 className="text-lg font-bold text-gray-800">Request Categories</h3>
              <BarChart3 size={18} className="text-gray-400" />
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : Object.keys(categoryBreakdown).length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No requests yet.</p>
            ) : (
              <div className="space-y-5">
                {Object.entries(categoryBreakdown).map(([cat, count]) => {
                  const pct = totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0;
                  const c = categoryColors[cat] || { bar: 'bg-gray-400', text: 'text-gray-600' };
                  return (
                    <div key={cat}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-sm font-semibold ${c.text}`}>{cat}</span>
                        <span className="text-sm text-gray-500">
                          <span className="font-bold text-gray-800">{count}</span> ({pct}%)
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-3">
                        <div
                          className={`${c.bar} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Total funding goal vs raised for Micro-Funding */}
                {categoryBreakdown['Micro-Funding'] > 0 && (() => {
                  const mfRequests = requests.filter(r => r.category === 'Micro-Funding');
                  const goal    = mfRequests.reduce((s, r) => s + (r.amount || 0), 0);
                  const raised  = mfRequests.reduce((s, r) => s + (r.currentAmount || 0), 0);
                  const fundPct = goal > 0 ? Math.round((raised / goal) * 100) : 0;
                  return (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-purple-600">Micro-Funding Progress</span>
                        <span className="text-xs text-gray-500">
                          <span className="font-bold text-gray-800">Rs. {raised.toLocaleString()}</span> / Rs. {goal.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full transition-all duration-500" style={{ width: `${fundPct}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{fundPct}% of total funding goal reached</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Hela Fund Admin Panel &mdash; Authorized personnel only
        </p>
      </main>
    </div>
  );
};

export default AdminDashboard;
