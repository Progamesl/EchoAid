import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LocalAuthProvider } from './contexts/LocalAuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { SettingsPage } from './pages/SettingsPage';
import { JournalDashboard } from './components/journal/JournalDashboard';
import { EmotionHeatmap } from './components/history/EmotionHeatmap';
import { MentalHealthResources } from './components/resources/MentalHealthResources';
import SocialImpactDashboard from './components/social/SocialImpactDashboard';
import AIWellnessCoach from './components/ai/AIWellnessCoach';
import { WellnessChallenges } from './components/wellness/WellnessChallenges';
import { Navigation } from './components/layout/Navigation';

import { CustomCursor } from './components/ui/CustomCursor';
import { CinematicLoader } from './components/ui/CinematicLoader';
import { motion } from 'framer-motion';

import './index.css';

function App() {
  const [showLoader, setShowLoader] = useState(true);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  return (
    <Router>
      <LocalAuthProvider>
        <ThemeProvider>
          <div className="App">
            {/* Skip link for accessibility */}
            <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
              Skip to main content
            </a>
            
            <CustomCursor />
            
            {showLoader ? (
              <CinematicLoader onComplete={handleLoaderComplete} />
            ) : (
              <motion.div 
                className="min-h-screen" 
                style={{ 
                  background: 'var(--bg-primary, #0f172a)',
                  color: 'var(--text-primary, #f1f5f9)'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
              >
                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.5,
                    ease: "easeOut"
                  }}
                >
                  <Navigation />
                </motion.div>
                <motion.main 
                  id="main-content" 
                  className="container mx-auto px-4 py-8"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.8,
                    ease: "easeOut"
                  }}
                >
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<Navigate to="/" replace />} />
                    <Route path="/journal" element={<JournalDashboard />} />
                    <Route path="/history" element={<EmotionHeatmap />} />
                    <Route path="/resources" element={<MentalHealthResources />} />
                    <Route path="/impact" element={<SocialImpactDashboard />} />
                    <Route path="/coach" element={<AIWellnessCoach />} />
                    <Route path="/challenges" element={<WellnessChallenges />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </motion.main>
              </motion.div>
            )}
          </div>
        </ThemeProvider>
      </LocalAuthProvider>
    </Router>
  );
}

export default App;
