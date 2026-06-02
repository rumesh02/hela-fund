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
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user and admin from localStorage on mount
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

    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin));
      } catch (error) {
        console.error('Error parsing stored admin:', error);
        localStorage.removeItem('adminUser');
      }
    }

    setLoading(false);
  }, []);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Sync adminUser to localStorage
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('adminUser');
    }
  }, [adminUser]);

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
      const body = new FormData();
      body.append('email', formData.email);
      body.append('password', formData.password);
      body.append('role', role);
      body.append('nic', formData.nic);

      if (role === 'requester') {
        body.append('fullName', formData.fullName);
        body.append('university', formData.university);
        body.append('faculty', formData.faculty);
        body.append('studentId', formData.studentId);
        body.append('mobile', formData.mobile);
        if (formData.studentIdImage) {
          body.append('studentIdImage', formData.studentIdImage);
        }
      } else if (role === 'supporter') {
        body.append('name', formData.name);
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        body,
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

  const adminLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Admin login failed');
      }

      localStorage.setItem('adminToken', data.data.token);

      const adminData = {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        token: data.data.token,
        isAdmin: true,
      };

      setAdminUser(adminData);
      return adminData;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
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
    isSupporter: user?.accountType === 'supporter',
    adminUser,
    adminLogin,
    adminLogout,
    isAdmin: !!adminUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
