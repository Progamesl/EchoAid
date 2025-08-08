import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface CinematicLoaderProps {
  onComplete: () => void;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Phase progression
  useEffect(() => {
    const phases = [
      { duration: 800, text: "Initializing" },
      { duration: 600, text: "Loading" },
      { duration: 600, text: "Ready" }
    ];

    if (currentPhase < phases.length) {
      const timer = setTimeout(() => {
        setCurrentPhase(prev => prev + 1);
      }, phases[currentPhase].duration);

      return () => clearTimeout(timer);
    } else {
      setTimeout(onComplete, 500);
    }
  }, [currentPhase, onComplete]);

  const phases = [
    { text: "Initializing", progress: 33 },
    { text: "Loading", progress: 66 },
    { text: "Ready", progress: 100 }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-purple-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">EchoAid</h1>
          </div>
          <p className="text-slate-300 text-sm">Mental Health Wellness Platform</p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="w-full bg-slate-700 rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: `${phases[currentPhase]?.progress || 0}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Status Text */}
        <AnimatePresence mode="wait">
          {currentPhase < phases.length && (
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-slate-300 text-sm font-medium"
            >
              {phases[currentPhase]?.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle Loading Indicator */}
        <motion.div
          className="flex justify-center space-x-1 mt-6"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};
