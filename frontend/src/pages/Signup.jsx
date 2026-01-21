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
  Phone,
  CreditCard,
  Upload,
  Building2,
  BookOpen,
  CheckCircle2,
  X
} from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [role, setRole] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
    
    // Requester fields
    fullName: '',
    university: '',
    faculty: '',
    studentId: '',
    studentIdImage: null,
    nic: '',
    mobile: '',
    
    // Supporter fields (name, email, nic, password)
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sri Lankan Universities list
  const universities = [
    'University of Colombo',
    'University of Peradeniya',
    'University of Sri Jayewardenepura',
    'University of Kelaniya',
    'University of Moratuwa',
    'University of Jaffna',
    'University of Ruhuna',
    'Eastern University',
    'South Eastern University',
    'Rajarata University',
    'Sabaragamuwa University',
    'Wayamba University',
    'Uva Wellassa University',
    'Other'
  ];

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      university: '',
      faculty: '',
      studentId: '',
      studentIdImage: null,
      nic: '',
      mobile: '',
      name: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, studentIdImage: 'Please upload an image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, studentIdImage: 'Image size should be less than 5MB' }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        studentIdImage: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      if (errors.studentIdImage) {
        setErrors(prev => ({ ...prev, studentIdImage: '' }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, studentIdImage: null }));
    setImagePreview(null);
  };

  const validateRequesterForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.university) {
      newErrors.university = 'Please select your university';
    }
    
    if (!formData.faculty.trim()) {
      newErrors.faculty = 'Faculty is required';
    }
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    
    if (!formData.studentIdImage) {
      newErrors.studentIdImage = 'Please upload your student ID image';
    }
    
    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC number is required';
    } else if (!/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/.test(formData.nic)) {
      newErrors.nic = 'Invalid NIC format';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^0[0-9]{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSupporterForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC number is required';
    } else if (!/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/.test(formData.nic)) {
      newErrors.nic = 'Invalid NIC format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = role === 'requester' 
      ? validateRequesterForm() 
      : validateSupporterForm();
    
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      await signup(formData, role);
      
      // Navigate to login with success message
      navigate('/login', { state: { message: 'Account created successfully! Please sign in.' } });
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 flex items-center">

      <div className="max-w-4xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 text-slate-800 hover:text-slate-900 mb-3">
            <img src="/images/logoCircle.png" alt="Hela Fund Logo" className="w-30 h-30" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Create Account</h2>
          <p className="text-gray-600">Join our community and make a difference</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          {!role ? (
            /* Role Selection */
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Choose Your Role</h3>
                <p className="text-gray-600">How would you like to participate?</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect('requester')}
                  className="group bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-blue-500 p-3 rounded-2xl">
                      <GraduationCap className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Requester</h3>
                  <p className="text-blue-100 mb-3 text-sm">I am a university student seeking financial support</p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified student accounts only</span>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('supporter')}
                  className="group bg-teal-600 hover:bg-teal-700 text-white rounded-2xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-teal-500 p-3 rounded-2xl">
                      <Heart className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Supporter</h3>
                  <p className="text-teal-100 mb-3 text-sm">I want to help students in need</p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Make a difference today</span>
                  </div>
                </button>
              </div>
              
              <div className="mt-6 text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Badge */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div className={`flex items-center gap-3 px-5 py-3 rounded-full ${
                  role === 'requester' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-teal-100 text-teal-700'
                }`}>
                  {role === 'requester' ? <GraduationCap className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
                  <span className="font-bold text-lg capitalize">{role} Registration</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRole('')}
                  className="text-sm text-gray-500 hover:text-gray-700 underline font-medium"
                >
                  Change Role
                </button>
              </div>

              {role === 'requester' ? (
                /* Requester Form */
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="Enter your Full Name"
                      />
                    </div>
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
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
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="your.email@university.edu"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {/* University */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      University <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${
                          errors.university ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white`}
                      >
                        <option value="">Select your university</option>
                        {universities.map(uni => (
                          <option key={uni} value={uni}>{uni}</option>
                        ))}
                      </select>
                    </div>
                    {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university}</p>}
                  </div>

                  {/* Faculty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Faculty <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="faculty"
                        value={formData.faculty}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${
                          errors.faculty ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="Engineering, Medicine, IT, etc."
                      />
                    </div>
                    {errors.faculty && <p className="mt-1 text-sm text-red-600">{errors.faculty}</p>}
                  </div>

                  {/* Student ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${
                          errors.studentId ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="Enter your Student ID Number"
                      />
                    </div>
                    {errors.studentId && <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>}
                  </div>

                  {/* Student ID Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Student ID Image <span className="text-red-500">*</span>
                    </label>
                    {!imagePreview ? (
                      <div className={`border-2 border-dashed ${
                        errors.studentIdImage ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer`}>
                        <input
                          type="file"
                          id="studentIdImage"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="studentIdImage" className="cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG or JPEG (max. 5MB)
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="relative border-2 border-gray-300 rounded-xl p-4">
                        <img
                          src={imagePreview}
                          alt="Student ID Preview"
                          className="w-full h-48 object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {errors.studentIdImage && <p className="mt-1 text-sm text-red-600">{errors.studentIdImage}</p>}
                  </div>

                  {/* NIC */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIC Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${
                          errors.nic ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="123456789V or 200012345678"
                      />
                    </div>
                    {errors.nic && <p className="mt-1 text-sm text-red-600">{errors.nic}</p>}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${
                          errors.mobile ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="0771234567"
                      />
                    </div>
                    {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                  </div>
                </>
              ) : (
                /* Supporter Form */
                <>
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                        placeholder="Enter your Full Name"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
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
                        } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {/* NIC */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIC Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border ${
                          errors.nic ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                        placeholder="123456789V or 200012345678"
                      />
                    </div>
                    {errors.nic && <p className="mt-1 text-sm text-red-600">{errors.nic}</p>}
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
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
                    } rounded-xl focus:ring-2 ${
                      role === 'requester' ? 'focus:ring-blue-500' : 'focus:ring-teal-500'
                    } focus:border-transparent transition-all`}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 ${
                      role === 'requester' ? 'focus:ring-blue-500' : 'focus:ring-teal-500'
                    } focus:border-transparent transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className={`w-5 h-5 mt-1 ${
                    role === 'requester' ? 'text-blue-600' : 'text-teal-600'
                  } border-gray-300 rounded focus:ring-2 ${
                    role === 'requester' ? 'focus:ring-blue-500' : 'focus:ring-teal-500'
                  }`}
                  required
                />
                <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Terms and Conditions
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Privacy Policy
                  </a>
                </label>
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>

              {/* Error Message */}
              {errors.submit && (
                <div className="text-center text-red-600 text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
