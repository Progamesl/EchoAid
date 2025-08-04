export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest: boolean;
  createdAt: Date;
  language: 'en' | 'es';
  theme: 'light' | 'dark';
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  audioUrl?: string;
  transcription: string;
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    emotions: string[];
    confidence: number;
  };
  aiSummary: {
    summary: string;
    quote: string;
    mood: string;
    suggestions: string[];
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface EmotionData {
  date: string;
  score: number;
  label: string;
  color: string;
}

export interface MentalHealthResource {
  id: string;
  name: string;
  type: 'counseling' | 'hotline' | 'support-group' | 'app';
  description: string;
  phone?: string;
  website?: string;
  distance?: number;
  rating: number;
  tags: string[];
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: 'en' | 'es';
  theme: 'light' | 'dark';
  notifications: boolean;
}

export interface NotificationSettings {
  journalReminders: boolean;
  wellnessTips: boolean;
  moodCheckins: boolean;
  time: string;
  timezone: string;
}

export interface VoiceRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
}

export interface AIAnalysis {
  sentiment: {
    score: number;
    label: SentimentLabel;
    emotions: string[];
    confidence: number;
  };
  emotions: string[]; // Add top-level emotions for easier access
  summary: string;
  quote: string;
  mood: string;
  suggestions: string[];
  keywords: string[];
}

export type Language = 'en' | 'es';
export type Theme = 'light' | 'dark';
export type SentimentLabel = 'positive' | 'negative' | 'neutral';

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
} 