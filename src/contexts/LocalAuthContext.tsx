import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

interface LocalAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  guestLogin: () => Promise<void>;
  updateUserSettings: (settings: Partial<User>) => Promise<void>;
}

const LocalAuthContext = createContext<LocalAuthContextType | undefined>(undefined);

export const useLocalAuth = () => {
  const context = useContext(LocalAuthContext);
  if (context === undefined) {
    throw new Error('useLocalAuth must be used within a LocalAuthProvider');
  }
  return context;
};

interface LocalAuthProviderProps {
  children: React.ReactNode;
}

export const LocalAuthProvider: React.FC<LocalAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('echoaid_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('echoaid_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('echoaid_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData: User = {
          uid: foundUser.uid,
          email: foundUser.email,
          displayName: foundUser.displayName,
          photoURL: null,
          isGuest: false,
          createdAt: new Date(foundUser.createdAt),
          language: foundUser.language || 'en',
          theme: foundUser.theme || 'light',
        };
        
        setUser(userData);
        localStorage.setItem('echoaid_user', JSON.stringify(userData));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('echoaid_users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser: User = {
        uid: `user_${Date.now()}`,
        email,
        displayName,
        photoURL: null,
        isGuest: false,
        createdAt: new Date(),
        language: 'en',
        theme: 'light',
      };

      // Save to localStorage
      users.push({
        ...newUser,
        password, // Store password for demo purposes
        createdAt: newUser.createdAt.toISOString(),
      });
      
      localStorage.setItem('echoaid_users', JSON.stringify(users));
      localStorage.setItem('echoaid_user', JSON.stringify(newUser));
      
      setUser(newUser);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('echoaid_user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const guestLogin = async () => {
    try {
      const guestUser: User = {
        uid: `guest_${Date.now()}`,
        email: null,
        displayName: 'Guest User',
        photoURL: null,
        isGuest: true,
        createdAt: new Date(),
        language: 'en',
        theme: 'light',
      };
      
      setUser(guestUser);
      localStorage.setItem('echoaid_user', JSON.stringify(guestUser));
    } catch (error) {
      console.error('Guest login error:', error);
      throw error;
    }
  };

  const updateUserSettings = async (settings: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...settings };
      setUser(updatedUser);
      localStorage.setItem('echoaid_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update user settings error:', error);
      throw error;
    }
  };

  const value: LocalAuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    guestLogin,
    updateUserSettings,
  };

  return (
    <LocalAuthContext.Provider value={value}>
      {children}
    </LocalAuthContext.Provider>
  );
}; 