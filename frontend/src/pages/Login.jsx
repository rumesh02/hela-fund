import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  Heart, 
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
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
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password, role);
      
      // Navigate based on role
      if (role === 'requester') {
        navigate('/requester/dashboard');
      } else {
        navigate('/supporter/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Invalid email or password' });
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
                Welcome Back to Your Community
              </h2>
              
              <p className="text-lg text-gray-300 mb-8">
                Continue your journey of making a difference. Whether you're seeking support or offering help, your community is here.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-700 p-2 rounded-lg mt-1">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Secure & Private</h3>
                    <p className="text-sm text-gray-300">Your data is protected with industry-standard encryption</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-slate-700 p-2 rounded-lg mt-1">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instant Access</h3>
                    <p className="text-sm text-gray-300">Get started immediately after logging in</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-700">
                <p className="text-sm text-gray-300">
                  "Hela Fund has transformed how our university community supports each other. It's more than a platform—it's a movement."
                </p>
                <p className="text-sm font-semibold mt-2">- University Student Community</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
              <p className="text-gray-600">Choose your role and access your account</p>
            </div>

            {!role ? (
              <div className="space-y-4">
                <p className="text-center text-gray-700 font-medium mb-6">I am logging in as a:</p>
                
                <button
                  onClick={() => handleRoleSelect('requester')}
                  className="w-full group bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500 p-3 rounded-xl">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-xl">Requester</h3>
                        <p className="text-sm text-blue-100">University Student seeking support</p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('supporter')}
                  className="w-full group bg-teal-600 hover:bg-teal-700 text-white rounded-2xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-teal-500 p-3 rounded-xl">
                        <Heart className="w-8 h-8" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-xl">Supporter</h3>
                        <p className="text-sm text-teal-100">Ready to help those in need</p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Badge */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    role === 'requester' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-teal-100 text-teal-700'
                  }`}>
                    {role === 'requester' ? <GraduationCap className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                    <span className="font-semibold capitalize">{role}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRole('')}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Change
                  </button>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
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
                      } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                      placeholder="your.email@example.com"
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
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-3 border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    role === 'requester'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>

                {/* Error Message */}
                {errors.submit && (
                  <div className="text-center text-red-600 text-sm">
                    {errors.submit}
                  </div>
                )}

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            )}
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

export default Login;
