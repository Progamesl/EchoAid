import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';
import { Button } from '../ui/Button';
import { Mic, MicOff, Play, Pause, Square, Upload, Trash2, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
  onAudioReady: (audioBlob: Blob, transcription: string) => void;
  isProcessing: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onAudioReady, isProcessing }) => {
  const { language } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'es' ? 'es-ES' : 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported in this browser');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioReady(audioBlob, transcription);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      setTranscription('');
      setInterimTranscript('');

      // Start timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let currentInterim = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              currentInterim += transcript;
            }
          }

          setTranscription(finalTranscript);
          setInterimTranscript(currentInterim);
        };
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      onAudioReady(file, '');
      setError(null);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscription('');
    setInterimTranscript('');
    setDuration(0);
    setIsPlaying(false);
    setError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-4">
        {!audioBlob ? (
          <div className="flex items-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={isProcessing}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Mic className="h-5 w-5" />
                <span>{t('startRecording', language)}</span>
              </Button>
            ) : (
              <>
                <Button
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  <span>{isPaused ? t('resumeRecording', language) : t('pauseRecording', language)}</span>
                </Button>
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="flex items-center space-x-2"
                >
                  <Square className="h-5 w-5" />
                  <span>{t('stopRecording', language)}</span>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button
              onClick={isPlaying ? pauseAudio : playAudio}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span>{isPlaying ? t('pause', language) : t('play', language)}</span>
            </Button>
            <Button
              onClick={resetRecording}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-5 w-5" />
              <span>{t('delete', language)}</span>
            </Button>
          </div>
        )}

        {/* Upload Option */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">{t('or', language)}</span>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessing}
            />
            <Button variant="outline" className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>{t('uploadAudio', language)}</span>
            </Button>
          </label>
        </div>

        {/* Timer */}
        {isRecording && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-2xl font-mono text-primary-600 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2"
          >
            {formatTime(duration)}
          </motion.div>
        )}

        {/* Status Indicators */}
        <div className="flex items-center space-x-4">
          {isRecording && (
            <div className="flex items-center space-x-2 text-sm text-primary-600">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
              <span>{t('recordingInProgress', language)}</span>
            </div>
          )}
          {isListening && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-3 h-3 bg-green-500 rounded-full"
              />
              <span>Listening...</span>
            </div>
          )}
        </div>
      </div>

      {/* Audio Player */}
      {audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            className="w-full"
            controls
          />
        </motion.div>
      )}

      {/* Live Transcription */}
      {(isRecording || transcription || interimTranscript) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {isRecording ? 'Live Transcription' : 'Transcription'}
          </label>
          <div className="relative">
            <textarea
              value={transcription + (isRecording ? interimTranscript : '')}
              onChange={(e) => setTranscription(e.target.value)}
              className="input-field min-h-[120px] resize-none w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-white placeholder-white/60"
              placeholder={isRecording ? "Speaking..." : "Transcription will appear here..."}
              readOnly={isRecording}
            />
            {isRecording && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"
              />
            )}
          </div>
          {isRecording && (
            <p className="text-xs text-gray-500">
              Live transcription in progress...
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}; 