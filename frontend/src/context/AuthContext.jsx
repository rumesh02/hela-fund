import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

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
    // TODO: Replace with actual API call
    // For now, simulating authentication
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user data
    const mockUser = {
      id: '1',
      email,
      role,
      // If user is a requester (student), they have both roles available
      accountType: role === 'requester' ? 'student' : 'supporter',
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    };

    setUser(mockUser);
    return mockUser;
  };

  const signup = async (formData, role) => {
    // TODO: Replace with actual API call
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user creation
    const mockUser = {
      id: '1',
      email: formData.email,
      role,
      accountType: role === 'requester' ? 'student' : 'supporter',
      name: role === 'requester' ? formData.fullName : formData.name,
      ...(role === 'requester' && {
        university: formData.university,
        faculty: formData.faculty,
        studentId: formData.studentId,
        nic: formData.nic,
        mobile: formData.mobile
      }),
      createdAt: new Date().toISOString()
    };

    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
