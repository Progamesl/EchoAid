import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';
import { JournalEntry, AIAnalysis } from '../../types';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Save, 
  Trash2, 
  Edit3, 
  Heart, 
  Brain, 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  BookOpen, 
  MessageCircle, 
  Activity, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Plus, 
  X, 
  Check, 
  AlertCircle, 
  Lightbulb, 
  Quote, 
  Users, 
  Globe, 
  Shield, 
  Zap as ZapIcon,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  Activity as ActivityIcon,
  Heart as HeartIcon,
  Brain as BrainIcon,
  Sparkles as SparklesIcon,
  Star as StarIcon,
  Award as AwardIcon,
  BookOpen as BookOpenIcon,
  MessageCircle as MessageCircleIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Plus as PlusIcon,
  X as XIcon,
  Check as CheckIcon,
  AlertCircle as AlertCircleIcon,
  Lightbulb as LightbulbIcon,
  Quote as QuoteIcon,
  Users as UsersIcon,
  Globe as GlobeIcon,
  Shield as ShieldIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Save as SaveIcon,
  Trash2 as Trash2Icon,
  Edit3 as Edit3Icon
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { analyzeSentiment } from '../../utils/aiAnalysis';

interface JournalMode {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  gradient: string;
}

const journalModes: JournalMode[] = [
  {
    id: 'voice',
    name: 'Voice Journal',
    icon: MicIcon,
    description: 'Speak your thoughts naturally',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'text',
    name: 'Text Journal',
    icon: Edit3Icon,
    description: 'Write your thoughts and feelings',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'mood',
    name: 'Mood Tracker',
    icon: HeartIcon,
    description: 'Track your emotional state',
    color: 'text-red-400',
    gradient: 'from-red-500 to-orange-500'
  },
  {
    id: 'gratitude',
    name: 'Gratitude Journal',
    icon: StarIcon,
    description: 'Focus on what you appreciate',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'reflection',
    name: 'Reflection Prompts',
    icon: BrainIcon,
    description: 'Deep self-reflection questions',
    color: 'text-green-400',
    gradient: 'from-green-500 to-teal-500'
  }
];

const reflectionPrompts = [
  "What made you smile today?",
  "What's something you're grateful for right now?",
  "What's a challenge you're facing and how are you handling it?",
  "What's something you learned about yourself recently?",
  "What's a goal you're working towards?",
  "What's something that's been on your mind lately?",
  "What's a small victory you had today?",
  "What's something you're looking forward to?",
  "What's a fear you're working to overcome?",
  "What's something you're proud of?"
];

export const JournalDashboard: React.FC = () => {
  const { language } = useTheme();
  const [selectedMode, setSelectedMode] = useState<JournalMode>(journalModes[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [textContent, setTextContent] = useState('');
  const [currentMood, setCurrentMood] = useState('');
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(['']);
  const [selectedPrompt, setSelectedPrompt] = useState(reflectionPrompts[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Motion values for animations
  const recordingProgress = useMotionValue(0);
  const recordingScale = useTransform(recordingProgress, [0, 1], [1, 1.1]);
  const recordingOpacity = useTransform(recordingProgress, [0, 1], [0.5, 1]);

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('echoaid_entries') || '[]');
    setEntries(savedEntries);
    setTotalEntries(savedEntries.length);
    
    // Calculate streak
    const today = new Date().toDateString();
    let currentStreak = 0;
    let lastEntryDate = '';
    
    for (let i = savedEntries.length - 1; i >= 0; i--) {
      const entryDate = new Date(savedEntries[i].createdAt).toDateString();
      if (entryDate === today || (lastEntryDate && new Date(entryDate).getTime() === new Date(lastEntryDate).getTime() - 86400000)) {
        currentStreak++;
        lastEntryDate = entryDate;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, []);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        // Here you would typically send the audio to a transcription service
        setTranscription("Your voice has been recorded and will be transcribed here...");
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (mediaRecorder.current) {
      if (isPaused) {
        mediaRecorder.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorder.current.pause();
        setIsPaused(true);
      }
    }
  };

  // Analyze content
  const analyzeContent = async () => {
    const content = transcription || textContent || currentMood || gratitudeItems.join(', ') || selectedPrompt;
    if (!content.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeSentiment(content);
      setAnalysis(result);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save entry
  const saveEntry = () => {
    const content = transcription || textContent || currentMood || gratitudeItems.join(', ') || selectedPrompt;
    if (!content.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      userId: 'guest',
      content,
      transcription: transcription || '',
      sentiment: analysis?.sentiment || { score: 0, label: 'neutral', emotions: [], confidence: 0 },
      aiSummary: analysis ? {
        summary: analysis.summary,
        quote: analysis.quote,
        mood: analysis.mood,
        suggestions: analysis.suggestions,
        keywords: analysis.keywords
      } : {
        summary: '',
        quote: '',
        mood: '',
        suggestions: [],
        keywords: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    setTotalEntries(updatedEntries.length);
    localStorage.setItem('echoaid_entries', JSON.stringify(updatedEntries));

    // Reset form
    setTranscription('');
    setTextContent('');
    setCurrentMood('');
    setGratitudeItems(['']);
    setAnalysis(null);
    setShowAnalysis(false);
  };

  // Add gratitude item
  const addGratitudeItem = () => {
    setGratitudeItems([...gratitudeItems, '']);
  };

  // Update gratitude item
  const updateGratitudeItem = (index: number, value: string) => {
    const updated = [...gratitudeItems];
    updated[index] = value;
    setGratitudeItems(updated);
  };

  // Remove gratitude item
  const removeGratitudeItem = (index: number) => {
    if (gratitudeItems.length > 1) {
      setGratitudeItems(gratitudeItems.filter((_, i) => i !== index));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
            Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Journal</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Express yourself, track your journey, and discover insights about your emotional wellness
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <Card variant="glass" className="p-6 text-center border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{totalEntries}</h3>
            <p className="text-white/80">Total Entries</p>
          </Card>

          <Card variant="glass" className="p-6 text-center border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUpIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{streak}</h3>
            <p className="text-white/80">Day Streak</p>
          </Card>

          <Card variant="glass" className="p-6 text-center border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TargetIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{weeklyProgress}/{weeklyGoal}</h3>
            <p className="text-white/80">Weekly Goal</p>
          </Card>

          <Card variant="glass" className="p-6 text-center border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AwardIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">4.9</h3>
            <p className="text-white/80">Wellness Score</p>
          </Card>
        </motion.div>

        {/* Journal Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Journal Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {journalModes.map((mode) => (
              <motion.div
                key={mode.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMode(mode)}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedMode.id === mode.id ? 'ring-2 ring-purple-400' : ''
                }`}
              >
                <Card variant="glass" className="p-6 text-center border border-white/10 hover:border-purple-400/50">
                  <div className={`w-16 h-16 bg-gradient-to-r ${mode.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <mode.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{mode.name}</h3>
                  <p className="text-white/70 text-sm">{mode.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Journal Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Journal Area */}
          <div className="lg:col-span-2">
            <Card variant="glass" className="p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${selectedMode.gradient} rounded-xl flex items-center justify-center`}>
                    <selectedMode.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedMode.name}</h3>
                    <p className="text-white/70">{selectedMode.description}</p>
                  </div>
                </div>
              </div>

              {/* Voice Journal */}
              {selectedMode.id === 'voice' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
                      className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      {isRecording ? (
                        <MicOffIcon className="w-12 h-12 text-white" />
                      ) : (
                        <MicIcon className="w-12 h-12 text-white" />
                      )}
                    </motion.div>
                    
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      {!isRecording ? (
                        <Button
                          onClick={startRecording}
                          size="lg"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <MicIcon className="w-5 h-5 mr-2" />
                          Start Recording
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={togglePause}
                            variant="outline"
                            size="lg"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            {isPaused ? <PlayIcon className="w-5 h-5 mr-2" /> : <PauseIcon className="w-5 h-5 mr-2" />}
                            {isPaused ? 'Resume' : 'Pause'}
                          </Button>
                          <Button
                            onClick={stopRecording}
                            size="lg"
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <MicOffIcon className="w-5 h-5 mr-2" />
                            Stop Recording
                          </Button>
                        </>
                      )}
                    </div>

                    {isRecording && (
                      <div className="text-center">
                        <div className="text-3xl font-mono text-white mb-2">{formatTime(recordingTime)}</div>
                        <div className="text-white/60">Recording in progress...</div>
                      </div>
                    )}

                    {transcription && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-white mb-3">Transcription</h4>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <p className="text-white/90">{transcription}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text Journal */}
              {selectedMode.id === 'text' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-3">How are you feeling today?</label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Write your thoughts, feelings, and experiences here..."
                      className="w-full h-48 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Mood Tracker */}
              {selectedMode.id === 'mood' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-3">How are you feeling right now?</label>
                    <textarea
                      value={currentMood}
                      onChange={(e) => setCurrentMood(e.target.value)}
                      placeholder="Describe your current emotional state..."
                      className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-3">Mood Scale (1-10)</label>
                    <div className="flex items-center space-x-4">
                      <span className="text-white/60">😢</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        className="flex-1"
                      />
                      <span className="text-white/60">😊</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Gratitude Journal */}
              {selectedMode.id === 'gratitude' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-3">What are you grateful for today?</label>
                    {gratitudeItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 mb-3">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateGratitudeItem(index, e.target.value)}
                          placeholder={`Gratitude item ${index + 1}...`}
                          className="flex-1 bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        {gratitudeItems.length > 1 && (
                          <Button
                            onClick={() => removeGratitudeItem(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      onClick={addGratitudeItem}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>
              )}

              {/* Reflection Prompts */}
              {selectedMode.id === 'reflection' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-3">Reflection Prompt</label>
                    <select
                      value={selectedPrompt}
                      onChange={(e) => setSelectedPrompt(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {reflectionPrompts.map((prompt, index) => (
                        <option key={index} value={prompt} className="bg-gray-800 text-white">
                          {prompt}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-3">Your Reflection</label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Write your reflection here..."
                      className="w-full h-48 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <Button
                  onClick={analyzeContent}
                  disabled={isAnalyzing}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {isAnalyzing ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <BrainIcon className="w-5 h-5 mr-2" />
                  )}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
                </Button>

                <Button
                  onClick={saveEntry}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                >
                  <SaveIcon className="w-5 h-5 mr-2" />
                  Save Entry
                </Button>
              </div>
            </Card>
          </div>

          {/* Analysis Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {showAnalysis && analysis && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <Card variant="glass" className="p-6 border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <BrainIcon className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">Insights</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Mood Summary</h4>
                        <p className="text-white/80 text-sm">{analysis.summary}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Detected Emotions</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.emotions.map((emotion, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                            >
                              {emotion}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Suggested Actions</h4>
                        <ul className="space-y-2">
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-white/80 text-sm flex items-start space-x-2">
                              <SparklesIcon className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-4 border-t border-white/10">
                        <h4 className="text-white font-medium mb-2">Quote of the Day</h4>
                        <blockquote className="text-white/90 text-sm italic">
                          "{analysis.quote}"
                        </blockquote>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Recent Entries */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Recent Entries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entries.slice(0, 6).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="glass" className="p-6 hover:scale-105 transition-transform duration-300 border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <QuoteIcon className="h-5 w-5 text-purple-400" />
                      <span className="text-white/60 text-sm">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/90 line-clamp-3 mb-4">
                      {entry.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entry.sentiment?.label === 'positive' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : entry.sentiment?.label === 'negative'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}>
                        {entry.sentiment?.label || 'neutral'}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full pulse-glow"></div>
                        <span className="text-white/60 text-xs">Analyzed</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 