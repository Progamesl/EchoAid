import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, Language } from '../types';
import { useLocalAuth } from './LocalAuthContext';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user, updateUserSettings } = useLocalAuth();
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load theme from localStorage or user preferences
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLanguage = localStorage.getItem('language') as Language;
    
    if (user) {
      setTheme(user.theme);
      setLanguageState(user.language);
    } else if (savedTheme) {
      setTheme(savedTheme);
    } else if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, [user]);

  useEffect(() => {
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (user) {
      updateUserSettings({ theme: newTheme });
    }
  };

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'en' ? 'es' : 'en';
    setLanguageState(newLanguage);
    
    if (user) {
      updateUserSettings({ language: newLanguage });
    }
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    
    if (user) {
      updateUserSettings({ language: newLanguage });
    }
  };

  const value: ThemeContextType = {
    theme,
    language,
    toggleTheme,
    toggleLanguage,
    setLanguage,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 