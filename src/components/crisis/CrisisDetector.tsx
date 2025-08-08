import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Shield, 
  Heart, 
  Users, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  TrendingUp,
  Eye,
  Brain,
  Zap,
  Star,
  Award,
  Trophy,
  Crown,
  Gem,
  Diamond,
  PhoneCall,
  MessageSquare,
  Globe,
  Navigation,
  Calendar,
  Clock as ClockIcon,
  User,
  Settings,
  HelpCircle,
  Info,
  ExternalLink,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Activity as ActivityIcon
} from 'lucide-react';
import { useLocalAuth } from '../../contexts/LocalAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';

interface CrisisData {
  level: number;
  type: 'suicide' | 'self-harm' | 'hopelessness' | 'isolation' | 'substance' | 'violence';
  triggers: string[];
  symptoms: string[];
  riskFactors: string[];
  immediateActions: string[];
  resources: string[];
  emergencyContacts: string[];
  timestamp: Date;
  resolved: boolean;
  interventionSteps: string[];
  followUpRequired: boolean;
  professionalHelpNeeded: boolean;
}

interface CrisisIntervention {
  id: string;
  userId: string;
  crisisData: CrisisData;
  actionsTaken: string[];
  outcome: 'resolved' | 'ongoing' | 'escalated';
  timestamp: Date;
  followUpDate?: Date;
  notes: string[];
}

interface EmergencyResource {
  id: string;
  name: string;
  type: 'hotline' | 'text' | 'emergency' | 'professional' | 'community';
  contact: string;
  description: string;
  availability: '24/7' | 'business-hours' | 'appointment';
  languages: string[];
  specializations: string[];
  rating: number;
  responseTime: string;
  cost: string;
  location?: {
    address: string;
    coordinates: [number, number];
  };
}

export default function CrisisDetector() {
  const { user } = useLocalAuth();
  const { language } = useTheme();
  const [crisisData, setCrisisData] = useState<CrisisData | null>(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [activeIntervention, setActiveIntervention] = useState<CrisisIntervention | null>(null);
  const [interventionHistory, setInterventionHistory] = useState<CrisisIntervention[]>([]);
  const [emergencyResources, setEmergencyResources] = useState<EmergencyResource[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [crisisStats, setCrisisStats] = useState({
    totalInterventions: 0,
    successfulResolutions: 0,
    averageResponseTime: 0,
    mostCommonCrisis: '',
    escalationRate: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<EmergencyResource | null>(null);

  // Crisis detection patterns
  const crisisPatterns = {
    suicide: {
      keywords: ['kill myself', 'end it all', 'want to die', 'suicide', 'end my life', 'no reason to live', 'better off dead'],
      severity: 10,
      immediateActions: [
        'Call 988 - National Suicide Prevention Lifeline',
        'Text HOME to 741741 - Crisis Text Line',
        'Call 911 if in immediate danger',
        'Remove access to lethal means',
        'Stay with the person if possible',
        'Contact emergency mental health services'
      ],
      resources: [
        '988 Suicide & Crisis Lifeline',
        'Crisis Text Line',
        'Emergency Services',
        'Local Crisis Team'
      ]
    },
    selfHarm: {
      keywords: ['hurt myself', 'cut myself', 'self harm', 'self-injury', 'bleeding', 'burn myself'],
      severity: 8,
      immediateActions: [
        'Assess for immediate medical attention',
        'Remove access to sharp objects',
        'Call crisis hotline',
        'Seek professional help immediately',
        'Apply first aid if needed',
        'Contact mental health professional'
      ],
      resources: [
        'Crisis Text Line',
        'Self-Injury Hotline',
        'Mental Health Professional',
        'Emergency Medical Services'
      ]
    },
    hopelessness: {
      keywords: ['hopeless', 'no future', 'nothing matters', 'pointless', 'worthless', 'no hope'],
      severity: 6,
      immediateActions: [
        'Practice grounding techniques',
        'Contact mental health professional',
        'Reach out to trusted person',
        'Focus on small, manageable tasks',
        'Practice self-compassion',
        'Consider therapy options'
      ],
      resources: [
        'Mental Health Professional',
        'Support Groups',
        'Therapy Resources',
        'Wellness Programs'
      ]
    },
    isolation: {
      keywords: ['alone', 'nobody cares', 'no friends', 'isolated', 'lonely', 'no one understands'],
      severity: 5,
      immediateActions: [
        'Reach out to trusted person',
        'Join support groups',
        'Contact mental health professional',
        'Practice self-care',
        'Consider community resources',
        'Build social connections'
      ],
      resources: [
        'Support Groups',
        'Community Centers',
        'Mental Health Professional',
        'Social Connection Programs'
      ]
    },
    substance: {
      keywords: ['drink too much', 'drugs', 'overdose', 'alcohol', 'substance abuse', 'addiction'],
      severity: 7,
      immediateActions: [
        'Call substance abuse hotline',
        'Seek medical attention if needed',
        'Contact addiction specialist',
        'Remove access to substances',
        'Call emergency services if overdose',
        'Consider treatment options'
      ],
      resources: [
        'Substance Abuse Hotline',
        'Addiction Treatment Centers',
        'Medical Emergency Services',
        'Recovery Programs'
      ]
    },
    violence: {
      keywords: ['hurt someone', 'violent', 'anger', 'rage', 'attack', 'fight'],
      severity: 9,
      immediateActions: [
        'Remove yourself from danger',
        'Call emergency services',
        'Contact crisis intervention',
        'Seek professional help',
        'Practice anger management',
        'Consider safety planning'
      ],
      resources: [
        'Emergency Services',
        'Crisis Intervention',
        'Anger Management Programs',
        'Safety Planning Resources'
      ]
    }
  };

  // Emergency resources data
  const defaultEmergencyResources: EmergencyResource[] = [
    {
      id: '988',
      name: '988 Suicide & Crisis Lifeline',
      type: 'hotline',
      contact: '988',
      description: '24/7 suicide prevention and crisis intervention',
      availability: '24/7',
      languages: ['en', 'es'],
      specializations: ['suicide', 'crisis', 'mental-health'],
      rating: 4.9,
      responseTime: 'Immediate',
      cost: 'Free'
    },
    {
      id: 'crisis-text',
      name: 'Crisis Text Line',
      type: 'text',
      contact: '741741',
      description: 'Text HOME to 741741 for crisis support',
      availability: '24/7',
      languages: ['en'],
      specializations: ['crisis', 'text-support'],
      rating: 4.8,
      responseTime: '< 5 minutes',
      cost: 'Free'
    },
    {
      id: '911',
      name: 'Emergency Services',
      type: 'emergency',
      contact: '911',
      description: 'Emergency medical and police services',
      availability: '24/7',
      languages: ['en', 'es'],
      specializations: ['emergency', 'medical', 'police'],
      rating: 4.7,
      responseTime: 'Immediate',
      cost: 'Free'
    },
    {
      id: 'trevor',
      name: 'The Trevor Project',
      type: 'hotline',
      contact: '1-866-488-7386',
      description: 'Crisis intervention for LGBTQ+ youth',
      availability: '24/7',
      languages: ['en', 'es'],
      specializations: ['lgbtq', 'youth', 'crisis'],
      rating: 4.9,
      responseTime: 'Immediate',
      cost: 'Free'
    },
    {
      id: 'veterans',
      name: 'Veterans Crisis Line',
      type: 'hotline',
      contact: '1-800-273-8255',
      description: 'Crisis support for veterans and their families',
      availability: '24/7',
      languages: ['en'],
      specializations: ['veterans', 'military', 'crisis'],
      rating: 4.8,
      responseTime: 'Immediate',
      cost: 'Free'
    }
  ];

  useEffect(() => {
    // Load emergency resources
    setEmergencyResources(defaultEmergencyResources);
    
    // Load intervention history
    const savedHistory = localStorage.getItem('echoaid_crisis_interventions');
    if (savedHistory) {
      setInterventionHistory(JSON.parse(savedHistory));
    }

    // Load crisis stats
    const savedStats = localStorage.getItem('echoaid_crisis_stats');
    if (savedStats) {
      setCrisisStats(JSON.parse(savedStats));
    }

    // Get user location for local resources
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  // Real crisis API call (demo-ready)
  const detectCrisisViaAPI = async (message: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/crisis/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!res.ok) throw new Error('Crisis API error');
      const data = await res.json();
      return data;
    } catch (e) {
      console.error('Crisis API failed, falling back to local detection');
      return detectCrisis(message);
    }
  };

  // Crisis detection function
  const detectCrisis = (message: string): CrisisData | null => {
    const lowerMessage = message.toLowerCase();
    let crisisLevel = 0;
    let crisisType: CrisisData['type'] = 'hopelessness';
    const triggers: string[] = [];
    const symptoms: string[] = [];
    const riskFactors: string[] = [];

    // Check for crisis keywords
    Object.entries(crisisPatterns).forEach(([type, pattern]) => {
      pattern.keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
          crisisLevel += pattern.severity;
          crisisType = type as CrisisData['type'];
          triggers.push(keyword);
          symptoms.push(type);
        }
      });
    });

    // Additional crisis indicators
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      crisisLevel += 3;
    }
    if (lowerMessage.includes('right now') || lowerMessage.includes('immediately')) {
      crisisLevel += 2;
    }
    if (lowerMessage.includes('can\'t take it') || lowerMessage.includes('breaking point')) {
      crisisLevel += 4;
    }

    if (crisisLevel >= 5) {
      const pattern = crisisPatterns[crisisType];
      return {
        level: crisisLevel,
        type: crisisType,
        triggers,
        symptoms,
        riskFactors,
        immediateActions: pattern.immediateActions,
        resources: pattern.resources,
        emergencyContacts: ['988', '911', '741741'],
        timestamp: new Date(),
        resolved: false,
        interventionSteps: [
          'Assess immediate safety',
          'Contact appropriate resources',
          'Provide immediate support',
          'Plan follow-up care',
          'Monitor progress'
        ],
        followUpRequired: true,
        professionalHelpNeeded: crisisLevel >= 7
      };
    }

    return null;
  };

  // Start crisis intervention
  const startCrisisIntervention = (crisis: CrisisData) => {
    setCrisisData(crisis);
    setShowCrisisModal(true);
    
    const intervention: CrisisIntervention = {
      id: `intervention_${Date.now()}`,
      userId: user?.uid || 'anonymous',
      crisisData: crisis,
      actionsTaken: [],
      outcome: 'ongoing',
      timestamp: new Date(),
      notes: [`Crisis detected: ${crisis.type} (Level ${crisis.level})`]
    };
    
    setActiveIntervention(intervention);
  };

  // Record action taken
  const recordAction = (action: string) => {
    if (activeIntervention) {
      const updatedIntervention = {
        ...activeIntervention,
        actionsTaken: [...activeIntervention.actionsTaken, action],
        notes: [...activeIntervention.notes, `Action taken: ${action}`]
      };
      setActiveIntervention(updatedIntervention);
    }
  };

  // Resolve crisis
  const resolveCrisis = (outcome: 'resolved' | 'ongoing' | 'escalated') => {
    if (activeIntervention && crisisData) {
      const resolvedIntervention = {
        ...activeIntervention,
        outcome,
        notes: [...activeIntervention.notes, `Crisis ${outcome}`]
      };
      
      setInterventionHistory(prev => [...prev, resolvedIntervention]);
      localStorage.setItem('echoaid_crisis_interventions', JSON.stringify([...interventionHistory, resolvedIntervention]));
      
      // Update stats
      const newStats = {
        ...crisisStats,
        totalInterventions: crisisStats.totalInterventions + 1,
        successfulResolutions: outcome === 'resolved' ? crisisStats.successfulResolutions + 1 : crisisStats.successfulResolutions
      };
      setCrisisStats(newStats);
      localStorage.setItem('echoaid_crisis_stats', JSON.stringify(newStats));
      
      setShowCrisisModal(false);
      setCrisisData(null);
      setActiveIntervention(null);
    }
  };

  // Contact emergency resource
  const contactResource = (resource: EmergencyResource) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
    
    if (resource.type === 'hotline') {
      window.open(`tel:${resource.contact}`, '_self');
    } else if (resource.type === 'text') {
      window.open(`sms:${resource.contact}`, '_self');
    } else if (resource.type === 'emergency') {
      window.open(`tel:${resource.contact}`, '_self');
    }
    
    recordAction(`Contacted ${resource.name}`);
  };

  // Get nearby resources
  const getNearbyResources = () => {
    // In a real app, this would call an API to get nearby mental health resources
    return emergencyResources.filter(resource => 
      resource.type === 'professional' || resource.type === 'community'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-red-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <h1 className="text-2xl font-bold text-white">Crisis Intervention System</h1>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Activity className="h-4 w-4" />
                <span>{crisisStats.totalInterventions} interventions</span>
                <span>•</span>
                <span>{crisisStats.successfulResolutions} resolved</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowResourceModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                Emergency Resources
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crisis Detection */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Crisis Detection & Response</h2>
              
              <div className="space-y-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <span className="text-white font-semibold">Active Crisis Detection</span>
                  </div>
                  <p className="text-white/80 text-sm">
                    The system continuously monitors for crisis indicators and provides immediate intervention when needed.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(crisisPatterns).map(([type, pattern]) => (
                    <div key={type} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium capitalize">{type.replace('-', ' ')}</span>
                        <span className="text-red-400 font-bold">Level {pattern.severity}</span>
                      </div>
                      <p className="text-white/60 text-sm mb-2">
                        {pattern.keywords.slice(0, 3).join(', ')}...
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {pattern.immediateActions.slice(0, 2).map((action, index) => (
                          <span key={index} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                            {action.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Emergency Resources */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Emergency Resources</h3>
              <div className="space-y-3">
                {emergencyResources.slice(0, 5).map((resource) => (
                  <div key={resource.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{resource.name}</span>
                      <span className="text-green-400 text-sm">{resource.availability}</span>
                    </div>
                    <p className="text-white/60 text-sm mb-2">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-mono">{resource.contact}</span>
                      <Button
                        onClick={() => contactResource(resource)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Crisis Stats */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Crisis Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Interventions</span>
                  <span className="text-white font-semibold">{crisisStats.totalInterventions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Successful Resolutions</span>
                  <span className="text-white font-semibold">{crisisStats.successfulResolutions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Success Rate</span>
                  <span className="text-white font-semibold">
                    {crisisStats.totalInterventions > 0 
                      ? Math.round((crisisStats.successfulResolutions / crisisStats.totalInterventions) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Avg Response Time</span>
                  <span className="text-white font-semibold">{crisisStats.averageResponseTime}s</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Intervention History */}
        <div className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Interventions</h2>
            <div className="space-y-4">
              {interventionHistory.slice(-5).map((intervention) => (
                <div key={intervention.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">
                        {intervention.crisisData.type.replace('-', ' ')}
                      </span>
                      <span className="text-red-400 font-bold">
                        Level {intervention.crisisData.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        intervention.outcome === 'resolved' ? 'bg-green-500/20 text-green-300' :
                        intervention.outcome === 'ongoing' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {intervention.outcome}
                      </span>
                      <span className="text-white/50 text-sm">
                        {new Date(intervention.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {intervention.actionsTaken.slice(0, 3).map((action, index) => (
                      <span key={index} className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded">
                        {action}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/60 text-sm">
                    {intervention.notes[intervention.notes.length - 1]}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Crisis Modal */}
      <AnimatePresence>
        {showCrisisModal && crisisData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCrisisModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-red-900/90 border border-red-500/30 rounded-xl p-6 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <div>
                  <h3 className="text-2xl font-bold text-white">Crisis Intervention Required</h3>
                  <p className="text-white/80">Level {crisisData.level} Crisis Detected</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-800/30 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Immediate Actions Required:</h4>
                  <div className="space-y-2">
                    {crisisData.immediateActions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-red-400 font-bold">{index + 1}.</span>
                        <span className="text-white/90">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Emergency Contacts:</h4>
                    <div className="space-y-2">
                      {crisisData.emergencyContacts.map((contact, index) => (
                        <Button
                          key={index}
                          onClick={() => window.open(`tel:${contact}`, '_self')}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call {contact}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Intervention Steps:</h4>
                    <div className="space-y-2">
                      {crisisData.interventionSteps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-white/80 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => resolveCrisis('resolved')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Crisis Resolved
                  </Button>
                  <Button
                    onClick={() => resolveCrisis('ongoing')}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Ongoing Support
                  </Button>
                  <Button
                    onClick={() => resolveCrisis('escalated')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalate
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resource Modal */}
      <AnimatePresence>
        {showResourceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowResourceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Emergency Resources</h3>
                <Button
                  onClick={() => setShowResourceModal(false)}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emergencyResources.map((resource) => (
                  <div key={resource.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{resource.name}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        resource.type === 'hotline' ? 'bg-green-500/20 text-green-300' :
                        resource.type === 'emergency' ? 'bg-red-500/20 text-red-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {resource.type}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mb-3">{resource.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">Contact:</span>
                        <span className="text-white font-mono text-sm">{resource.contact}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">Availability:</span>
                        <span className="text-green-400 text-sm">{resource.availability}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">Response Time:</span>
                        <span className="text-white text-sm">{resource.responseTime}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => contactResource(resource)}
                      className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Now
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
