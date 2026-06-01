import { useAuth } from '../../context/AuthContext';
import {
  Users,
  FileText,
  HeartHandshake,
  TrendingUp,
  Shield,
  LogOut,
  Bell
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { adminUser, adminLogout } = useAuth();

  const handleLogout = () => {
    adminLogout();
    window.location.href = '/adminlogin';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Welcome back, {adminUser?.name || 'Admin'} 👋
              </h2>
              <p className="text-purple-200">
                Here's an overview of the Hela Fund platform today.
              </p>
            </div>
            <div className="hidden md:block bg-white/10 p-5 rounded-2xl">
              <Shield className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value="—"
            color="bg-blue-500"
          />
          <StatCard
            icon={FileText}
            label="Active Requests"
            value="—"
            color="bg-teal-500"
          />
          <StatCard
            icon={HeartHandshake}
            label="Contributions"
            value="—"
            color="bg-emerald-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Funds Raised"
            value="—"
            color="bg-purple-500"
          />
        </div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { text: 'New user registered', time: 'Just now', color: 'bg-blue-100 text-blue-600' },
                { text: 'Request submitted for review', time: '5 min ago', color: 'bg-teal-100 text-teal-600' },
                { text: 'Contribution completed', time: '12 min ago', color: 'bg-emerald-100 text-emerald-600' },
                { text: 'New support request opened', time: '1 hr ago', color: 'bg-purple-100 text-purple-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${item.color.split(' ')[0]}`} />
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Manage Users', icon: Users, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
                { label: 'Review Requests', icon: FileText, color: 'bg-teal-50 text-teal-600 hover:bg-teal-100' },
                { label: 'View Contributions', icon: HeartHandshake, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
                { label: 'Platform Stats', icon: TrendingUp, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
              ].map((action, i) => (
                <button
                  key={i}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${action.color}`}
                >
                  <action.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Hela Fund Admin Panel &mdash; Authorized personnel only
        </p>
      </main>
    </div>
  );
};

export default AdminDashboard;
