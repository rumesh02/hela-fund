import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token
      localStorage.setItem('token', data.data.token);

      // Create user object
      const userData = {
        id: data.data._id,
        email: data.data.email,
        role: data.data.role, // Actual user role in database
        loginRole: data.data.loginRole, // Role they're logging in as
        name: data.data.name,
        avatar: data.data.avatar,
        accountType: data.data.role === 'supporter' ? 'supporter' : 'student',
        token: data.data.token,
      };

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (formData, role) => {
    try {
      // Prepare data based on role
      let registrationData = {
        email: formData.email,
        password: formData.password,
        role: role,
        nic: formData.nic,
      };

      // Add role-specific fields
      if (role === 'requester') {
        registrationData = {
          ...registrationData,
          fullName: formData.fullName,
          university: formData.university,
          faculty: formData.faculty,
          studentId: formData.studentId,
          mobile: formData.mobile,
          // Note: studentIdImage will need to be handled separately with file upload
          studentIdImage: formData.studentIdImage ? 'uploaded' : '', // Placeholder for now
        };
      } else if (role === 'supporter') {
        registrationData = {
          ...registrationData,
          name: formData.name,
        };
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      // Don't auto-login after registration
      // User will need to login manually
      return data.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const switchRole = (newRole) => {
    // Only students (requesters) can switch between roles
    if (user && user.accountType === 'student') {
      setUser({ ...user, role: newRole });
    }
  };

  const canAccessRole = (roleToCheck) => {
    if (!user) return false;
    
    // Supporters can only access supporter role
    if (user.accountType === 'supporter') {
      return roleToCheck === 'supporter';
    }
    
    // Students (requesters) can access both roles
    if (user.accountType === 'student') {
      return true;
    }
    
    return false;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    switchRole,
    canAccessRole,
    isAuthenticated: !!user,
    isStudent: user?.accountType === 'student',
    isSupporter: user?.accountType === 'supporter'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
