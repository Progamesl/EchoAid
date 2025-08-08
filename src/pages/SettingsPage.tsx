import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Accessibility, 
  Shield, 
  Bell, 
  Database, 
  HelpCircle, 
  Heart,
  Moon,
  Monitor,
  AlertCircle,
  CheckCircle,
  Upload,
  MessageCircle,
  Mail,
  CreditCard,
  Trash2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalAuth } from '../contexts/LocalAuthContext';
import { t, getLanguageName, getLanguageFlag } from '../utils/translations';
import { Language } from '../types';

interface UserPreferences {
  theme?: 'dark' | 'auto';
  language: Language;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  contrast: 'normal' | 'high' | 'low';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
    colorIndicators: boolean;
    dyslexiaFriendly: boolean;
    increasedLineSpacing: boolean;
    wordSpacing: boolean;
    largerClickTargets: boolean;
    keyboardNavigation: boolean;
    voiceControl: boolean;
    simplifiedInterface: boolean;
    readingGuide: boolean;
    autoComplete: boolean;
    visualAlerts: boolean;
    captions: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    marketing: boolean;
    thirdParty: boolean;
  };
  display: {
    compactMode: boolean;
    showAnimations: boolean;
    autoSave: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  };
}

interface DonationTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  benefits: string[];
  icon: React.ComponentType<any>;
  color: string;
  popular?: boolean;
}

const donationTiers: DonationTier[] = [
  {
    id: 'supporter',
    name: 'Supporter',
    amount: 5,
    description: 'Help us keep EchoAid free for everyone',
    benefits: ['Early access to new features', 'Supporter badge', 'Priority support'],
    icon: Heart,
    color: 'text-pink-500'
  },
  {
    id: 'champion',
    name: 'Champion',
    amount: 15,
    description: 'Make a bigger impact on mental health',
    benefits: ['All Supporter benefits', 'Exclusive wellness content', 'Monthly newsletter', 'Community access'],
    icon: Heart, // Changed from Star to Heart as Star is removed
    color: 'text-yellow-500'
  },
  {
    id: 'guardian',
    name: 'Guardian',
    amount: 25,
    description: 'Help us reach more people in need',
    benefits: ['All Champion benefits', 'Personal wellness consultation', 'Custom challenge creation', 'VIP community access'],
    icon: Heart, // Changed from Crown to Heart as Crown is removed
    color: 'text-purple-500',
    popular: true
  },
  {
    id: 'legend',
    name: 'Legend',
    amount: 50,
    description: 'Transform mental health support globally',
    benefits: ['All Guardian benefits', '1-on-1 coaching sessions', 'Early beta access', 'Named in credits', 'Direct impact reports'],
    icon: Heart, // Changed from Gem to Heart as Gem is removed
    color: 'text-blue-500'
  }
];

export const SettingsPage: React.FC = () => {
  const { theme, language, setTheme, setLanguage } = useTheme();
  const { user, logout } = useLocalAuth();
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: language,
    fontSize: 'medium',
    contrast: 'normal',
    soundEnabled: true,
    notificationsEnabled: true,
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      screenReader: false,
      colorBlindMode: 'none',
      colorIndicators: false,
      dyslexiaFriendly: false,
      increasedLineSpacing: false,
      wordSpacing: false,
      largerClickTargets: false,
      keyboardNavigation: false,
      voiceControl: false,
      simplifiedInterface: false,
      readingGuide: false,
      autoComplete: false,
      visualAlerts: false,
      captions: false,
    },
    privacy: {
      dataCollection: true,
      analytics: true,
      marketing: false,
      thirdParty: false
    },
    display: {
      compactMode: false,
      showAnimations: true,
      autoSave: true,
      backupFrequency: 'weekly'
    }
  });

  const [activeSection, setActiveSection] = useState('general');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedDonationTier, setSelectedDonationTier] = useState<DonationTier | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('general');

  // Sync language state with context
  useEffect(() => {
    if (language !== preferences.language) {
      setPreferences(prev => ({
        ...prev,
        language: language
      }));
    }
  }, [language, preferences.language]);

  // Apply settings to DOM
  const applySettings = (newPreferences: UserPreferences) => {
    const root = document.documentElement;
    
    // Apply font size
    root.setAttribute('data-font-size', newPreferences.fontSize);
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px'
    };
    root.style.fontSize = fontSizeMap[newPreferences.fontSize];

    // Apply contrast
    root.setAttribute('data-contrast', newPreferences.contrast);
    console.log('Applying contrast:', newPreferences.contrast);
    
    if (newPreferences.contrast === 'high') {
      root.classList.add('high-contrast');
      root.classList.remove('low-contrast');
      console.log('High contrast applied');
    } else if (newPreferences.contrast === 'low') {
      root.classList.add('low-contrast');
      root.classList.remove('high-contrast');
      console.log('Low contrast applied');
    } else {
      root.classList.remove('high-contrast', 'low-contrast');
      console.log('Normal contrast applied');
    }

    // Apply accessibility settings
    if (newPreferences.accessibility.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    if (newPreferences.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (newPreferences.accessibility.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (newPreferences.accessibility.screenReader) {
      root.classList.add('screen-reader-friendly');
    } else {
      root.classList.remove('screen-reader-friendly');
    }

    // Apply colorblind mode
    if (newPreferences.accessibility.colorBlindMode !== 'none') {
      root.classList.add(`colorblind-${newPreferences.accessibility.colorBlindMode}`);
    } else {
      root.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia', 'colorblind-achromatopsia');
    }

    // Apply color indicators
    if (newPreferences.accessibility.colorIndicators) {
      root.classList.add('color-indicators');
    } else {
      root.classList.remove('color-indicators');
    }

    // Apply dyslexia-friendly font
    if (newPreferences.accessibility.dyslexiaFriendly) {
      root.classList.add('dyslexia-friendly');
    } else {
      root.classList.remove('dyslexia-friendly');
    }

    // Apply increased line spacing
    if (newPreferences.accessibility.increasedLineSpacing) {
      root.classList.add('increased-line-spacing');
    } else {
      root.classList.remove('increased-line-spacing');
    }

    // Apply word spacing
    if (newPreferences.accessibility.wordSpacing) {
      root.classList.add('word-spacing');
    } else {
      root.classList.remove('word-spacing');
    }

    // Apply larger click targets
    if (newPreferences.accessibility.largerClickTargets) {
      root.classList.add('larger-click-targets');
    } else {
      root.classList.remove('larger-click-targets');
    }

    // Apply keyboard navigation
    if (newPreferences.accessibility.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }

    // Apply voice control
    if (newPreferences.accessibility.voiceControl) {
      root.classList.add('voice-control');
    } else {
      root.classList.remove('voice-control');
    }

    // Apply simplified interface
    if (newPreferences.accessibility.simplifiedInterface) {
      root.classList.add('simplified-interface');
    } else {
      root.classList.remove('simplified-interface');
    }

    // Apply reading guide
    if (newPreferences.accessibility.readingGuide) {
      root.classList.add('reading-guide');
    } else {
      root.classList.remove('reading-guide');
    }

    // Apply auto-complete
    if (newPreferences.accessibility.autoComplete) {
      root.classList.add('auto-complete');
    } else {
      root.classList.remove('auto-complete');
    }

    // Apply visual alerts
    if (newPreferences.accessibility.visualAlerts) {
      root.classList.add('visual-alerts');
    } else {
      root.classList.remove('visual-alerts');
    }

    // Apply captions
    if (newPreferences.accessibility.captions) {
      root.classList.add('captions');
    } else {
      root.classList.remove('captions');
    }

    // Apply display settings
    if (newPreferences.display.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }

    if (!newPreferences.display.showAnimations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
  };

  useEffect(() => {
    const savedPrefs = localStorage.getItem('echoaid_preferences');
    if (savedPrefs) {
      const parsedPrefs = JSON.parse(savedPrefs);
      setPreferences(parsedPrefs);
      applySettings(parsedPrefs);
    } else {
      applySettings(preferences);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('echoaid_preferences', JSON.stringify(preferences));
    applySettings(preferences);
  }, [preferences]);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAccessibilityChange = (key: string, value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handleDisplayChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [key]: value
      }
    }));
  };

  const handleThemeChange = (newTheme: 'dark' | 'auto') => {
    console.log('Theme change requested:', newTheme);
    setTheme(newTheme); // Update the context
    console.log('Theme context updated to:', newTheme);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    console.log('=== LANGUAGE CHANGE DEBUG ===');
    console.log('Current language:', language);
    console.log('Current preferences language:', preferences.language);
    console.log('New language selected:', newLanguage);
    
    setPreferences(prev => {
      console.log('Updating preferences from', prev.language, 'to', newLanguage);
      return {
        ...prev,
        language: newLanguage
      };
    });
    
    setLanguage(newLanguage); // Also update the context
    console.log('Language change completed');
    console.log('=== END DEBUG ===');
  };

  const exportData = async () => {
    setIsExporting(true);
    try {
      const data = {
        user: user,
        preferences: preferences,
        challenges: localStorage.getItem('echoaid_challenges'),
        stats: localStorage.getItem('echoaid_stats'),
        journal: localStorage.getItem('echoaid_journal'),
        timestamp: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `echoaid-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.preferences) {
        setPreferences(data.preferences);
        applySettings(data.preferences);
      }
      if (data.challenges) {
        localStorage.setItem('echoaid_challenges', data.challenges);
      }
      if (data.stats) {
        localStorage.setItem('echoaid_stats', data.stats);
      }
      if (data.journal) {
        localStorage.setItem('echoaid_journal', data.journal);
      }
      
      alert('Data imported successfully!');
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
    } finally {
      setIsImporting(false);
    }
  };

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.clear();
      logout();
    }
  };

  const submitFeedback = () => {
    if (feedback.trim()) {
      // In a real app, this would send to a server
      console.log('Feedback submitted:', { type: feedbackType, message: feedback });
      setFeedback('');
      setShowFeedbackModal(false);
      alert('Thank you for your feedback!');
    }
  };

  const handleDonation = (tier: DonationTier) => {
    setSelectedDonationTier(tier);
    setShowDonationModal(true);
  };

  const processDonation = () => {
    if (selectedDonationTier) {
      // In a real app, this would integrate with a payment processor
      alert(`Thank you for your ${selectedDonationTier.name} donation of $${selectedDonationTier.amount}! This would process through a secure payment system.`);
      setShowDonationModal(false);
      setSelectedDonationTier(null);
    }
  };

  const sections = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'accessibility', name: 'Accessibility', icon: Accessibility },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'data', name: 'Data & Backup', icon: Database },
    { id: 'support', name: 'Support', icon: HelpCircle },
    { id: 'donate', name: 'Support Us', icon: Heart }
  ];

  return (
    <div className="min-h-screen pt-20" style={{ 
      background: 'var(--bg-primary, #0f172a)',
      color: 'var(--text-primary, #f1f5f9)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <Settings className="inline-block h-12 w-12 mr-4 text-purple-400" />
            Settings
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Customize your EchoAid experience and manage your preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-purple-500/20 text-white border border-purple-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{section.name}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glass" className="p-8">
                  {/* General Settings */}
                  {activeSection === 'general' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">General Settings</h2>
                      
                      {/* Language and Theme */}
                      <div className="glass p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                          <Settings className="h-5 w-5 mr-2" />
                          General
                        </h2>
                        
                        <div className="space-y-4">
                          {/* Language Selection */}
                          <div>
                            <label className="block text-sm font-medium mb-2">{t('language', language)}</label>
                            <select
                              value={preferences.language}
                              onChange={(e) => handleLanguageChange(e.target.value as Language)}
                              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                position: 'relative',
                                zIndex: 10
                              }}
                            >
                              <option value="en">{getLanguageFlag('en')} English</option>
                              <option value="es">{getLanguageFlag('es')} Español</option>
                              <option value="fr">{getLanguageFlag('fr')} Français</option>
                            </select>
                          </div>

                          {/* Theme Selection */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Theme</label>
                            <select
                              value={theme}
                              onChange={(e) => handleThemeChange(e.target.value as 'dark' | 'auto')}
                              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                position: 'relative',
                                zIndex: 10
                              }}
                            >
                              <option value="dark">Dark (Recommended)</option>
                              <option value="auto">Auto</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Sound Effects */}
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Sound Effects</h3>
                          <p className="text-white/60 text-sm">Enable audio feedback</p>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('soundEnabled', !preferences.soundEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.soundEnabled ? 'bg-purple-500' : 'bg-white/20'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeSection === 'appearance' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Appearance</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white font-medium mb-2">Display Mode</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'dark', name: 'Dark', icon: Moon, recommended: true },
                              { id: 'auto', name: 'Auto', icon: Monitor }
                            ].map((mode) => {
                              const Icon = mode.icon;
                              return (
                                <button
                                  key={mode.id}
                                  onClick={() => handleThemeChange(mode.id as any)}
                                  className={`p-4 rounded-lg border transition-all duration-200 ${
                                    theme === mode.id
                                      ? 'border-purple-500 bg-purple-500/20 text-white'
                                      : 'border-white/20 bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                  }`}
                                >
                                  <Icon className="h-6 w-6 mx-auto mb-2" />
                                  <span className="text-sm">{mode.name}</span>
                                  {mode.recommended && <span className="text-xs text-green-400 block">Recommended</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">Layout</label>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <span className="text-white text-sm">Compact Mode</span>
                              <button
                                onClick={() => handleDisplayChange('compactMode', !preferences.display.compactMode)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                  preferences.display.compactMode ? 'bg-purple-500' : 'bg-white/20'
                                }`}
                              >
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  preferences.display.compactMode ? 'translate-x-5' : 'translate-x-1'
                                }`} />
                              </button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <span className="text-white text-sm">Show Animations</span>
                              <button
                                onClick={() => handleDisplayChange('showAnimations', !preferences.display.showAnimations)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                  preferences.display.showAnimations ? 'bg-purple-500' : 'bg-white/20'
                                }`}
                              >
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  preferences.display.showAnimations ? 'translate-x-5' : 'translate-x-1'
                                }`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Accessibility Settings */}
                  {activeSection === 'accessibility' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Accessibility</h2>
                      
                      <div className="space-y-4">
                        {[
                          { key: 'reducedMotion', label: 'Reduce Motion', description: 'Minimize animations and transitions for users with motion sensitivity' },
                          { key: 'highContrast', label: 'High Contrast', description: 'Increase color contrast for better visibility' },
                          { key: 'largeText', label: 'Large Text', description: 'Use larger text throughout the app' },
                          { key: 'screenReader', label: 'Screen Reader Support', description: 'Optimize for screen readers' }
                        ].map((option) => (
                          <div key={option.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h3 className="text-white font-medium">{option.label}</h3>
                              <p className="text-white/60 text-sm">{option.description}</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange(option.key, !preferences.accessibility[option.key as keyof typeof preferences.accessibility])}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility[option.key as keyof typeof preferences.accessibility] ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility[option.key as keyof typeof preferences.accessibility] ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Colorblind Support */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Colorblind Support</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-white font-medium mb-2">Color Vision Type</label>
                            <select
                              value={preferences.accessibility.colorBlindMode || 'none'}
                              onChange={(e) => handleAccessibilityChange('colorBlindMode', e.target.value)}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 relative z-10"
                              style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                position: 'relative',
                                zIndex: 10
                              }}
                            >
                              <option value="none" style={{ backgroundColor: '#1e293b', color: 'white' }}>No Colorblindness</option>
                              <option value="protanopia" style={{ backgroundColor: '#1e293b', color: 'white' }}>Protanopia (Red-Blind)</option>
                              <option value="deuteranopia" style={{ backgroundColor: '#1e293b', color: 'white' }}>Deuteranopia (Green-Blind)</option>
                              <option value="tritanopia" style={{ backgroundColor: '#1e293b', color: 'white' }}>Tritanopia (Blue-Blind)</option>
                              <option value="achromatopsia" style={{ backgroundColor: '#1e293b', color: 'white' }}>Achromatopsia (Complete Colorblindness)</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Color Indicators</h4>
                              <p className="text-white/60 text-sm">Add text labels to color-coded elements</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('colorIndicators', !preferences.accessibility.colorIndicators)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.colorIndicators ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.colorIndicators ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Dyslexia Support */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Dyslexia Support</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Dyslexia-Friendly Font</h4>
                              <p className="text-white/60 text-sm">Use fonts optimized for dyslexia (OpenDyslexic)</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('dyslexiaFriendly', !preferences.accessibility.dyslexiaFriendly)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.dyslexiaFriendly ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.dyslexiaFriendly ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Increased Line Spacing</h4>
                              <p className="text-white/60 text-sm">Add extra space between lines for easier reading</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('increasedLineSpacing', !preferences.accessibility.increasedLineSpacing)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.increasedLineSpacing ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.increasedLineSpacing ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Word Spacing</h4>
                              <p className="text-white/60 text-sm">Increase space between words for clarity</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('wordSpacing', !preferences.accessibility.wordSpacing)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.wordSpacing ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.wordSpacing ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Motor Impairment Support */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Motor Impairment Support</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Larger Click Targets</h4>
                              <p className="text-white/60 text-sm">Increase button and link sizes for easier clicking</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('largerClickTargets', !preferences.accessibility.largerClickTargets)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.largerClickTargets ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.largerClickTargets ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Keyboard Navigation</h4>
                              <p className="text-white/60 text-sm">Enable full keyboard navigation support</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('keyboardNavigation', !preferences.accessibility.keyboardNavigation)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.keyboardNavigation ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Voice Control</h4>
                              <p className="text-white/60 text-sm">Enable voice command support</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('voiceControl', !preferences.accessibility.voiceControl)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.voiceControl ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.voiceControl ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Cognitive Support */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Cognitive Support</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Simplified Interface</h4>
                              <p className="text-white/60 text-sm">Reduce visual complexity and distractions</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('simplifiedInterface', !preferences.accessibility.simplifiedInterface)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.simplifiedInterface ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.simplifiedInterface ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Reading Guide</h4>
                              <p className="text-white/60 text-sm">Highlight current line while reading</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('readingGuide', !preferences.accessibility.readingGuide)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.readingGuide ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.readingGuide ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Auto-Complete</h4>
                              <p className="text-white/60 text-sm">Provide suggestions and auto-complete for forms</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('autoComplete', !preferences.accessibility.autoComplete)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.autoComplete ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.autoComplete ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Hearing Support */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Hearing Support</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Visual Alerts</h4>
                              <p className="text-white/60 text-sm">Show visual notifications instead of audio</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('visualAlerts', !preferences.accessibility.visualAlerts)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.visualAlerts ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.visualAlerts ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h4 className="text-white font-medium">Captions</h4>
                              <p className="text-white/60 text-sm">Enable captions for any audio content</p>
                            </div>
                            <button
                              onClick={() => handleAccessibilityChange('captions', !preferences.accessibility.captions)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.accessibility.captions ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.accessibility.captions ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Privacy & Security Settings */}
                  {activeSection === 'privacy' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>
                      
                      <div className="space-y-4">
                        {[
                          { key: 'dataCollection', label: 'Data Collection', description: 'Allow us to collect usage data to improve the app' },
                          { key: 'analytics', label: 'Analytics', description: 'Share anonymous usage statistics' },
                          { key: 'marketing', label: 'Marketing Communications', description: 'Receive updates about new features' },
                          { key: 'thirdParty', label: 'Third-Party Services', description: 'Allow third-party integrations' }
                        ].map((option) => (
                          <div key={option.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <h3 className="text-white font-medium">{option.label}</h3>
                              <p className="text-white/60 text-sm">{option.description}</p>
                            </div>
                            <button
                              onClick={() => handlePrivacyChange(option.key, !preferences.privacy[option.key as keyof typeof preferences.privacy])}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.privacy[option.key as keyof typeof preferences.privacy] ? 'bg-purple-500' : 'bg-white/20'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.privacy[option.key as keyof typeof preferences.privacy] ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-white/20">
                        <Button
                          onClick={() => setShowDeleteModal(true)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          {/* Trash2 is removed, using AlertCircle as a placeholder */}
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Notifications Settings */}
                  {activeSection === 'notifications' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium">Push Notifications</h3>
                            <p className="text-white/60 text-sm">Receive notifications about your wellness journey</p>
                          </div>
                          <button
                            onClick={() => handlePreferenceChange('notificationsEnabled', !preferences.notificationsEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              preferences.notificationsEnabled ? 'bg-purple-500' : 'bg-white/20'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              preferences.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Daily Reminders</h4>
                            <p className="text-white/60 text-sm mb-3">Get reminded to complete your daily tasks</p>
                            <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                              Configure
                            </Button>
                          </div>

                          <div className="p-4 bg-white/5 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Weekly Reports</h4>
                            <p className="text-white/60 text-sm mb-3">Receive weekly progress summaries</p>
                            <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                              Configure
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Data & Backup Settings */}
                  {activeSection === 'data' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Data & Backup</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-white font-medium mb-2">Export Data</h3>
                            <p className="text-white/60 text-sm mb-3">Download all your data as a JSON file</p>
                            <Button
                              onClick={exportData}
                              disabled={isExporting}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              {/* Download is removed, using CheckCircle as a placeholder */}
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {isExporting ? 'Exporting...' : 'Export Data'}
                            </Button>
                          </div>

                          <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-white font-medium mb-2">Import Data</h3>
                            <p className="text-white/60 text-sm mb-3">Restore your data from a backup file</p>
                            <input
                              type="file"
                              accept=".json"
                              onChange={importData}
                              className="hidden"
                              id="import-file"
                            />
                            <label htmlFor="import-file">
                              <Button
                                disabled={isImporting}
                                className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                              >
                                {/* Upload is removed, using Upload as a placeholder */}
                                <Upload className="h-4 w-4 mr-2" />
                                {isImporting ? 'Importing...' : 'Import Data'}
                              </Button>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-white font-medium mb-2">Auto Backup</h3>
                            <p className="text-white/60 text-sm mb-3">Automatically backup your data</p>
                            <select
                              value={preferences.display.backupFrequency}
                              onChange={(e) => handleDisplayChange('backupFrequency', e.target.value)}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 relative z-10"
                              style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                position: 'relative',
                                zIndex: 10
                              }}
                            >
                              <option value="daily" style={{ backgroundColor: '#1e293b', color: 'white' }}>Daily</option>
                              <option value="weekly" style={{ backgroundColor: '#1e293b', color: 'white' }}>Weekly</option>
                              <option value="monthly" style={{ backgroundColor: '#1e293b', color: 'white' }}>Monthly</option>
                              <option value="never" style={{ backgroundColor: '#1e293b', color: 'white' }}>Never</option>
                            </select>
                          </div>

                          <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-white font-medium mb-2">Storage Usage</h3>
                            <p className="text-white/60 text-sm mb-2">Local storage used</p>
                            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }} />
                            </div>
                            <p className="text-white/60 text-xs">2.1 MB of 6 MB used</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Support Settings */}
                  {activeSection === 'support' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Support</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Button
                            onClick={() => setShowFeedbackModal(true)}
                            className="w-full bg-purple-500 hover:bg-purple-600"
                          >
                            {/* MessageCircle is removed, using MessageCircle as a placeholder */}
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send Feedback
                          </Button>

                          <Button
                            onClick={() => setShowHelpModal(true)}
                            className="w-full bg-blue-500 hover:bg-blue-600"
                          >
                            {/* HelpCircle is removed, using HelpCircle as a placeholder */}
                            <HelpCircle className="h-4 w-4 mr-2" />
                            Help & FAQ
                          </Button>

                          <Button
                            onClick={() => window.open('mailto:support@echoaid.com', '_blank')}
                            className="w-full bg-green-500 hover:bg-green-600"
                          >
                            {/* Mail is removed, using Mail as a placeholder */}
                            <Mail className="h-4 w-4 mr-2" />
                            Contact Support
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-white font-medium mb-2">About EchoAid</h3>
                            <p className="text-white/60 text-sm mb-3">Version 1.0.0</p>
                            <p className="text-white/60 text-sm">Built with ❤️ for mental health</p>
                          </div>

                          <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-white font-medium mb-2">Legal</h3>
                            <div className="space-y-2">
                              <button className="block text-white/60 hover:text-white text-sm">Privacy Policy</button>
                              <button className="block text-white/60 hover:text-white text-sm">Terms of Service</button>
                              <button className="block text-white/60 hover:text-white text-sm">Cookie Policy</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Donation Settings */}
                  {activeSection === 'donate' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Support EchoAid</h2>
                      
                      <div className="text-center mb-8">
                        <Heart className="h-16 w-16 text-pink-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Help Us Make a Difference</h3>
                        <p className="text-white/80 max-w-2xl mx-auto">
                          Your support helps us keep EchoAid free for everyone and develop new features to improve mental health support worldwide.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {donationTiers.map((tier) => {
                          const Icon = tier.icon;
                          return (
                            <motion.div
                              key={tier.id}
                              whileHover={{ scale: 1.02 }}
                              className={`p-6 rounded-lg border transition-all duration-200 cursor-pointer ${
                                tier.popular
                                  ? 'border-purple-500 bg-purple-500/10'
                                  : 'border-white/20 bg-white/5 hover:border-purple-500/30'
                              }`}
                              onClick={() => handleDonation(tier)}
                            >
                              {tier.popular && (
                                <div className="text-center mb-4">
                                  <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                                    Most Popular
                                  </span>
                                </div>
                              )}
                              
                              <div className="text-center mb-4">
                                <Icon className={`h-8 w-8 mx-auto mb-2 ${tier.color}`} />
                                <h4 className="text-lg font-semibold text-white">{tier.name}</h4>
                                <div className="text-2xl font-bold text-white">${tier.amount}</div>
                              </div>

                              <p className="text-white/70 text-sm text-center mb-4">{tier.description}</p>

                              <ul className="space-y-2 mb-6">
                                {tier.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-center space-x-2 text-white/80 text-sm">
                                    {/* CheckCircle is removed, using CheckCircle as a placeholder */}
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>

                              <Button
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                              >
                                <Heart className="h-4 w-4 mr-2" />
                                Support ${tier.amount}
                              </Button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <AnimatePresence>
        {showDonationModal && selectedDonationTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDonationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <Heart className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                <p className="text-white/80">
                  Your ${selectedDonationTier.amount} {selectedDonationTier.name} donation will help us continue providing free mental health support to everyone.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={processDonation}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {/* CreditCard is removed, using CreditCard as a placeholder */}
                  <CreditCard className="h-4 w-4 mr-2" />
                  Process Donation
                </Button>
                
                <Button
                  onClick={() => setShowDonationModal(false)}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Send Feedback</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Feedback Type</label>
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 relative z-10"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      position: 'relative',
                      zIndex: 10
                    }}
                  >
                    <option value="general" style={{ backgroundColor: '#1e293b', color: 'white' }}>General Feedback</option>
                    <option value="bug" style={{ backgroundColor: '#1e293b', color: 'white' }}>Bug Report</option>
                    <option value="feature" style={{ backgroundColor: '#1e293b', color: 'white' }}>Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Message</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tell us what you think..."
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={submitFeedback}
                    className="flex-1 bg-purple-500 hover:bg-purple-600"
                  >
                    Send Feedback
                  </Button>
                  <Button
                    onClick={() => setShowFeedbackModal(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                {/* AlertCircle is removed, using AlertCircle as a placeholder */}
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Delete Account</h3>
                <p className="text-white/80">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={deleteAccount}
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  {/* Trash2 is removed, using Trash2 as a placeholder */}
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
                
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 