import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocalAuth } from '../../contexts/LocalAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Heart, 
  Settings, 
  Menu, 
  X,
  Sun,
  Moon,
  MessageCircle,
  Shield,
  AlertTriangle,
  Phone,
  ExternalLink,
  X as CloseIcon,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../../types';

export const Navigation: React.FC = () => {
  const { user } = useLocalAuth();
  const { language, theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: t('home', language), href: '/', icon: Home },
    { name: t('journal', language), href: '/journal', icon: BookOpen },
    { name: 'Coach', href: '/coach', icon: MessageCircle },
    { name: 'Challenges', href: '/challenges', icon: Target },
    { name: t('history', language), href: '/history', icon: Calendar },
    { name: t('resources', language), href: '/resources', icon: Heart },
    { name: t('settings', language), href: '/settings', icon: Settings },
  ];

  const crisisResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 crisis support',
      action: 'call',
      color: 'text-red-400'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Text-based crisis support',
      action: 'text',
      color: 'text-blue-400'
    },
    {
      name: 'Emergency Services',
      number: '911',
      description: 'Immediate emergency assistance',
      action: 'call',
      color: 'text-red-500'
    }
  ];

  const handleCrisisHelp = () => {
    setShowCrisisModal(true);
  };

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleText = (number: string) => {
    // For text line, open SMS app
    window.open(`sms:${number}`, '_self');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-white text-xl font-bold" aria-label="EchoAid Home">
                EchoAid
              </Link>
              
              <div className="flex space-x-6" role="navigation" aria-label="Main navigation">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleCrisisHelp}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mobile-touch-target"
                aria-label="Get immediate crisis help"
              >
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                <span>Crisis Help</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden">
        {/* Top Bar */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-white text-lg font-bold" aria-label="EchoAid Home">
              EchoAid
            </Link>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCrisisHelp}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg transition-colors mobile-touch-target"
                aria-label="Get immediate crisis help"
              >
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Crisis</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-md mobile-touch-target"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/10 backdrop-blur-md border-b border-white/20 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 mobile-touch-target ${
                        isActive
                          ? 'text-white bg-white/20 border border-white/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                <div className="border-t border-white/20 pt-3 mt-3">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTheme}
                      className="p-2 text-white/70 hover:text-white mobile-touch-target"
                    >
                      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Crisis Help Modal */}
      <AnimatePresence>
        {showCrisisModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 mobile-safe-area"
            onClick={() => setShowCrisisModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 border border-red-500/30 mobile-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <h3 className="text-xl font-bold text-white">Crisis Support</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCrisisModal(false)}
                  className="text-white/60 hover:text-white mobile-touch-target"
                >
                  <CloseIcon className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-white/80 text-sm">
                  If you're in crisis or having thoughts of self-harm, help is available 24/7. 
                  You're not alone.
                </p>

                {crisisResources.map((resource, index) => (
                  <motion.div
                    key={resource.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="glass" className="p-4 border border-white/10 hover:border-red-500/30 transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{resource.name}</h4>
                          <p className="text-white/60 text-sm mb-2">{resource.description}</p>
                          <p className={`font-mono text-lg ${resource.color}`}>{resource.number}</p>
                        </div>
                        <Button
                          onClick={() => resource.action === 'call' ? handleCall(resource.number) : handleText(resource.number)}
                          className={`flex items-center space-x-2 mobile-touch-target ${
                            resource.action === 'call' 
                              ? 'bg-red-500 hover:bg-red-600' 
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white`}
                        >
                          <Phone className="h-4 w-4" />
                          <span>{resource.action === 'call' ? 'Call Now' : 'Text Now'}</span>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-white/20">
                  <Link to="/resources">
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 mobile-touch-target">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View All Resources
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 