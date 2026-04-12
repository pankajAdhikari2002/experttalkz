import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// Define the shape of the context
interface User {
  name: string;
  email: string;
  password?: string;
  bio?: string;
  phone?: string;
  location?: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updatedData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('expertTalkz_active_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const getStoredUsers = (): User[] => {
    const users = localStorage.getItem('expertTalkz_db_users');
    return users ? JSON.parse(users) : [];
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);

    if (response && response.success) {
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('expertTalkz_auth_token', response.access_token);
      localStorage.setItem('expertTalkz_active_user', JSON.stringify(response.user));
      return { success: true, message: response.message || 'Logged in successfully' };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await api.signup(name, email, password);
    
    if (response && response.success) {
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('expertTalkz_auth_token', response.access_token);
      localStorage.setItem('expertTalkz_active_user', JSON.stringify(response.user));
      return { success: true, message: response.message || 'Account created successfully' };
    }

    return { success: false, message: 'Registration failed. User may already exist.' };
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    const users = getStoredUsers();
    const activeUser = user;

    if (!activeUser) return { success: false, message: 'Not authenticated' };

    // Update in DB
    const updatedUsers = users.map(u => {
      if (u.email === activeUser.email) {
        return { ...u, ...updatedData };
      }
      return u;
    });
    localStorage.setItem('expertTalkz_db_users', JSON.stringify(updatedUsers));

    // Update active session
    const updatedUser = { ...activeUser, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('expertTalkz_active_user', JSON.stringify(updatedUser));

    return { success: true, message: 'Profile updated successfully' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('expertTalkz_active_user');
    localStorage.removeItem('expertTalkz_auth_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
