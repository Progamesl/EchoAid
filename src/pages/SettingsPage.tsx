import React, { useState } from 'react';
import { useLocalAuth } from '../contexts/LocalAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { t } from '../utils/translations';
import { Button } from '../components/ui/Button';
import { Navigation } from '../components/layout/Navigation';
import { 
  Settings, 
  User, 
  Bell, 
  Globe, 
  Sun, 
  Moon, 
  Shield, 
  Download,
  Trash2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useLocalAuth();
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();
  const [notifications, setNotifications] = useState({
    journalReminders: true,
    wellnessTips: true,
    moodCheckins: false,
  });

  const handleExportData = () => {
    // Export user data from localStorage
    const userData = {
      user: localStorage.getItem('echoaid_user'),
      entries: localStorage.getItem('echoaid_entries'),
      users: localStorage.getItem('echoaid_users'),
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'echoaid-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Clear all localStorage data
      localStorage.removeItem('echoaid_user');
      localStorage.removeItem('echoaid_entries');
      localStorage.removeItem('echoaid_users');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('settings', language)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your preferences and account settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Account Settings */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-6">
                <User className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('accountSettings', language)}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('displayName', language)}
                  </label>
                  <input
                    type="text"
                    value={user?.displayName || ''}
                    className="input-field"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('email', language)}
                  </label>
                  <input
                    type="email"
                    value={user?.email || 'Guest User'}
                    className="input-field"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('accountType', language)}
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.isGuest ? 'Guest Account' : 'Registered Account'}
                    </span>
                    {user?.isGuest && (
                      <span className="px-2 py-1 bg-warning-100 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300 rounded-full text-xs">
                        Limited Features
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-6">
                <Settings className="h-5 w-5 text-secondary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('appearance', language)}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('theme', language)}
                  </label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className="flex items-center space-x-2"
                    >
                      <Sun className="h-4 w-4" />
                      <span>{t('lightMode', language)}</span>
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => theme === 'light' && toggleTheme()}
                      className="flex items-center space-x-2"
                    >
                      <Moon className="h-4 w-4" />
                      <span>{t('darkMode', language)}</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('language', language)}
                  </label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant={language === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleLanguage()}
                      className="flex items-center space-x-2"
                    >
                      <Globe className="h-4 w-4" />
                      <span>{language === 'en' ? 'English' : 'Español'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-6">
                <Bell className="h-5 w-5 text-warning-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('notifications', language)}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('journalReminders', language)}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Daily reminders to journal your thoughts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.journalReminders}
                    onChange={(e) => setNotifications(prev => ({
                      ...prev,
                      journalReminders: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('wellnessTips', language)}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Weekly wellness tips and advice
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.wellnessTips}
                    onChange={(e) => setNotifications(prev => ({
                      ...prev,
                      wellnessTips: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('moodCheckins', language)}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Periodic mood check-in reminders
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.moodCheckins}
                    onChange={(e) => setNotifications(prev => ({
                      ...prev,
                      moodCheckins: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-5 w-5 text-success-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('dataManagement', language)}
                </h2>
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>{t('exportData', language)}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center justify-center space-x-2 text-error-600 hover:text-error-700"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{t('deleteAccount', language)}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 