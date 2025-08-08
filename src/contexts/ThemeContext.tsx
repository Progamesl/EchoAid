import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, Language } from '../types';
import { useLocalAuth } from './LocalAuthContext';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
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
  const [theme, setThemeState] = useState<Theme>('dark');
  const [language, setLanguageState] = useState<Language>('en');

  // Force dark mode on startup
  useEffect(() => {
    // Clear any existing theme from localStorage
    localStorage.removeItem('theme');

    // Always start in English
    localStorage.setItem('language', 'en');
    setLanguageState('en');
    
    // Force dark mode
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    
    console.log('Forcing dark mode on startup');
  }, []);

  useEffect(() => {
    // Load theme from localStorage or user preferences
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLanguage = localStorage.getItem('language') as Language;
    
    if (user) {
      setThemeState(user.theme);
      // Do NOT override language on init; app must start in English
    } else {
      // Only set from localStorage if no user and no current state
      if (savedTheme && !theme) {
        setThemeState(savedTheme);
      } else if (!theme) {
        // Default to dark mode if no saved theme
        setThemeState('dark');
      }
      
      if (savedLanguage && !language) {
        setLanguageState(savedLanguage);
      } else if (!language) {
        // Default to English if no saved language
        setLanguageState('en');
      }
    }
  }, [user]); // Only run when user changes, not on every render

  useEffect(() => {
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    console.log('Applying theme:', theme);
    
    if (theme === 'auto') {
      // Auto theme - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const appliedTheme = prefersDark ? 'dark' : 'dark'; // Always use dark for auto
      root.classList.add(appliedTheme);
      root.setAttribute('data-theme', appliedTheme);
      console.log('Auto theme applied:', appliedTheme);
    } else {
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
      console.log('Direct theme applied:', theme);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'auto' : 'dark';
    setThemeState(newTheme);
    
    if (user) {
      updateUserSettings({ theme: newTheme });
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    if (user) {
      updateUserSettings({ theme: newTheme });
    }
  };

  const toggleLanguage = () => {
    const languages: Language[] = ['en', 'es', 'fr'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    const newLanguage = languages[nextIndex];
    
    setLanguageState(newLanguage);
    
    if (user) {
      updateUserSettings({ language: newLanguage });
    }
  };

  const setLanguage = (newLanguage: Language) => {
    console.log('ThemeContext: Setting language from', language, 'to', newLanguage);
    console.log('ThemeContext: User exists?', !!user);
    
    // Immediately save to localStorage
    localStorage.setItem('language', newLanguage);
    
    setLanguageState(newLanguage);
    
    if (user) {
      console.log('ThemeContext: Updating user settings with language:', newLanguage);
      updateUserSettings({ language: newLanguage });
    }
    console.log('ThemeContext: Language state updated to:', newLanguage);
  };

  const value: ThemeContextType = {
    theme,
    language,
    toggleTheme,
    setTheme,
    toggleLanguage,
    setLanguage,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 