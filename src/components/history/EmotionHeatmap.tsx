import React, { useState, useEffect } from 'react';
import { useLocalAuth } from '../../contexts/LocalAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';
import { JournalEntry, EmotionData } from '../../types';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

export const EmotionHeatmap: React.FC = () => {
  const { user } = useLocalAuth();
  const { language } = useTheme();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [selectedMonth]);

  const loadEntries = () => {
    setIsLoading(true);
    try {
      // Load entries from localStorage
      const allEntries = JSON.parse(localStorage.getItem('echoaid_entries') || '[]');
      
      // Filter entries for the selected month
      const startDate = startOfMonth(selectedMonth);
      const endDate = endOfMonth(selectedMonth);
      
      const filteredEntries = allEntries.filter((entry: JournalEntry) => {
        const entryDate = new Date(entry.createdAt);
        return entryDate >= startDate && entryDate <= endDate;
      });

      setEntries(filteredEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionData = (): EmotionData[] => {
    const days = eachDayOfInterval({
      start: startOfMonth(selectedMonth),
      end: endOfMonth(selectedMonth),
    });

    return days.map(day => {
      const dayEntries = entries.filter(entry => 
        isSameDay(new Date(entry.createdAt), day)
      );

      if (dayEntries.length === 0) {
        return {
          date: format(day, 'yyyy-MM-dd'),
          score: 0,
          label: 'no-data',
          color: 'bg-gray-100 dark:bg-gray-800',
        };
      }

      // Calculate average sentiment score for the day
      const avgScore = dayEntries.reduce((sum, entry) => 
        sum + entry.sentiment.score, 0
      ) / dayEntries.length;

      let label: string;
      let color: string;

      if (avgScore > 0.3) {
        label = 'positive';
        color = 'bg-success-500';
      } else if (avgScore < -0.3) {
        label = 'negative';
        color = 'bg-error-500';
      } else {
        label = 'neutral';
        color = 'bg-warning-500';
      }

      return {
        date: format(day, 'yyyy-MM-dd'),
        score: avgScore,
        label,
        color,
      };
    });
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-success-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-error-600" />;
      case 'neutral':
        return <Minus className="h-4 w-4 text-warning-600" />;
      default:
        return null;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'text-success-600 bg-success-50 dark:bg-success-900/20';
      case 'negative':
        return 'text-error-600 bg-error-50 dark:bg-error-900/20';
      case 'neutral':
        return 'text-warning-600 bg-warning-50 dark:bg-warning-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const emotionData = getEmotionData();

  const changeMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary-600" />
          {t('emotionHeatmap', language)}
        </h2>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => changeMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            ←
          </button>
          <span className="text-lg font-medium">
            {format(selectedMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => changeMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            →
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-4">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {emotionData.map((data, index) => {
            const date = new Date(data.date);
            const isCurrentDay = isToday(date);
            
            return (
              <div
                key={index}
                className={`
                  aspect-square rounded-lg border-2 transition-all duration-200
                  ${data.color}
                  ${isCurrentDay ? 'border-primary-500' : 'border-transparent'}
                  ${data.label === 'no-data' ? 'bg-gray-100 dark:bg-gray-800' : ''}
                  hover:scale-110 cursor-pointer
                `}
                title={`${format(date, 'MMM dd, yyyy')} - ${data.label}`}
              >
                <div className="h-full flex items-center justify-center text-xs font-medium">
                  {format(date, 'd')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-success-500 rounded"></div>
          <span>{t('positive', language)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-warning-500 rounded"></div>
          <span>{t('neutral', language)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-error-500 rounded"></div>
          <span>{t('negative', language)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded"></div>
          <span>{t('noData', language)}</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-success-600">
            {emotionData.filter(d => d.label === 'positive').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('positiveDays', language)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-warning-600">
            {emotionData.filter(d => d.label === 'neutral').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('neutralDays', language)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-error-600">
            {emotionData.filter(d => d.label === 'negative').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('negativeDays', language)}
          </div>
        </div>
      </div>
    </div>
  );
}; 