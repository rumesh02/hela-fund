import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  Settings
} from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await adminLogin(formData.email, formData.password);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      setErrors({ submit: 'Invalid admin credentials' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* Left Side - Branding */}
          <div className="hidden md:block text-white">
            <div className="bg-slate-800 rounded-3xl p-12 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-white p-2 rounded-xl">
                  <img src="/images/logoCircle.png" alt="Hela Fund Logo" className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold">Hela Fund</h1>
              </div>

              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Admin Control Panel
              </h2>

              <p className="text-lg text-gray-300 mb-8">
                Manage the Hela Fund platform, review users and requests, and keep the community running smoothly.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-700 p-2 rounded-lg mt-1">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Restricted Access</h3>
                    <p className="text-sm text-gray-300">Only authorized administrators can access this panel</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-slate-700 p-2 rounded-lg mt-1">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Full Platform Control</h3>
                    <p className="text-sm text-gray-300">Oversee users, requests, and platform activity</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-700">
                <p className="text-sm text-gray-300">
                  "Empowering administrators to maintain a safe, transparent, and supportive environment for every student."
                </p>
                <p className="text-sm font-semibold mt-2">- Hela Fund Admin Team</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-4 rounded-2xl">
                  <Shield className="w-10 h-10 text-purple-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Sign In</h2>
              <p className="text-gray-600">Enter your admin credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                    placeholder="admin@helafund.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? 'Signing In...' : 'Sign In to Admin Panel'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>

              {/* Error Message */}
              {errors.submit && (
                <div className="text-center text-red-600 text-sm bg-red-50 rounded-xl py-3 px-4">
                  {errors.submit}
                </div>
              )}

              <div className="text-center pt-2">
                <p className="text-sm text-gray-500">
                  Not an admin?{' '}
                  <a href="/login" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                    Go to user login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Logo */}
      <div className="md:hidden absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 text-slate-800">
          <img src="/images/logoCircle.png" alt="Hela Fund Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Hela Fund</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
