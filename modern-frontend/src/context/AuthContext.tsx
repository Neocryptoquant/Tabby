import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  defaultLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Try to login with default superuser credentials
    const token = localStorage.getItem('token');
    if (!token) {
      defaultLogin();
    } else {
      setIsAuthenticated(true);
      // Fetch user data
      api.get('/api/user/').then((response) => {
        setUser(response.data);
      }).catch((error) => {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login/', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  };

  const defaultLogin = async () => {
    try {
      // Use superuser credentials
      await login('admin@example.com', 'admin123');
    } catch (error) {
      console.error('Default login failed:', error);
      // If default login fails, try regular test user
      try {
        await login('emnma007@gmail.com', 'admin');
      } catch (error) {
        console.error('Test user login failed:', error);
      }
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await api.post('/api/auth/register/', {
        email,
        password,
        name,
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, defaultLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
