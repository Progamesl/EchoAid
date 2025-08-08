import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Send, 
  Mic, 
  MicOff, 
  MessageCircle, 
  Brain, 
  Heart, 
  Shield, 
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  Zap,
  Star,
  Activity,
  Calendar,
  BarChart3,
  Lightbulb,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  Heart as HeartIcon,
  Smile,
  Frown,
  Meh,
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  Trophy,
  Crown,
  Gem,
  Diamond,
  Phone
} from 'lucide-react';
import { useLocalAuth } from '../../contexts/LocalAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  emotions?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  crisisLevel?: number;
  suggestions?: string[];
  mood?: string;
  confidence?: number;
}

interface CrisisData {
  level: number;
  triggers: string[];
  symptoms: string[];
  riskFactors: string[];
  immediateActions: string[];
  resources: string[];
  emergencyContacts: string[];
}

interface WellnessSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  messages: Message[];
  crisisDetected: boolean;
  crisisData?: CrisisData;
  moodTrend: string[];
  sessionType: 'general' | 'crisis' | 'therapy' | 'wellness';
  techniques: string[];
  insights: string[];
  recommendations: string[];
}

export default function AIWellnessCoach() {
  const { user } = useLocalAuth();
  const { language } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSession, setCurrentSession] = useState<WellnessSession | null>(null);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [crisisData, setCrisisData] = useState<CrisisData | null>(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalSessions: 0,
    totalMessages: 0,
    averageMood: 0,
    crisisInterventions: 0,
    techniquesUsed: 0,
    insightsGenerated: 0
  });
  const [activeTechniques, setActiveTechniques] = useState<string[]>([]);
  const [moodTracking, setMoodTracking] = useState<{mood: string, timestamp: Date}[]>([]);
  const [wellnessScore, setWellnessScore] = useState(75);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<'chat' | 'checkin'>('chat');
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [checkinNote, setCheckinNote] = useState('');

  // Crisis detection keywords and patterns
  const crisisKeywords = {
    suicide: ['kill myself', 'end it all', 'want to die', 'suicide', 'end my life', 'no reason to live'],
    selfHarm: ['hurt myself', 'cut myself', 'self harm', 'self-injury', 'bleeding'],
    hopelessness: ['hopeless', 'no future', 'nothing matters', 'pointless', 'worthless'],
    isolation: ['alone', 'nobody cares', 'no friends', 'isolated', 'lonely'],
    substance: ['drink too much', 'drugs', 'overdose', 'alcohol', 'substance abuse'],
    violence: ['hurt someone', 'violent', 'anger', 'rage', 'attack']
  };

  // Therapeutic techniques
  const therapeuticTechniques = {
    cbt: {
      name: 'Cognitive Behavioral Therapy',
      description: 'Identify and challenge negative thought patterns',
      techniques: ['Thought reframing', 'Cognitive restructuring', 'Behavioral activation']
    },
    dbt: {
      name: 'Dialectical Behavior Therapy',
      description: 'Build mindfulness and emotional regulation skills',
      techniques: ['Mindfulness', 'Distress tolerance', 'Emotional regulation', 'Interpersonal effectiveness']
    },
    act: {
      name: 'Acceptance and Commitment Therapy',
      description: 'Accept difficult emotions and commit to values-based actions',
      techniques: ['Defusion', 'Acceptance', 'Values clarification', 'Committed action']
    },
    mindfulness: {
      name: 'Mindfulness Meditation',
      description: 'Present-moment awareness and non-judgmental observation',
      techniques: ['Breathing exercises', 'Body scan', 'Loving-kindness meditation', 'Walking meditation']
    },
    solution: {
      name: 'Solution-Focused Therapy',
      description: 'Focus on solutions and strengths rather than problems',
      techniques: ['Miracle question', 'Scaling questions', 'Exception finding', 'Goal setting']
    }
  };

  // Initialize session
  useEffect(() => {
    if (!currentSession) {
      const newSession: WellnessSession = {
        id: `session_${Date.now()}`,
        startTime: new Date(),
        messages: [],
        crisisDetected: false,
        moodTrend: [],
        sessionType: 'general',
        techniques: [],
        insights: [],
        recommendations: []
      };
      setCurrentSession(newSession);
    }
  }, [currentSession]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load session stats
  useEffect(() => {
    const savedStats = localStorage.getItem('echoaid_session_stats');
    if (savedStats) {
      setSessionStats(JSON.parse(savedStats));
    }

    const savedMood = localStorage.getItem('echoaid_mood_tracking');
    if (savedMood) {
      setMoodTracking(JSON.parse(savedMood));
    }

    const savedProgress = localStorage.getItem('echoaid_progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setWellnessScore(progress.wellnessScore || 75);
      setStreak(progress.streak || 0);
      setLevel(progress.level || 1);
      setXp(progress.xp || 0);
    }
  }, []);

  // Persist mood and check-ins
  const persistMoodTracking = (items: { mood: string; timestamp: Date }[]) => {
    localStorage.setItem('echoaid_mood_tracking', JSON.stringify(items));
  };

  const feelingsCatalog = [
    'Anxious', 'Overwhelmed', 'Tired', 'Stressed', 'Sad', 'Lonely',
    'Calm', 'Grateful', 'Hopeful', 'Motivated', 'Proud', 'Content'
  ];

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling) ? prev.filter((f) => f !== feeling) : [...prev, feeling]
    );
  };

  const recordMood = (mood: 'Good' | 'Okay' | 'Bad') => {
    const entry = { mood, timestamp: new Date() };
    const updated = [...moodTracking, entry];
    setMoodTracking(updated);
    persistMoodTracking(updated);

    // simple avg mood score for sidebar
    const scoreMap: Record<string, number> = { Good: 1, Okay: 0, Bad: -1 };
    const avg =
      updated.reduce((acc, m) => acc + scoreMap[m.mood]!, 0) / Math.max(1, updated.length);
    setSessionStats((s) => ({ ...s, averageMood: Math.round(((avg + 1) / 2) * 100) }));

    // drop a system message to chat history for context
    const sysMsg: Message = {
      id: `checkin_${Date.now()}`,
      type: 'user',
      content: `Mood check-in: ${mood}${selectedFeelings.length ? ` | Feelings: ${selectedFeelings.join(', ')}` : ''}${checkinNote ? ` | Note: ${checkinNote}` : ''}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, sysMsg]);
    setSelectedFeelings([]);
    setCheckinNote('');
    setActiveView('chat');
  };

  // Crisis detection function
  const detectCrisis = (message: string): CrisisData | null => {
    const lowerMessage = message.toLowerCase();
    let crisisLevel = 0;
    const triggers: string[] = [];
    const symptoms: string[] = [];
    const riskFactors: string[] = [];

    // Check for crisis keywords
    Object.entries(crisisKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
          crisisLevel += category === 'suicide' ? 10 : 5;
          triggers.push(keyword);
          symptoms.push(category);
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
      return {
        level: crisisLevel,
        triggers,
        symptoms,
        riskFactors,
        immediateActions: [
          'Take deep breaths - inhale for 4, hold for 4, exhale for 4',
          'Ground yourself - name 5 things you can see, 4 you can touch, 3 you can hear',
          'Call 988 - National Suicide Prevention Lifeline',
          'Text HOME to 741741 - Crisis Text Line',
          'Call 911 if you\'re in immediate danger'
        ],
        resources: [
          '988 Suicide & Crisis Lifeline',
          'Crisis Text Line',
          'Emergency Services',
          'Local Mental Health Crisis Team'
        ],
        emergencyContacts: [
          '988',
          '911',
          '741741'
        ]
      };
    }

    return null;
  };

  // AI response generation with real therapeutic techniques
  const generateAIResponse = async (userMessage: string, crisisData?: CrisisData | null): Promise<Message> => {
    setIsTyping(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    let response = '';
    let emotions: string[] = [];
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let suggestions: string[] = [];
    let mood = 'neutral';
    let confidence = 0.8;

    if (crisisData) {
      // Crisis response
      response = `I'm here with you right now. I can see you're going through something really difficult, and I want you to know that you're not alone. 

First, let's take a moment together. Can you take a deep breath with me? Inhale for 4 counts, hold for 4, exhale for 4. 

You're showing signs of being in crisis, and I want to make sure you're safe. Here are some immediate steps we can take:

${crisisData.immediateActions.map((action, index) => `${index + 1}. ${action}`).join('\n')}

Would you be willing to call 988 right now? They have trained counselors available 24/7 who can help you through this moment. You don't have to go through this alone.

What's happening right now that's making you feel this way? I'm listening.`;

      sentiment = 'negative';
      emotions = ['distress', 'hopelessness', 'fear', 'isolation'];
      mood = 'crisis';
      confidence = 0.95;
    } else {
      // Regular therapeutic response
      const techniques = Object.values(therapeuticTechniques);
      const randomTechnique = techniques[Math.floor(Math.random() * techniques.length)];
      
      response = `Thank you for sharing that with me. I can hear that you're going through a challenging time, and it takes courage to open up about these feelings.

Let me share a technique that might help right now: ${randomTechnique.name}. ${randomTechnique.description}

Here's a simple exercise we can try together:
${randomTechnique.techniques[Math.floor(Math.random() * randomTechnique.techniques.length)]}

How does that feel to you? What thoughts come up when you try this approach?

Remember, healing isn't linear, and it's okay to have difficult moments. We're working through this together, one step at a time.`;

      sentiment = 'positive';
      emotions = ['hope', 'support', 'understanding'];
      mood = 'supportive';
      confidence = 0.85;
    }

    const aiMessage: Message = {
      id: `ai_${Date.now()}`,
      type: 'ai',
      content: response,
      timestamp: new Date(),
      emotions,
      sentiment,
      suggestions,
      mood,
      confidence
    };

    setIsTyping(false);
    return aiMessage;
  };

  // Send message function
  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Detect crisis
    let crisis = null as any;
    try {
      const res = await fetch('http://localhost:5000/api/crisis/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue })
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.crisisDetected) {
          crisis = {
            level: data.crisisLevel,
            type: (data.detectedIssues?.[0]?.type || 'hopelessness') as any,
            triggers: [],
            symptoms: [],
            riskFactors: [],
            immediateActions: data.detectedIssues?.[0]?.immediateActions || [],
            resources: [],
            emergencyContacts: ['988', '911', '741741'],
            timestamp: new Date(),
            resolved: false,
            interventionSteps: [],
            followUpRequired: data.requiresImmediateAction,
            professionalHelpNeeded: data.requiresImmediateAction
          };
        }
      }
    } catch (e) {
      crisis = detectCrisis(inputValue);
    }
    if (crisis) {
      setCrisisDetected(true);
      setCrisisData(crisis);
      setShowCrisisModal(true);
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(inputValue, crisis);
    setMessages(prev => [...prev, aiResponse]);

    // Update session
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, userMessage, aiResponse],
        crisisDetected: crisis ? true : currentSession.crisisDetected,
        crisisData: crisis || currentSession.crisisData,
        moodTrend: [...currentSession.moodTrend, aiResponse.mood || 'neutral']
      };
      setCurrentSession(updatedSession);
    }

    // Update stats
    setSessionStats(prev => ({
      ...prev,
      totalMessages: prev.totalMessages + 2,
      crisisInterventions: crisis ? prev.crisisInterventions + 1 : prev.crisisInterventions
    }));

    // Update progress
    const newXp = xp + 10;
    const newLevel = Math.floor(newXp / 100) + 1;
    setXp(newXp);
    setLevel(newLevel);
    setStreak(prev => prev + 1);
    setWellnessScore(prev => Math.min(100, prev + 2));

    // Save progress
    localStorage.setItem('echoaid_progress', JSON.stringify({
      wellnessScore: Math.min(100, wellnessScore + 2),
      streak: streak + 1,
      level: newLevel,
      xp: newXp
    }));
  };

  // Voice recording simulation
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setInputValue('I\'ve been feeling really overwhelmed lately and I don\'t know how to cope with all this stress.');
        setIsRecording(false);
      }, 3000);
    }
  };

  // Save session
  const saveSession = () => {
    if (currentSession) {
      const sessions = JSON.parse(localStorage.getItem('echoaid_sessions') || '[]');
      const completedSession = {
        ...currentSession,
        endTime: new Date()
      };
      sessions.push(completedSession);
      localStorage.setItem('echoaid_sessions', JSON.stringify(sessions));
      
      setSessionStats(prev => ({
        ...prev,
        totalSessions: prev.totalSessions + 1
      }));
      
      localStorage.setItem('echoaid_session_stats', JSON.stringify({
        ...sessionStats,
        totalSessions: sessionStats.totalSessions + 1
      }));
    }
  };

  // Export session
  const exportSession = () => {
    if (currentSession) {
      const data = {
        session: currentSession,
        stats: sessionStats,
        progress: {
          wellnessScore,
          streak,
          level,
          xp
        }
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `echoaid-session-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header with stats */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">Wellness Coach</h1>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Activity className="h-4 w-4" />
                <span>Level {level}</span>
                <span>•</span>
                <span>{xp} XP</span>
                <span>•</span>
                <span>🔥 {streak} day streak</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{wellnessScore}</div>
                <div className="text-xs text-white/70">Wellness Score</div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={wellnessScore > 80 ? '#10b981' : wellnessScore > 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="2"
                    strokeDasharray={`${wellnessScore} 100`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main area with tabs */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* Tabs */}
              <div className="border-b border-white/10 px-4 pt-3">
                <div className="inline-flex bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setActiveView('chat')}
                    className={`px-4 py-1 rounded-md text-sm ${
                      activeView === 'chat' ? 'bg-purple-600 text-white' : 'text-white/70'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveView('checkin')}
                    className={`px-4 py-1 rounded-md text-sm ${
                      activeView === 'checkin' ? 'bg-purple-600 text-white' : 'text-white/70'
                    } ml-1`}
                  >
                    Check-in
                  </button>
                </div>
              </div>

              {/* Body */}
              {activeView === 'chat' ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white'} rounded-lg p-3`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {message.type === 'ai' ? (
                            <Brain className="h-4 w-4 text-purple-400" />
                          ) : (
                            <Heart className="h-4 w-4 text-white" />
                          )}
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.confidence && (
                            <span className="text-xs opacity-50">
                              {Math.round(message.confidence * 100)}% confidence
                            </span>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.emotions && message.emotions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.emotions.map((emotion, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-white/10 rounded-full text-xs"
                              >
                                {emotion}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/10 text-white rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              ) : (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <button onClick={() => recordMood('Good')} className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white flex flex-col items-center">
                    <Smile className="h-6 w-6 mb-1" /> Good
                  </button>
                  <button onClick={() => recordMood('Okay')} className="p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white flex flex-col items-center">
                    <Meh className="h-6 w-6 mb-1" /> Okay
                  </button>
                  <button onClick={() => recordMood('Bad')} className="p-4 bg-red-600 hover:bg-red-700 rounded-lg text-white flex flex-col items-center">
                    <Frown className="h-6 w-6 mb-1" /> Bad
                  </button>
                </div>

                <h4 className="text-white font-semibold mb-2">What are you feeling?</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {feelingsCatalog.map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleFeeling(f)}
                      className={`px-3 py-1 rounded-full text-sm border border-white/20 ${
                        selectedFeelings.includes(f) ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/80'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <textarea
                  value={checkinNote}
                  onChange={(e) => setCheckinNote(e.target.value)}
                  placeholder="Add a quick note about your feelings (optional)"
                  className="w-full min-h-[100px] bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                />

                <div className="flex gap-2">
                  <Button onClick={() => recordMood('Good')} className="bg-green-600 hover:bg-green-700">Save as Good</Button>
                  <Button onClick={() => recordMood('Okay')} className="bg-yellow-600 hover:bg-yellow-700">Save as Okay</Button>
                  <Button onClick={() => recordMood('Bad')} className="bg-red-600 hover:bg-red-700">Save as Bad</Button>
                </div>
              </div>
              )}

              {/* Input area */}
              {activeView === 'chat' && (
              <div className="border-t border-white/20 p-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Share what's on your mind..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button
                    onClick={toggleRecording}
                    className={`p-2 rounded-lg ${isRecording ? 'bg-red-500' : 'bg-purple-600'}`}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              )}
            </Card>
          </div>

          {/* Sidebar with stats and tools */}
          <div className="space-y-4">
            {/* Session stats */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Session Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Sessions</span>
                  <span className="text-white font-semibold">{sessionStats.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Messages Today</span>
                  <span className="text-white font-semibold">{sessionStats.totalMessages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Crisis Interventions</span>
                  <span className="text-white font-semibold">{sessionStats.crisisInterventions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Techniques Used</span>
                  <span className="text-white font-semibold">{sessionStats.techniquesUsed}</span>
                </div>
              </div>
            </Card>

            {/* Quick actions */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  onClick={saveSession}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save Session
                </Button>
                <Button
                  onClick={exportSession}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </Card>

            {/* Mood tracking (quick) */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Mood Check-in</h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => recordMood('Good')} className="p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white">
                  <Smile className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-xs">Good</span>
                </button>
                <button onClick={() => recordMood('Okay')} className="p-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white">
                  <Meh className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-xs">Okay</span>
                </button>
                <button onClick={() => recordMood('Bad')} className="p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white">
                  <Frown className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-xs">Bad</span>
                </button>
              </div>
              <div className="mt-3 text-white/70 text-xs">
                Avg mood today: {sessionStats.averageMood}%
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-white/70">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">First Session</span>
                </div>
                <div className="flex items-center space-x-2 text-white/70">
                  <Crown className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">7 Day Streak</span>
                </div>
                <div className="flex items-center space-x-2 text-white/70">
                  <Gem className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Crisis Helper</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Crisis Modal */}
      <AnimatePresence>
        {showCrisisModal && crisisData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCrisisModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-red-900/90 border border-red-500/30 rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <h3 className="text-xl font-bold text-white">Crisis Detected</h3>
              </div>
              
              <p className="text-white/80 mb-4">
                I've detected signs of a mental health crisis. Your safety is my top priority.
              </p>
              
              <div className="space-y-3">
                <h4 className="text-white font-semibold">Immediate Actions:</h4>
                {crisisData.immediateActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-red-400 font-bold">{index + 1}.</span>
                    <span className="text-white/90">{action}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <Button
                  onClick={() => window.open('tel:988', '_self')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call 988 Now
                </Button>
                <Button
                  onClick={() => window.open('tel:911', '_self')}
                  className="w-full bg-red-800 hover:bg-red-900 text-white"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Services
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
