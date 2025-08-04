import React, { useState, useEffect } from 'react';
import { useLocalAuth } from '../contexts/LocalAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { t } from '../utils/translations';
import { JournalDashboard } from '../components/journal/JournalDashboard';
import { EmotionHeatmap } from '../components/history/EmotionHeatmap';
import { MentalHealthResources } from '../components/resources/MentalHealthResources';
import { Navigation } from '../components/layout/Navigation';
import { Button } from '../components/ui/Button';
import { Heart, Brain, Lightbulb, Quote, Calendar, Users } from 'lucide-react';
import { JournalEntry } from '../types';

export const HomePage: React.FC = () => {
  const { user, guestLogin } = useLocalAuth();
  const { language, theme } = useTheme();
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);

  // Auto-login as guest if no user
  useEffect(() => {
    if (!user) {
      guestLogin();
    }
  }, [user, guestLogin]);

  const loadRecentEntries = () => {
    // Load recent entries from localStorage
    const entries = JSON.parse(localStorage.getItem('echoaid_entries') || '[]');
    setRecentEntries(entries.slice(0, 3)); // Show last 3 entries
  };

  useEffect(() => {
    loadRecentEntries();
  }, []);

  // Show loading while auto-logging in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to EchoAid!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Your AI-powered emotional wellness companion
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/journal'}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Heart className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Journal</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Write about your day</p>
                </div>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/history'}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
                  <Calendar className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">History</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View your journey</p>
                </div>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/resources'}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-warning-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Resources</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get support</p>
                </div>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/settings'}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-lg">
                  <Users className="h-6 w-6 text-success-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customize your experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Entries */}
          {recentEntries.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Recent Entries
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentEntries.map((entry) => (
                  <div key={entry.id} className="card">
                    <div className="flex items-center space-x-3 mb-3">
                      <Quote className="h-5 w-5 text-primary-600" />
                      <span className="text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                      {entry.content.substring(0, 150)}...
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.sentiment.label === 'positive' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : entry.sentiment.label === 'negative'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      }`}>
                        {entry.sentiment.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wellness Tip */}
          <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <div className="flex items-start space-x-4">
              <Brain className="h-8 w-8 text-primary-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Today's Wellness Tip
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  "Take a moment to breathe deeply and appreciate the small joys in your day. 
                  Remember, it's okay to not be okay, and asking for help is a sign of strength."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 