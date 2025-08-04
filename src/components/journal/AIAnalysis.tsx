import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';
import { AIAnalysis as AIAnalysisType } from '../../types';
import { Brain, Heart, Lightbulb, Quote, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AIAnalysisProps {
  analysis: AIAnalysisType;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis }) => {
  const { language } = useTheme();

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-success-600" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-error-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'text-success-600 bg-success-50 dark:bg-success-900/20';
      case 'negative':
        return 'text-error-600 bg-error-50 dark:bg-error-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success-600';
    if (confidence >= 0.6) return 'text-warning-600';
    return 'text-error-600';
  };

  return (
    <div className="card space-y-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Brain className="h-5 w-5 mr-2 text-primary-600" />
        {t('aiAnalysis', language)}
      </h2>

      {/* Sentiment Overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <Heart className="h-4 w-4 mr-2 text-primary-600" />
          {t('moodSummary', language)}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${getSentimentColor(analysis.sentiment.label)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{t('sentiment', language)}</span>
              {getSentimentIcon(analysis.sentiment.label)}
            </div>
            <div className="text-2xl font-bold capitalize">
              {analysis.sentiment.label}
            </div>
            <div className="text-sm opacity-75">
              Score: {(analysis.sentiment.score * 100).toFixed(1)}%
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{t('confidence', language)}</span>
              <div className={`text-sm font-bold ${getConfidenceColor(analysis.sentiment.confidence)}`}>
                {(analysis.sentiment.confidence * 100).toFixed(0)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analysis.sentiment.confidence * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{t('mood', language)}</span>
              <Heart className="h-4 w-4 text-secondary-600" />
            </div>
            <div className="text-lg font-semibold text-secondary-700 dark:text-secondary-300">
              {analysis.mood}
            </div>
          </div>
        </div>
      </div>

      {/* Emotional Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <Brain className="h-4 w-4 mr-2 text-secondary-600" />
          {t('emotionalInsights', language)}
        </h3>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {analysis.emotions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('detectedEmotions', language)}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.emotions.map((emotion, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quote of the Day */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <Quote className="h-4 w-4 mr-2 text-warning-600" />
          {t('quoteOfTheDay', language)}
        </h3>
        
        <div className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border-l-4 border-warning-500">
          <p className="text-gray-700 dark:text-gray-300 italic">
            "{analysis.quote}"
          </p>
        </div>
      </div>

      {/* Suggested Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <Lightbulb className="h-4 w-4 mr-2 text-warning-600" />
          {t('suggestedActions', language)}
        </h3>
        
        <div className="space-y-3">
          {analysis.suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      {analysis.keywords.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <Brain className="h-4 w-4 mr-2 text-primary-600" />
            {t('keyInsights', language)}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 