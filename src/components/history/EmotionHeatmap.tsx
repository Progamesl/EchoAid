import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';
import { JournalEntry, EmotionData } from '../../types';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Award, 
  Star, 
  Heart, 
  Brain, 
  Sparkles, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Download, 
  Share2, 
  Filter, 
  Search, 
  Clock,
  Users,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface AnalyticsData {
  totalEntries: number;
  averageMood: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  topEmotions: string[];
  weeklyStreak: number;
  monthlyGoal: number;
  monthlyProgress: number;
  mostActiveDay: string;
  mostActiveTime: string;
  averageEntryLength: number;
  wellnessScore: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export const EmotionHeatmap: React.FC = () => {
  const { language } = useTheme();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedView, setSelectedView] = useState<'overview' | 'trends' | 'insights' | 'goals'>('overview');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('echoaid_entries') || '[]');
    setEntries(savedEntries);
    setIsLoading(false);
  }, []);

  // Calculate analytics data
  const calculateAnalytics = useMemo(() => {
    if (entries.length === 0) return null;

    const totalEntries = entries.length;
    const averageMood = entries.reduce((sum, entry) => sum + entry.sentiment.score, 0) / totalEntries;
    
    // Calculate mood trend
    const recentEntries = entries.slice(0, 7);
    const olderEntries = entries.slice(7, 14);
    const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.sentiment.score, 0) / recentEntries.length;
    const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.sentiment.score, 0) / olderEntries.length;
    
    let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentAvg > olderAvg + 0.1) moodTrend = 'improving';
    else if (recentAvg < olderAvg - 0.1) moodTrend = 'declining';

    // Get top emotions
    const allEmotions = entries.flatMap(entry => entry.sentiment.emotions);
    const emotionCounts = allEmotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topEmotions = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([emotion]) => emotion);

    // Calculate weekly streak
    const today = new Date();
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyEntries = entries.filter(entry => new Date(entry.createdAt) >= weekStart);
    const weeklyStreak = weeklyEntries.length;

    // Calculate most active day and time
    const dayCounts = entries.reduce((acc, entry) => {
      const day = new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostActiveDay = Object.entries(dayCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Monday';

    const timeCounts = entries.reduce((acc, entry) => {
      const hour = new Date(entry.createdAt).getHours();
      const timeSlot = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      acc[timeSlot] = (acc[timeSlot] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostActiveTime = Object.entries(timeCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Evening';

    // Calculate average entry length
    const averageEntryLength = entries.reduce((sum, entry) => sum + entry.content.length, 0) / totalEntries;

    // Calculate wellness score (0-10)
    const wellnessScore = Math.min(10, Math.max(0, (averageMood + 1) * 5 + (weeklyStreak * 0.5) + (totalEntries * 0.1)));

    return {
      totalEntries,
      averageMood,
      moodTrend,
      topEmotions,
      weeklyStreak,
      monthlyGoal: 20,
      monthlyProgress: Math.min(20, totalEntries),
      mostActiveDay,
      mostActiveTime,
      averageEntryLength,
      wellnessScore
    };
  }, [entries]);

  // Generate emotion heatmap data
  const generateEmotionData = useMemo(() => {
    const data: EmotionData[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayEntries = entries.filter(entry => 
        new Date(entry.createdAt).toDateString() === date.toDateString()
      );
      
      if (dayEntries.length > 0) {
        const avgScore = dayEntries.reduce((sum, entry) => sum + entry.sentiment.score, 0) / dayEntries.length;
        const label = avgScore > 0.3 ? 'positive' : avgScore < -0.3 ? 'negative' : 'neutral';
        const color = avgScore > 0.3 ? '#10B981' : avgScore < -0.3 ? '#EF4444' : '#6B7280';
        
        data.push({
          date: date.toISOString().split('T')[0],
          score: avgScore,
          label,
          color
        });
      } else {
        data.push({
          date: date.toISOString().split('T')[0],
          score: 0,
          label: 'neutral',
          color: '#374151'
        });
      }
    }
    
    return data;
  }, [entries]);

  // Generate chart data
  const generateChartData = useMemo((): ChartData => {
    const labels = ['Happy', 'Sad', 'Anxious', 'Calm', 'Excited', 'Stressed'];
    const data = [0.8, 0.2, 0.3, 0.6, 0.4, 0.1]; // Mock data
    const colors = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#6B7280'];
    
    return {
      labels,
      datasets: [{
        label: 'Emotion Frequency',
        data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 2
      }]
    };
  }, []);

  useEffect(() => {
    setAnalyticsData(calculateAnalytics);
    setEmotionData(generateEmotionData);
  }, [calculateAnalytics, generateEmotionData]);

  const getMoodTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-blue-400" />;
    }
  };

  const getMoodTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-400';
      case 'declining':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-300 text-sm font-medium">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Journey</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover patterns, track progress, and gain insights into your emotional wellness
          </p>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-4 mb-8"
        >
          {(['week', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              className={selectedPeriod === period 
                ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                : 'border-white/20 text-white hover:bg-white/10'
              }
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </motion.div>

        {/* View Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {([
            { id: 'overview', name: 'Overview', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
            { id: 'trends', name: 'Trends', icon: LineChart, color: 'from-green-500 to-teal-500' },
            { id: 'insights', name: 'Insights', icon: Brain, color: 'from-purple-500 to-pink-500' },
            { id: 'goals', name: 'Goals', icon: Target, color: 'from-orange-500 to-red-500' }
          ] as const).map((view) => (
            <motion.div
              key={view.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedView(view.id)}
              className={`cursor-pointer transition-all duration-300 ${
                selectedView === view.id ? 'ring-2 ring-purple-400' : ''
              }`}
            >
              <Card variant="glass" className="p-6 text-center border border-white/10 hover:border-purple-400/50">
                <div className={`w-12 h-12 bg-gradient-to-r ${view.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <view.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{view.name}</h3>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Analytics Overview */}
        {analyticsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <Card variant="glass" className="p-6 text-center border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{analyticsData.totalEntries}</h3>
              <p className="text-white/80">Total Entries</p>
            </Card>

            <Card variant="glass" className="p-6 text-center border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{analyticsData.weeklyStreak}</h3>
              <p className="text-white/80">Week Streak</p>
            </Card>

            <Card variant="glass" className="p-6 text-center border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{analyticsData.monthlyProgress}/{analyticsData.monthlyGoal}</h3>
              <p className="text-white/80">Monthly Goal</p>
            </Card>

            <Card variant="glass" className="p-6 text-center border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{analyticsData.wellnessScore.toFixed(1)}</h3>
              <p className="text-white/80">Wellness Score</p>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mood Trend Chart */}
            <Card variant="glass" className="p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                                 <div className="flex items-center space-x-3">
                   <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                     <TrendingUp className="w-6 h-6 text-white" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-bold text-white">Mood Trends</h3>
                     <p className="text-white/70">Your emotional journey over time</p>
                   </div>
                 </div>
                 {analyticsData && (
                   <div className="flex items-center space-x-2">
                     {getMoodTrendIcon(analyticsData.moodTrend)}
                     <span className={`font-medium ${getMoodTrendColor(analyticsData.moodTrend)}`}>
                       {analyticsData.moodTrend.charAt(0).toUpperCase() + analyticsData.moodTrend.slice(1)}
                     </span>
                   </div>
                 )}
               </div>
               
               {/* Mock Chart */}
               <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
                 <div className="text-center">
                   <LineChart className="w-16 h-16 text-white/40 mx-auto mb-4" />
                   <p className="text-white/60">Interactive mood trend chart</p>
                   <p className="text-white/40 text-sm">Shows your emotional patterns over time</p>
                 </div>
               </div>
             </Card>

             {/* Emotion Heatmap */}
             <Card variant="glass" className="p-8 border border-white/10">
               <div className="flex items-center space-x-3 mb-6">
                 <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                   <PieChart className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold text-white">Emotion Heatmap</h3>
                   <p className="text-white/70">Daily emotional patterns</p>
                 </div>
               </div>
              
              {/* Heatmap Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-white/60 text-sm py-2">
                    {day}
                  </div>
                ))}
                {emotionData.slice(0, 35).map((data, index) => (
                  <motion.div
                    key={data.date}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className="w-8 h-8 rounded-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: data.color }}
                    title={`${data.date}: ${data.label} (${data.score.toFixed(2)})`}
                  />
                ))}
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-sm text-white/60">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-sm"></div>
                  <span>No Entry</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                  <span>Negative</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                  <span>Positive</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card variant="glass" className="p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                {analyticsData && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Average Mood</span>
                      <span className="text-white font-medium">
                        {analyticsData.averageMood > 0 ? '+' : ''}{analyticsData.averageMood.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Most Active Day</span>
                      <span className="text-white font-medium">{analyticsData.mostActiveDay}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Most Active Time</span>
                      <span className="text-white font-medium">{analyticsData.mostActiveTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Avg Entry Length</span>
                      <span className="text-white font-medium">{Math.round(analyticsData.averageEntryLength)} chars</span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Top Emotions */}
            <Card variant="glass" className="p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Top Emotions</h3>
              <div className="space-y-3">
                {analyticsData?.topEmotions.map((emotion, index) => (
                  <div key={emotion} className="flex items-center justify-between">
                    <span className="text-white/70 capitalize">{emotion}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${(5 - index) * 20}%` }}
                        />
                      </div>
                      <span className="text-white font-medium text-sm">{5 - index}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Achievements */}
            <Card variant="glass" className="p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
              <div className="space-y-3">
                                 {[
                   { name: 'First Entry', achieved: entries.length > 0, icon: Star },
                   { name: 'Week Streak', achieved: (analyticsData?.weeklyStreak || 0) >= 7, icon: Award },
                   { name: 'Mood Tracker', achieved: entries.length >= 10, icon: Heart },
                   { name: 'Reflection Master', achieved: entries.length >= 20, icon: Brain }
                 ].map((achievement) => (
                  <div key={achievement.name} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.achieved ? 'bg-green-500/20' : 'bg-white/10'
                    }`}>
                      <achievement.icon className={`w-4 h-4 ${
                        achievement.achieved ? 'text-green-400' : 'text-white/40'
                      }`} />
                    </div>
                    <span className={`text-sm ${
                      achievement.achieved ? 'text-white' : 'text-white/60'
                    }`}>
                      {achievement.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <Card variant="glass" className="p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                                 <Button
                   variant="outline"
                   size="sm"
                   className="w-full border-white/20 text-white hover:bg-white/10"
                 >
                   <Download className="w-4 h-4 mr-2" />
                   Export Data
                 </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   className="w-full border-white/20 text-white hover:bg-white/10"
                 >
                   <Share2 className="w-4 h-4 mr-2" />
                   Share Progress
                 </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   className="w-full border-white/20 text-white hover:bg-white/10"
                 >
                   <Target className="w-4 h-4 mr-2" />
                   Set Goals
                 </Button>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* No Data State */}
        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
                         <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <Calendar className="w-12 h-12 text-white" />
             </div>
            <h3 className="text-2xl font-bold text-white mb-4">No History Yet</h3>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Start journaling to see your emotional journey and track your progress over time.
            </p>
            <Button
              onClick={() => window.location.href = '/journal'}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Start Journaling
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 