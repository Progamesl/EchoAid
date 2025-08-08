import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  Brain, 
  Activity, 
  Target, 
  Award, 
  Trophy,
  Crown,
  Gem,
  Diamond,
  Star,
  Zap,
  Lightbulb,
  BarChart3,
  PieChart,
  LineChart,
  AreaChart,
  Calendar,
  Clock,
  MapPin,
  Globe,
  MessageCircle,
  Phone,
  Shield,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  Share2,
  ExternalLink,
  Settings,
  Filter,
  Search,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Link,
  Bookmark,
  BookmarkPlus,
  BookmarkMinus,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  Info,
  HelpCircle,
  XCircle,
  CheckSquare,
  Square,
  Circle,
  Radio,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Gauge,
  Battery,
  Wifi,
  Signal,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Image,
  FileText,
  File,
  Folder,
  FolderOpen,
  Database,
  Server,
  Cloud,
  CloudOff,
  Lock,
  Unlock,
  Key,
  Shield as ShieldIcon,
  User,
  UserCheck,
  UserX,
  UserPlus,
  Users as UsersIcon,
  UserMinus,
  UserCog,
  Mail,
  MailOpen,
  MailCheck,
  MailX,
  MailPlus,
  MailMinus,
  MailSearch,
  Bell,
  BellOff,
  BellRing,
  BellPlus,
  BellMinus,
  BellDot,
  Home,
  Building,
  Building2,
  Store,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Coins,
  PiggyBank,
  Wallet,
  Receipt,
  Tag,
  Percent,
  Hash,
  AtSign
} from 'lucide-react';
import { useLocalAuth } from '../../contexts/LocalAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';

interface ImpactMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  unit: string;
  description: string;
  category: 'engagement' | 'wellness' | 'crisis' | 'community';
  trend: number[];
  target: number;
  achieved: number;
}

interface UserEngagement {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  sessionDuration: number;
  sessionsPerUser: number;
  retentionRate: number;
  churnRate: number;
}

interface WellnessImpact {
  totalSessions: number;
  crisisInterventions: number;
  successfulResolutions: number;
  averageWellnessScore: number;
  techniquesUsed: number;
  insightsGenerated: number;
  communityConnections: number;
  professionalReferrals: number;
}

interface CrisisIntervention {
  totalInterventions: number;
  successfulResolutions: number;
  averageResponseTime: number;
  escalationRate: number;
  mostCommonCrisis: string;
  preventionRate: number;
  followUpSuccess: number;
  emergencyContacts: number;
}

interface CommunityImpact {
  totalConnections: number;
  supportGroups: number;
  peerSupport: number;
  resourceSharing: number;
  communityEvents: number;
  volunteerHours: number;
  donations: number;
  partnerships: number;
}

interface GeographicData {
  country: string;
  users: number;
  sessions: number;
  interventions: number;
  impact: number;
}

interface DemographicData {
  ageGroup: string;
  count: number;
  percentage: number;
  engagement: number;
}

interface RealTimeData {
  activeUsers: number;
  currentSessions: number;
  crisisAlerts: number;
  communityActivity: number;
  lastUpdated: Date;
}

export default function SocialImpactDashboard() {
  const { user } = useLocalAuth();
  const { language } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'wellness' | 'crisis' | 'community' | 'geographic'>('overview');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    activeUsers: 1247,
    currentSessions: 89,
    crisisAlerts: 3,
    communityActivity: 156,
    lastUpdated: new Date()
  });

  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>([
    {
      id: 'total-users',
      name: 'Total Users',
      value: 15420,
      change: 12.5,
      changeType: 'increase',
      unit: 'users',
      description: 'Total registered users on the platform',
      category: 'engagement',
      trend: [12000, 12500, 13000, 14000, 14500, 15000, 15420],
      target: 20000,
      achieved: 77.1
    },
    {
      id: 'active-sessions',
      name: 'Active Sessions',
      value: 89,
      change: 8.3,
      changeType: 'increase',
      unit: 'sessions',
      description: 'Currently active wellness sessions',
      category: 'wellness',
      trend: [65, 72, 78, 82, 85, 87, 89],
      target: 100,
      achieved: 89
    },
    {
      id: 'crisis-interventions',
      name: 'Crisis Interventions',
      value: 342,
      change: -15.2,
      changeType: 'decrease',
      unit: 'interventions',
      description: 'Successful crisis interventions this month',
      category: 'crisis',
      trend: [400, 380, 360, 350, 345, 343, 342],
      target: 300,
      achieved: 114
    },
    {
      id: 'wellness-score',
      name: 'Average Wellness Score',
      value: 78.5,
      change: 5.2,
      changeType: 'increase',
      unit: 'points',
      description: 'Average user wellness score',
      category: 'wellness',
      trend: [70, 72, 74, 76, 77, 78, 78.5],
      target: 80,
      achieved: 98.1
    },
    {
      id: 'community-connections',
      name: 'Community Connections',
      value: 2847,
      change: 23.1,
      changeType: 'increase',
      unit: 'connections',
      description: 'Peer support connections made',
      category: 'community',
      trend: [2000, 2200, 2400, 2600, 2700, 2800, 2847],
      target: 3000,
      achieved: 94.9
    },
    {
      id: 'response-time',
      name: 'Average Response Time',
      value: 2.3,
      change: -12.5,
      changeType: 'decrease',
      unit: 'minutes',
      description: 'Average coach response time',
      category: 'crisis',
      trend: [3.0, 2.8, 2.6, 2.4, 2.3, 2.3, 2.3],
      target: 2.0,
      achieved: 115
    }
  ]);

  const [userEngagement, setUserEngagement] = useState<UserEngagement>({
    totalUsers: 15420,
    activeUsers: 8923,
    newUsers: 1247,
    returningUsers: 7676,
    sessionDuration: 18.5,
    sessionsPerUser: 4.2,
    retentionRate: 78.5,
    churnRate: 12.3
  });

  const [wellnessImpact, setWellnessImpact] = useState<WellnessImpact>({
    totalSessions: 45678,
    crisisInterventions: 342,
    successfulResolutions: 298,
    averageWellnessScore: 78.5,
    techniquesUsed: 12456,
    insightsGenerated: 23456,
    communityConnections: 2847,
    professionalReferrals: 156
  });

  const [crisisIntervention, setCrisisIntervention] = useState<CrisisIntervention>({
    totalInterventions: 342,
    successfulResolutions: 298,
    averageResponseTime: 2.3,
    escalationRate: 8.5,
    mostCommonCrisis: 'hopelessness',
    preventionRate: 92.3,
    followUpSuccess: 87.1,
    emergencyContacts: 156
  });

  const [communityImpact, setCommunityImpact] = useState<CommunityImpact>({
    totalConnections: 2847,
    supportGroups: 45,
    peerSupport: 1234,
    resourceSharing: 567,
    communityEvents: 23,
    volunteerHours: 1247,
    donations: 45678,
    partnerships: 12
  });

  const [geographicData, setGeographicData] = useState<GeographicData[]>([
    { country: 'United States', users: 8923, sessions: 23456, interventions: 156, impact: 92.3 },
    { country: 'Canada', users: 2345, sessions: 6789, interventions: 45, impact: 87.1 },
    { country: 'United Kingdom', users: 1892, sessions: 4567, interventions: 34, impact: 89.5 },
    { country: 'Australia', users: 1234, sessions: 3456, interventions: 23, impact: 85.2 },
    { country: 'Germany', users: 1026, sessions: 2345, interventions: 18, impact: 82.7 }
  ]);

  const [demographicData, setDemographicData] = useState<DemographicData[]>([
    { ageGroup: '13-17', count: 2345, percentage: 15.2, engagement: 78.5 },
    { ageGroup: '18-24', count: 4567, percentage: 29.6, engagement: 82.3 },
    { ageGroup: '25-34', count: 3892, percentage: 25.2, engagement: 85.1 },
    { ageGroup: '35-44', count: 2345, percentage: 15.2, engagement: 79.8 },
    { ageGroup: '45-54', count: 1234, percentage: 8.0, engagement: 76.2 },
    { ageGroup: '55+', count: 1037, percentage: 6.7, engagement: 72.1 }
  ]);

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        currentSessions: prev.currentSessions + Math.floor(Math.random() * 5) - 2,
        crisisAlerts: Math.max(0, prev.crisisAlerts + Math.floor(Math.random() * 3) - 1),
        communityActivity: prev.communityActivity + Math.floor(Math.random() * 20) - 10,
        lastUpdated: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'engagement', name: 'User Engagement', icon: Users },
    { id: 'wellness', name: 'Wellness Impact', icon: Heart },
    { id: 'crisis', name: 'Crisis Intervention', icon: Shield },
    { id: 'community', name: 'Community Impact', icon: Globe },
    { id: 'geographic', name: 'Geographic Data', icon: MapPin }
  ];

  const timeRanges = [
    { id: '24h', name: '24 Hours' },
    { id: '7d', name: '7 Days' },
    { id: '30d', name: '30 Days' },
    { id: '90d', name: '90 Days' },
    { id: '1y', name: '1 Year' }
  ];

  const getMetricColor = (changeType: 'increase' | 'decrease') => {
    return changeType === 'increase' ? 'text-green-400' : 'text-red-400';
  };

  const getMetricIcon = (changeType: 'increase' | 'decrease') => {
    return changeType === 'increase' ? ArrowUp : ArrowDown;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">Social Impact Dashboard</h1>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Activity className="h-4 w-4" />
                <span>{realTimeData.activeUsers} active users</span>
                <span>•</span>
                <span>{realTimeData.currentSessions} active sessions</span>
                <span>•</span>
                <span>Last updated: {realTimeData.lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                {timeRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.name}</option>
                ))}
              </select>
              <Button
                onClick={() => setIsLoading(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-md rounded-xl p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {impactMetrics.map((metric) => {
                    const Icon = getMetricIcon(metric.changeType);
                    return (
                      <Card key={metric.id} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">{metric.name}</h3>
                          <div className={`flex items-center space-x-1 ${getMetricColor(metric.changeType)}`}>
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{Math.abs(metric.change)}%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-white">{metric.value.toLocaleString()}</span>
                            <span className="text-white/60">{metric.unit}</span>
                          </div>
                          
                          <p className="text-white/70 text-sm">{metric.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/60">Target</span>
                              <span className="text-white">{metric.target.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, metric.achieved)}%` }}
                              ></div>
                            </div>
                            <div className="text-right text-sm text-white/60">
                              {metric.achieved.toFixed(1)}% achieved
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Real-time Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Real-time Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white">Active Users</span>
                        </div>
                        <span className="text-white font-semibold">{realTimeData.activeUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-white">Current Sessions</span>
                        </div>
                        <span className="text-white font-semibold">{realTimeData.currentSessions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                          <span className="text-white">Crisis Alerts</span>
                        </div>
                        <span className="text-white font-semibold">{realTimeData.crisisAlerts}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-white">Community Activity</span>
                        </div>
                        <span className="text-white font-semibold">{realTimeData.communityActivity}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Demographic Distribution</h3>
                    <div className="space-y-3">
                      {demographicData.map((demo) => (
                        <div key={demo.ageGroup} className="flex items-center justify-between">
                          <span className="text-white">{demo.ageGroup}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-20 bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                style={{ width: `${demo.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-white font-semibold">{demo.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Geographic Impact */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Geographic Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {geographicData.map((geo) => (
                      <div key={geo.country} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{geo.country}</span>
                          <span className="text-green-400 font-bold">{geo.impact}%</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/60">Users</span>
                            <span className="text-white">{geo.users.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Sessions</span>
                            <span className="text-white">{geo.sessions.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Interventions</span>
                            <span className="text-white">{geo.interventions}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'engagement' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">User Engagement Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{userEngagement.totalUsers.toLocaleString()}</div>
                      <div className="text-white/60">Total Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{userEngagement.activeUsers.toLocaleString()}</div>
                      <div className="text-white/60">Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{userEngagement.retentionRate}%</div>
                      <div className="text-white/60">Retention Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{userEngagement.sessionDuration}min</div>
                      <div className="text-white/60">Avg Session Duration</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'wellness' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Wellness Impact Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{wellnessImpact.totalSessions.toLocaleString()}</div>
                      <div className="text-white/60">Total Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{wellnessImpact.averageWellnessScore}</div>
                      <div className="text-white/60">Avg Wellness Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{wellnessImpact.techniquesUsed.toLocaleString()}</div>
                      <div className="text-white/60">Techniques Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{wellnessImpact.communityConnections.toLocaleString()}</div>
                      <div className="text-white/60">Community Connections</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'crisis' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Crisis Intervention Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{crisisIntervention.totalInterventions}</div>
                      <div className="text-white/60">Total Interventions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{crisisIntervention.successfulResolutions}</div>
                      <div className="text-white/60">Successful Resolutions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{crisisIntervention.averageResponseTime}min</div>
                      <div className="text-white/60">Avg Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{crisisIntervention.preventionRate}%</div>
                      <div className="text-white/60">Prevention Rate</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'community' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Community Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{communityImpact.totalConnections.toLocaleString()}</div>
                      <div className="text-white/60">Total Connections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{communityImpact.supportGroups}</div>
                      <div className="text-white/60">Support Groups</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{communityImpact.volunteerHours.toLocaleString()}</div>
                      <div className="text-white/60">Volunteer Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">${communityImpact.donations.toLocaleString()}</div>
                      <div className="text-white/60">Total Donations</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'geographic' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Geographic Distribution</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-3">Country</th>
                          <th className="text-right py-3">Users</th>
                          <th className="text-right py-3">Sessions</th>
                          <th className="text-right py-3">Interventions</th>
                          <th className="text-right py-3">Impact Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {geographicData.map((geo) => (
                          <tr key={geo.country} className="border-b border-white/10">
                            <td className="py-3">{geo.country}</td>
                            <td className="text-right py-3">{geo.users.toLocaleString()}</td>
                            <td className="text-right py-3">{geo.sessions.toLocaleString()}</td>
                            <td className="text-right py-3">{geo.interventions}</td>
                            <td className="text-right py-3">
                              <span className="text-green-400 font-semibold">{geo.impact}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
