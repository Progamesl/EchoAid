import React, { useState, useEffect } from 'react';
import { useLocalAuth } from '../../contexts/LocalAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';
import { AIAnalysis } from './AIAnalysis';
import { VoiceRecorder } from './VoiceRecorder';
import { Button } from '../ui/Button';
import { Navigation } from '../layout/Navigation';
import { JournalEntry, AIAnalysis as AIAnalysisType, SentimentLabel } from '../../types';
import { analyzeSentiment } from '../../utils/aiAnalysis';
import { 
  BookOpen, 
  Mic, 
  Save, 
  Trash2, 
  Edit3, 
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

export const JournalDashboard: React.FC = () => {
  const { user } = useLocalAuth();
  const { language } = useTheme();
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisType | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const savedEntries = JSON.parse(localStorage.getItem('echoaid_entries') || '[]');
    setEntries(savedEntries);
  };

  const saveEntry = async () => {
    if (!content.trim() || !user) return;

    setIsAnalyzing(true);
    try {
      const aiAnalysis = await analyzeSentiment(content);
      
      const entry: Omit<JournalEntry, 'id'> = {
        userId: user.uid,
        content: content.trim(),
        transcription: content.trim(), // Add transcription field
        sentiment: {
          ...aiAnalysis.sentiment,
          label: aiAnalysis.sentiment.label as SentimentLabel,
        },
        aiSummary: {
          summary: aiAnalysis.summary,
          quote: aiAnalysis.quote,
          mood: aiAnalysis.mood,
          suggestions: aiAnalysis.suggestions,
          keywords: aiAnalysis.keywords,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newEntry: JournalEntry = {
        ...entry,
        id: `entry_${Date.now()}`,
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      localStorage.setItem('echoaid_entries', JSON.stringify(updatedEntries));
      
      setContent('');
      setAnalysis(null);
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateEntry = async () => {
    if (!content.trim() || !editingEntry) return;

    setIsAnalyzing(true);
    try {
      const aiAnalysis = await analyzeSentiment(content);
      
      const updatedEntry: JournalEntry = {
        ...editingEntry,
        content: content.trim(),
        transcription: content.trim(), // Add transcription field
        sentiment: {
          ...aiAnalysis.sentiment,
          label: aiAnalysis.sentiment.label as SentimentLabel,
        },
        aiSummary: {
          summary: aiAnalysis.summary,
          quote: aiAnalysis.quote,
          mood: aiAnalysis.mood,
          suggestions: aiAnalysis.suggestions,
          keywords: aiAnalysis.keywords,
        },
        updatedAt: new Date(),
      };

      const updatedEntries = entries.map(entry => 
        entry.id === editingEntry.id ? updatedEntry : entry
      );
      
      setEntries(updatedEntries);
      localStorage.setItem('echoaid_entries', JSON.stringify(updatedEntries));
      
      setContent('');
      setEditingEntry(null);
      setAnalysis(null);
    } catch (error) {
      console.error('Error updating entry:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    setEntries(updatedEntries);
    localStorage.setItem('echoaid_entries', JSON.stringify(updatedEntries));
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setContent(entry.content);
    // Convert aiSummary to AIAnalysis format
    setAnalysis({
      sentiment: entry.sentiment,
      emotions: entry.sentiment.emotions,
      summary: entry.aiSummary.summary,
      quote: entry.aiSummary.quote,
      mood: entry.aiSummary.mood,
      suggestions: entry.aiSummary.suggestions,
      keywords: entry.aiSummary.keywords,
    });
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setContent('');
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeSentiment(content);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAudioReady = (audioBlob: Blob, transcription: string) => {
    setContent(transcription);
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-success-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-error-600" />;
      default:
        return <Minus className="h-4 w-4 text-warning-600" />;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'text-success-600 bg-success-50 dark:bg-success-900/20';
      case 'negative':
        return 'text-error-600 bg-error-50 dark:bg-error-900/20';
      default:
        return 'text-warning-600 bg-warning-50 dark:bg-warning-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('journal', language)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('journalDescription', language)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Journal Input */}
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingEntry ? t('editEntry', language) : t('newEntry', language)}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <VoiceRecorder
                      onAudioReady={handleAudioReady}
                      isProcessing={isAnalyzing}
                    />
                  </div>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t('journalPlaceholder', language)}
                  className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={isRecording}
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    {editingEntry && (
                      <Button
                        variant="outline"
                        onClick={cancelEditing}
                        disabled={isAnalyzing}
                      >
                        {t('cancel', language)}
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleAnalyze}
                      disabled={!content.trim() || isAnalyzing}
                    >
                      {isAnalyzing ? t('analyzing', language) : t('analyze', language)}
                    </Button>

                    <Button
                      onClick={editingEntry ? updateEntry : saveEntry}
                      disabled={!content.trim() || isAnalyzing}
                      className="flex items-center space-x-2"
                    >
                      {isAnalyzing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{editingEntry ? t('update', language) : t('save', language)}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              {analysis && (
                <AIAnalysis analysis={analysis} />
              )}
            </div>

            {/* Recent Entries */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('recentEntries', language)}
                </h2>

                {entries.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t('noEntriesYet', language)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('startJournaling', language)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1 rounded ${getSentimentColor(entry.sentiment.label)}`}>
                              {getSentimentIcon(entry.sentiment.label)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(entry)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteEntry(entry.id)}
                              className="text-error-600 hover:text-error-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                          {entry.content}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {entry.aiSummary.mood}
                          </span>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(entry.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 