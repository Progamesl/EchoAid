import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';
import { Button } from '../ui/Button';
import { Mic, MicOff, Play, Pause, Square, Upload, Trash2 } from 'lucide-react';

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
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [language]);

  const startRecording = async () => {
    try {
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

      // Start timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscription(finalTranscript + interimTranscript);
        };
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
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
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
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
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscription('');
    setDuration(0);
    setIsPlaying(false);
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
      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-4">
        {!audioBlob ? (
          <div className="flex items-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={isProcessing}
                className="flex items-center space-x-2"
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
              className="flex items-center space-x-2"
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
          <div className="text-2xl font-mono text-primary-600">
            {formatTime(duration)}
          </div>
        )}

        {/* Status */}
        {isRecording && (
          <div className="flex items-center space-x-2 text-sm text-primary-600">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
            <span>{t('recordingInProgress', language)}</span>
          </div>
        )}
      </div>

      {/* Audio Player */}
      {audioUrl && (
        <div className="w-full">
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            className="w-full"
            controls
          />
        </div>
      )}

      {/* Transcription */}
      {transcription && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('transcription', language)}
          </label>
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            className="input-field min-h-[100px] resize-none"
            placeholder={t('transcriptionPlaceholder', language)}
          />
        </div>
      )}
    </div>
  );
}; 