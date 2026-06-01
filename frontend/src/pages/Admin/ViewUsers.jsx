import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  CheckCircle,
  Ban,
  GraduationCap,
  Heart,
  Search,
  RefreshCw,
  Clock,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ViewUsers = () => {
  const { adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | verified | pending | banned
  const [actionLoading, setActionLoading] = useState(null); // userId being acted on

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
      setUsers(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (userId) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/verify`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers((prev) => prev.map((u) => (u._id === userId ? data.data : u)));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBan = async (userId) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers((prev) => prev.map((u) => (u._id === userId ? data.data : u)));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      search === '' ||
      (u.fullName || u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'verified') return u.isVerified;
    if (filter === 'pending') return !u.isVerified;
    return true;
  });

  const stats = {
    total: users.length,
    verified: users.filter((u) => u.isVerified).length,
    pending: users.filter((u) => !u.isVerified).length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">View Users</h1>
          <p className="text-gray-500 mt-1">Manage and verify registered users</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.verified}</p>
            <p className="text-sm text-gray-500">Verified</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
            <p className="text-sm text-gray-500">Pending Approval</p>
          </div>
        </div>
      </div>

      {/* Filters & search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'verified', 'pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Users className="w-12 h-12 mb-3 opacity-30" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-5 font-semibold text-gray-600">User</th>
                  <th className="text-left py-3 px-5 font-semibold text-gray-600">Role</th>
                  <th className="text-left py-3 px-5 font-semibold text-gray-600 hidden md:table-cell">NIC</th>
                  <th className="text-left py-3 px-5 font-semibold text-gray-600 hidden lg:table-cell">Joined</th>
                  <th className="text-left py-3 px-5 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-5 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {(user.fullName || user.name || user.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.fullName || user.name || '—'}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === 'requester'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-teal-100 text-teal-700'
                        }`}
                      >
                        {user.role === 'requester' ? (
                          <GraduationCap className="w-3.5 h-3.5" />
                        ) : (
                          <Heart className="w-3.5 h-3.5" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-5 hidden md:table-cell text-gray-500">{user.nic || '—'}</td>
                    <td className="py-4 px-5 hidden lg:table-cell text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-5">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {!user.isVerified ? (
                          <button
                            onClick={() => handleVerify(user._id)}
                            disabled={actionLoading === user._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {actionLoading === user._id ? 'Verifying...' : 'Verify'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBan(user._id)}
                            disabled={actionLoading === user._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            {actionLoading === user._id ? 'Banning...' : 'Ban'}
                          </button>
                        )}
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

export default ViewUsers;
