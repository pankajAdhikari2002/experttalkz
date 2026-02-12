import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('expertTalkz_active_user', JSON.stringify(userWithoutPassword));
      return { success: true, message: 'Logged in successfully' };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = async (name: string, email: string, password: string) => {
    const users = getStoredUsers();
    
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'User with this email already exists' };
    }

    const newUser = { name, email, password };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('expertTalkz_db_users', JSON.stringify(updatedUsers));

    // Automatically log in after signup
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('expertTalkz_active_user', JSON.stringify(userWithoutPassword));

    return { success: true, message: 'Account created successfully' };
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
