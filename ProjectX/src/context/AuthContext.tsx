import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import {
  getAuthToken,
  getActiveUser,
  setAuthSession,
  clearAuthSession,
  isPersistentSession,
  isTokenExpired,
  getTokenRemainingMs,
  TOKEN_KEY,
  USER_KEY,
} from '../utils/authStorage';

// Define the shape of the user
export interface User {
  id?: number;
  name: string;
  email: string;
  role?: string;
  is_active?: boolean;
  password?: string;
  bio?: string;
  phone?: string;
  location?: string;
  avatar?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updatedData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const logoutTimerRef = useRef<any>(null);

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const scheduleAutoLogout = (token: string) => {
    clearLogoutTimer();
    const remainingMs = getTokenRemainingMs(token);
    if (remainingMs <= 0) {
      logout();
      return;
    }
    // Set timer to auto-logout when token expires
    logoutTimerRef.current = setTimeout(() => {
      console.info('Session expired automatically based on token expiration time.');
      logout();
    }, remainingMs);
  };

  const logout = () => {
    clearLogoutTimer();
    setUser(null);
    setIsAuthenticated(false);
    clearAuthSession();
  };

  // Check and verify stored session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const storedUser = getActiveUser<User>();

      if (!token) {
        clearAuthSession();
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Check client-side JWT expiration
      if (isTokenExpired(token)) {
        clearAuthSession();
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Pre-set user immediately for UI responsiveness
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      scheduleAutoLogout(token);

      // Verify token authenticity and active account status with server
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          setIsAuthenticated(true);
          setAuthSession(token, res.user, isPersistentSession());
        } else {
          // Token rejected by server or user deactivated
          logout();
        }
      } catch (e) {
        // If network is offline, keep cached session if token is still valid
        console.warn('Backend session verification offline, maintaining active session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Multi-tab logout / login sync via storage event
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY || e.key === USER_KEY) {
        const currentToken = getAuthToken();
        if (!currentToken || isTokenExpired(currentToken)) {
          setUser(null);
          setIsAuthenticated(false);
          clearLogoutTimer();
        } else {
          const updatedUser = getActiveUser<User>();
          if (updatedUser) {
            setUser(updatedUser);
            setIsAuthenticated(true);
            scheduleAutoLogout(currentToken);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearLogoutTimer();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getStoredUsers = (): User[] => {
    try {
      const users = localStorage.getItem('expertTalkz_db_users');
      return users ? JSON.parse(users) : [];
    } catch (e) {
      return [];
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const response = await api.login(email, password);

    if (response && response.success && response.access_token) {
      setUser(response.user);
      setIsAuthenticated(true);
      setAuthSession(response.access_token, response.user, rememberMe);
      scheduleAutoLogout(response.access_token);
      return { success: true, message: response.message || 'Logged in successfully' };
    }
    
    return { success: false, message: response?.message || 'Invalid email or password' };
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await api.signup(name, email, password);
    
    if (response && response.success && response.access_token) {
      setUser(response.user);
      setIsAuthenticated(true);
      setAuthSession(response.access_token, response.user, true);
      scheduleAutoLogout(response.access_token);
      return { success: true, message: response.message || 'Account created successfully' };
    }

    return { success: false, message: response?.message || 'Registration failed. User may already exist.' };
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    const users = getStoredUsers();
    const activeUser = user;

    if (!activeUser) return { success: false, message: 'Not authenticated' };

    // Update in local DB mock if present
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
    
    const token = getAuthToken();
    if (token) {
      setAuthSession(token, updatedUser, isPersistentSession());
    }

    return { success: true, message: 'Profile updated successfully' };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, signup, updateProfile, logout }}>
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

