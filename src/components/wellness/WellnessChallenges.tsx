import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Target, Trophy, Calendar, CheckCircle, Circle, Star, Heart, Brain, Zap, Moon, Users, Sparkles,
  Play, ArrowRight, Flame, Crown, X, Gift, Medal, Gem, Diamond, Award, TrendingUp, Clock,
  Bell, Share2, Download, Filter, Search, Plus, Minus, RotateCcw, Pause, Volume2, VolumeX,
  Lightbulb, Quote, Globe, Shield, Activity, BarChart3, PieChart, LineChart, Camera,
  MessageCircle, Video, MapPin, GraduationCap, Briefcase, Home, Monitor, Headphones
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'mindfulness' | 'gratitude' | 'exercise' | 'sleep' | 'social' | 'creativity';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tasks: ChallengeTask[];
  rewards: Reward[];
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  xpReward: number;
  participants: number;
  rating: number;
  tags: string[];
}

interface ChallengeTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  day: number;
  xpValue: number;
  timeEstimate: number; // minutes
  tips: string[];
  mediaUrl?: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpBonus: number;
}

interface UserProgress {
  challengeId: string;
  currentDay: number;
  completedTasks: string[];
  startDate: string;
  streak: number;
  totalCompleted: number;
  totalXP: number;
  lastCompletedDate?: string;
  achievements: string[];
  notes: { [taskId: string]: string };
  moodRatings: { [taskId: string]: number };
  timeSpent: { [taskId: string]: number };
}

interface UserStats {
  totalXP: number;
  level: number;
  challengesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number;
  achievements: string[];
  badges: string[];
}

const challenges: Challenge[] = [
  {
    id: 'gratitude-30',
    title: '30 Days of Gratitude',
    description: 'Transform your mindset through daily gratitude practices. Research shows gratitude improves mental health, relationships, and overall happiness.',
    category: 'gratitude',
    duration: 30,
    difficulty: 'beginner',
    icon: Heart,
    color: 'text-pink-500',
    gradient: 'from-pink-500 to-rose-500',
    xpReward: 3000,
    participants: 1247,
    rating: 4.8,
    tags: ['mindfulness', 'happiness', 'relationships', 'mental-health'],
    tasks: [
      { 
        id: 'g1', 
        title: 'Write 3 things you\'re grateful for', 
        description: 'Reflect on your day and write down three things that made you thankful. Be specific and detailed.', 
        completed: false, 
        day: 1, 
        xpValue: 100,
        timeEstimate: 5,
        tips: ['Think about small moments of joy', 'Include people, places, and experiences', 'Write in detail about why you\'re grateful']
      },
      { 
        id: 'g2', 
        title: 'Thank someone in your life', 
        description: 'Express gratitude to a friend, family member, or colleague. Tell them specifically what you appreciate about them.', 
        completed: false, 
        day: 2, 
        xpValue: 120,
        timeEstimate: 10,
        tips: ['Be specific about what you appreciate', 'Choose someone you haven\'t thanked recently', 'Consider writing a note or sending a message']
      },
      { 
        id: 'g3', 
        title: 'Appreciate a simple pleasure', 
        description: 'Take time to enjoy a small moment of joy. Notice the beauty in everyday experiences.', 
        completed: false, 
        day: 3, 
        xpValue: 80,
        timeEstimate: 3,
        tips: ['Focus on your senses', 'Slow down and be present', 'Notice things you usually take for granted']
      }
    ],
    rewards: [
      { id: 'r1', title: 'Gratitude Master', description: 'Complete 7 days of gratitude practice', icon: Star, unlocked: false, rarity: 'common', xpBonus: 50 },
      { id: 'r2', title: 'Thankful Heart', description: 'Complete 14 days of gratitude practice', icon: Heart, unlocked: false, rarity: 'rare', xpBonus: 100 },
      { id: 'r3', title: 'Gratitude Champion', description: 'Complete 21 days of gratitude practice', icon: Trophy, unlocked: false, rarity: 'epic', xpBonus: 200 },
      { id: 'r4', title: 'Gratitude Legend', description: 'Complete all 30 days of gratitude practice', icon: Crown, unlocked: false, rarity: 'legendary', xpBonus: 500 }
    ]
  },
  {
    id: 'mindfulness-21',
    title: '21 Days of Mindfulness',
    description: 'Develop mindfulness habits to reduce stress and improve mental clarity. Learn to be present and aware in your daily life.',
    category: 'mindfulness',
    duration: 21,
    difficulty: 'intermediate',
    icon: Brain,
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-indigo-500',
    xpReward: 2500,
    participants: 892,
    rating: 4.7,
    tags: ['meditation', 'stress-relief', 'focus', 'awareness'],
    tasks: [
      { 
        id: 'm1', 
        title: '5-minute breathing meditation', 
        description: 'Focus on your breath for 5 minutes. Notice the inhale and exhale without trying to change it.', 
        completed: false, 
        day: 1, 
        xpValue: 150,
        timeEstimate: 5,
        tips: ['Find a quiet space', 'Sit comfortably', 'Focus on the sensation of breathing', 'When your mind wanders, gently return to your breath']
      },
      { 
        id: 'm2', 
        title: 'Mindful eating', 
        description: 'Eat one meal with full attention. Notice the taste, texture, and experience of eating.', 
        completed: false, 
        day: 2, 
        xpValue: 100,
        timeEstimate: 15,
        tips: ['Eat slowly', 'Notice the colors and smells', 'Chew thoroughly', 'Put down your phone and other distractions']
      }
    ],
    rewards: [
      { id: 'r1', title: 'Mindful Beginner', description: 'Complete 7 days of mindfulness', icon: Star, unlocked: false, rarity: 'common', xpBonus: 75 },
      { id: 'r2', title: 'Mindful Explorer', description: 'Complete 14 days of mindfulness', icon: Brain, unlocked: false, rarity: 'rare', xpBonus: 150 },
      { id: 'r3', title: 'Mindful Master', description: 'Complete all 21 days of mindfulness', icon: Crown, unlocked: false, rarity: 'legendary', xpBonus: 300 }
    ]
  },
  {
    id: 'sleep-14',
    title: '14 Days of Better Sleep',
    description: 'Establish healthy sleep habits for better mental and physical health. Improve your sleep quality and energy levels.',
    category: 'sleep',
    duration: 14,
    difficulty: 'beginner',
    icon: Moon,
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    xpReward: 1800,
    participants: 1563,
    rating: 4.9,
    tags: ['sleep-hygiene', 'energy', 'health', 'routine'],
    tasks: [
      { 
        id: 's1', 
        title: 'Set a consistent bedtime', 
        description: 'Choose a bedtime and stick to it. Aim for 7-9 hours of sleep per night.', 
        completed: false, 
        day: 1, 
        xpValue: 120,
        timeEstimate: 5,
        tips: ['Choose a realistic bedtime', 'Set a reminder 30 minutes before', 'Create a relaxing pre-sleep routine', 'Avoid caffeine in the afternoon']
      },
      { 
        id: 's2', 
        title: 'Create a bedtime routine', 
        description: 'Develop a relaxing pre-sleep routine that signals to your body it\'s time to sleep.', 
        completed: false, 
        day: 2, 
        xpValue: 100,
        timeEstimate: 20,
        tips: ['Include calming activities', 'Avoid screens 1 hour before bed', 'Try reading, meditation, or gentle stretching', 'Keep the routine consistent']
      }
    ],
    rewards: [
      { id: 'r1', title: 'Sleep Enthusiast', description: 'Complete 7 days of sleep habits', icon: Moon, unlocked: false, rarity: 'common', xpBonus: 60 },
      { id: 'r2', title: 'Sleep Master', description: 'Complete all 14 days of sleep habits', icon: Crown, unlocked: false, rarity: 'epic', xpBonus: 200 }
    ]
  }
];

export const WellnessChallenges: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalXP: 0,
    level: 1,
    challengesCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTimeSpent: 0,
    achievements: [],
    badges: []
  });
  const [activeChallenge, setActiveChallenge] = useState<UserProgress | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ChallengeTask | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Animation values
  const xpProgress = useMotionValue(0);
  const xpProgressSpring = useSpring(xpProgress, { stiffness: 100, damping: 20 });
  const levelProgress = useTransform(xpProgressSpring, [0, 1000], [0, 100]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('echoaid_challenges');
    const savedStats = localStorage.getItem('echoaid_stats');
    
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('echoaid_challenges', JSON.stringify(userProgress));
    localStorage.setItem('echoaid_stats', JSON.stringify(userStats));
  }, [userProgress, userStats]);

  const startChallenge = (challenge: Challenge) => {
    const newProgress: UserProgress = {
      challengeId: challenge.id,
      currentDay: 1,
      completedTasks: [],
      startDate: new Date().toISOString(),
      streak: 0,
      totalCompleted: 0,
      totalXP: 0,
      achievements: [],
      notes: {},
      moodRatings: {},
      timeSpent: {}
    };
    setUserProgress(prev => [...prev, newProgress]);
    setActiveChallenge(newProgress);
    setShowChallengeModal(true);
  };

  const completeTask = (taskId: string, timeSpent: number = 0, moodRating: number = 5, notes: string = '') => {
    if (!activeChallenge) return;

    const challenge = challenges.find(c => c.id === activeChallenge.challengeId);
    const task = challenge?.tasks.find(t => t.id === taskId);
    if (!challenge || !task) return;

    const updatedProgress = {
      ...activeChallenge,
      completedTasks: [...activeChallenge.completedTasks, taskId],
      totalCompleted: activeChallenge.totalCompleted + 1,
      streak: activeChallenge.streak + 1,
      totalXP: activeChallenge.totalXP + task.xpValue,
      lastCompletedDate: new Date().toISOString(),
      timeSpent: { ...activeChallenge.timeSpent, [taskId]: timeSpent },
      moodRatings: { ...activeChallenge.moodRatings, [taskId]: moodRating },
      notes: { ...activeChallenge.notes, [taskId]: notes }
    };

    // Update user stats
    const newTotalXP = userStats.totalXP + task.xpValue;
    const newLevel = Math.floor(newTotalXP / 1000) + 1;
    const newStats = {
      ...userStats,
      totalXP: newTotalXP,
      level: newLevel,
      totalTimeSpent: userStats.totalTimeSpent + timeSpent
    };

    setUserProgress(prev => 
      prev.map(p => p.challengeId === activeChallenge.challengeId ? updatedProgress : p)
    );
    setUserStats(newStats);
    setActiveChallenge(updatedProgress);

    // Animate XP progress
    xpProgress.set(newTotalXP % 1000);
  };

  const getChallengeProgress = (challengeId: string) => {
    return userProgress.find(p => p.challengeId === challengeId);
  };

  const getProgressPercentage = (progress: UserProgress) => {
    const challenge = challenges.find(c => c.id === progress.challengeId);
    if (!challenge) return 0;
    return Math.round((progress.totalCompleted / challenge.tasks.length) * 100);
  };

  const getUnlockedRewards = (progress: UserProgress) => {
    const challenge = challenges.find(c => c.id === progress.challengeId);
    if (!challenge) return [];
    
    return challenge.rewards.map(reward => ({
      ...reward,
      unlocked: progress.totalCompleted >= getRewardUnlockThreshold(reward.id)
    }));
  };

  const getRewardUnlockThreshold = (rewardId: string) => {
    const thresholds: { [key: string]: number } = {
      'r1': 7, 'r2': 14, 'r3': 21, 'r4': 30
    };
    return thresholds[rewardId] || 0;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || challenge.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (sortBy) {
      case 'popular': return b.participants - a.participants;
      case 'rating': return b.rating - a.rating;
      case 'duration': return a.duration - b.duration;
      case 'difficulty': return a.difficulty.localeCompare(b.difficulty);
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Wellness <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Challenges</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Transform your mental health through engaging challenges and build lasting habits
          </p>

          {/* User Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card variant="glass" className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{userStats.level}</div>
              <div className="text-white/60 text-sm">Level</div>
            </Card>
            <Card variant="glass" className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{userStats.totalXP}</div>
              <div className="text-white/60 text-sm">Total XP</div>
            </Card>
            <Card variant="glass" className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{userStats.currentStreak}</div>
              <div className="text-white/60 text-sm">Day Streak</div>
            </Card>
            <Card variant="glass" className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{userStats.challengesCompleted}</div>
              <div className="text-white/60 text-sm">Completed</div>
            </Card>
          </div>

          {/* Level Progress */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between text-sm text-white/60 mb-2">
              <span>Level {userStats.level} Progress</span>
              <span>{userStats.totalXP % 1000}/1000 XP</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                style={{ width: levelProgress }}
              />
            </div>
          </div>
        </motion.div>

        {/* Enhanced Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="gratitude">Gratitude</option>
              <option value="sleep">Sleep</option>
              <option value="exercise">Exercise</option>
              <option value="social">Social</option>
              <option value="creativity">Creativity</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="duration">Shortest Duration</option>
              <option value="difficulty">Easiest First</option>
            </select>
          </div>
        </div>

        {/* Active Challenge with Enhanced UI */}
        {activeChallenge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card variant="glass" className="p-6 border-2 border-purple-500/30 bg-purple-500/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Flame className="h-6 w-6 text-orange-400" />
                  <h2 className="text-2xl font-bold text-white">Active Challenge</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setShowStatsModal(true)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Stats
                  </Button>
                  <Button
                    onClick={() => setShowRewardsModal(true)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Rewards
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{activeChallenge.streak}</div>
                  <div className="text-white/60 text-sm">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{activeChallenge.totalCompleted}</div>
                  <div className="text-white/60 text-sm">Tasks Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{activeChallenge.totalXP}</div>
                  <div className="text-white/60 text-sm">XP Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{getProgressPercentage(activeChallenge)}%</div>
                  <div className="text-white/60 text-sm">Progress</div>
                </div>
              </div>

              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(activeChallenge)}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {challenges.find(c => c.id === activeChallenge.challengeId)?.title}
                  </h3>
                  <p className="text-white/60 text-sm">
                    Day {activeChallenge.currentDay} of {challenges.find(c => c.id === activeChallenge.challengeId)?.duration}
                  </p>
                </div>
                <Button
                  onClick={() => setShowChallengeModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Continue Challenge
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Enhanced Challenge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedChallenges.map((challenge, index) => {
            const progress = getChallengeProgress(challenge.id);
            const isActive = progress && progress.totalCompleted < challenge.tasks.length;
            const isCompleted = progress && progress.totalCompleted >= challenge.tasks.length;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card variant="glass" className={`h-full border transition-all duration-300 ${
                  isActive ? 'border-purple-500/50 bg-purple-500/10' : 
                  isCompleted ? 'border-green-500/50 bg-green-500/10' : 
                  'border-white/10 hover:border-purple-400/50'
                }`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${challenge.gradient} flex items-center justify-center`}>
                        <challenge.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        {isCompleted && <Crown className="h-5 w-5 text-yellow-400" />}
                        {isActive && <Flame className="h-5 w-5 text-orange-400" />}
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(challenge.difficulty)} bg-white/10`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                    <p className="text-white/70 mb-4 text-sm leading-relaxed">{challenge.description}</p>

                    {/* Enhanced Challenge Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-white/60" />
                        <span className="text-white/60">{challenge.duration} days</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-white/60" />
                        <span className="text-white/60">{challenge.tasks.length} tasks</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-white/60" />
                        <span className="text-white/60">{challenge.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-white/60">{challenge.rating}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {challenge.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/60">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {progress && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/60">Progress</span>
                          <span className="text-white">{progress.totalCompleted}/{challenge.tasks.length}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(progress)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {!progress && (
                        <Button
                          onClick={() => startChallenge(challenge)}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Challenge
                        </Button>
                      )}
                      {isActive && (
                        <Button
                          onClick={() => {
                            setActiveChallenge(progress);
                            setShowChallengeModal(true);
                          }}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                      )}
                      {isCompleted && (
                        <Button
                          onClick={() => {
                            setActiveChallenge(progress);
                            setShowRewardsModal(true);
                          }}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          <Trophy className="h-4 w-4 mr-2" />
                          View Rewards
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Challenge Modal */}
      <AnimatePresence>
        {showChallengeModal && activeChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowChallengeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Target className="h-6 w-6 text-purple-400" />
                  <h3 className="text-2xl font-bold text-white">
                    {challenges.find(c => c.id === activeChallenge.challengeId)?.title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChallengeModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tasks List */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Daily Tasks</h4>
                  {challenges.find(c => c.id === activeChallenge.challengeId)?.tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                        activeChallenge.completedTasks.includes(task.id)
                          ? 'bg-green-500/20 border-green-500/30'
                          : 'bg-white/5 border-white/10 hover:border-purple-500/30 hover:bg-white/10'
                      }`}
                      onClick={() => {
                        setSelectedTask(task);
                        setShowTaskDetail(true);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {activeChallenge.completedTasks.includes(task.id) ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <Circle className="h-5 w-5 text-white/40" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{task.title}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-white/60">Day {task.day}</span>
                              <span className="text-sm text-yellow-400">{task.xpValue} XP</span>
                            </div>
                          </div>
                          <p className="text-white/70 text-sm mb-2">{task.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-white/60">
                            <span>⏱️ {task.timeEstimate} min</span>
                            <span>💡 {task.tips.length} tips</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress & Stats */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Your Progress</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Card variant="glass" className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">{activeChallenge.streak}</div>
                        <div className="text-white/60 text-sm">Day Streak</div>
                      </Card>
                      <Card variant="glass" className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">{activeChallenge.totalXP}</div>
                        <div className="text-white/60 text-sm">XP Earned</div>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Challenge Stats</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Completion Rate</span>
                        <span className="text-white">{getProgressPercentage(activeChallenge)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Tasks Remaining</span>
                        <span className="text-white">
                          {challenges.find(c => c.id === activeChallenge.challengeId)?.tasks.length! - activeChallenge.totalCompleted}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Average Time</span>
                        <span className="text-white">
                          {Math.round(Object.values(activeChallenge.timeSpent).reduce((a, b) => a + b, 0) / Math.max(activeChallenge.totalCompleted, 1))} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {showTaskDetail && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowTaskDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{selectedTask.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTaskDetail(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-white/80">{selectedTask.description}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-yellow-400">⭐ {selectedTask.xpValue} XP</span>
                  <span className="text-white/60">⏱️ {selectedTask.timeEstimate} minutes</span>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Tips for Success:</h4>
                  <ul className="space-y-2">
                    {selectedTask.tips.map((tip, index) => (
                      <li key={index} className="text-white/70 text-sm flex items-start space-x-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {!activeChallenge?.completedTasks.includes(selectedTask.id) && (
                  <div className="pt-4 border-t border-white/20">
                    <Button
                      onClick={() => {
                        completeTask(selectedTask.id);
                        setShowTaskDetail(false);
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Rewards Modal */}
      <AnimatePresence>
        {showRewardsModal && activeChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRewardsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  <h3 className="text-2xl font-bold text-white">Rewards</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRewardsModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {getUnlockedRewards(activeChallenge).map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      reward.unlocked
                        ? 'bg-yellow-500/20 border-yellow-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 ${reward.unlocked ? getRarityColor(reward.rarity) : 'text-white/40'}`}>
                        <reward.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-semibold ${reward.unlocked ? 'text-white' : 'text-white/60'}`}>
                            {reward.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(reward.rarity)} bg-white/10`}>
                            {reward.rarity}
                          </span>
                        </div>
                        <p className={`text-sm ${reward.unlocked ? 'text-white/80' : 'text-white/40'}`}>
                          {reward.description}
                        </p>
                        {reward.unlocked && (
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-yellow-400 text-sm">+{reward.xpBonus} XP Bonus</span>
                            <Sparkles className="h-4 w-4 text-yellow-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
