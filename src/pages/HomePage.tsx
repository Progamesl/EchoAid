import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLocalAuth } from '../contexts/LocalAuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Heart, 
  Brain, 
  Shield, 
  Target, 
  Sparkles, 
  Star, 
  Zap, 
  Globe,
  ArrowRight,
  Play,
  BookOpen,
  MessageCircle
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useLocalAuth();

  const floatingElements = [
    { icon: Heart, delay: 0, color: "#ef4444" },
    { icon: Brain, delay: 0.5, color: "#8b5cf6" },
    { icon: Shield, delay: 1, color: "#10b981" },
    { icon: Target, delay: 1.5, color: "#f59e0b" },
    { icon: Sparkles, delay: 2, color: "#06b6d4" },
    { icon: Star, delay: 2.5, color: "#ec4899" },
  ];

  const features = [
    {
      title: "Wellness Coach",
      description: "Personalized mental health support powered by advanced AI",
      icon: MessageCircle,
      color: "from-purple-500 to-pink-500",
      href: "/coach"
    },
    {
      title: "Voice Journal",
      description: "Express your thoughts through voice and get instant insights",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      href: "/journal"
    },
    {
      title: "Wellness Challenges",
      description: "Gamified mental health activities to boost your mood",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      href: "/challenges"
    },
    {
      title: "Crisis Support",
      description: "Immediate help and resources when you need them most",
      icon: Shield,
      color: "from-red-500 to-orange-500",
      href: "/resources"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floating Background Elements - Hidden on mobile for performance */}
      <div className="absolute inset-0 pointer-events-none mobile-hidden">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${20 + (index * 15) % 60}%`,
              top: `${30 + (index * 20) % 50}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <element.icon 
              className="h-8 w-8 opacity-20" 
              style={{ color: element.color }}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 mobile-spacing">
        {/* Hero Section */}
        <motion.div 
          className="text-center py-12 md:py-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="mb-6 md:mb-8"
            animate={{ 
              scale: [1, 1.02, 1],
              rotate: [0, 0.5, -0.5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent leading-tight">
              ECHOAID
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Your personalized mental wellness companion
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
              <Link to="/coach" className="w-full sm:w-auto">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 md:px-8 md:py-4 text-base md:text-lg mobile-button mobile-touch-target w-full sm:w-auto">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Open Coach
                </Button>
              </Link>
              <Link to="/journal" className="w-full sm:w-auto">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 md:px-8 md:py-4 text-base md:text-lg mobile-button mobile-touch-target w-full sm:w-auto">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Voice Journal
                </Button>
              </Link>
              <Link to="/challenges" className="w-full sm:w-auto">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 md:px-8 md:py-4 text-base md:text-lg mobile-button mobile-touch-target w-full sm:w-auto">
                  <Target className="h-5 w-5 mr-2" />
                  Wellness Challenges
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          id="features"
          className="mobile-grid max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.5 + index * 0.2 }}
              whileHover={{ 
                scale: 1.02,
                rotateY: 2,
                transition: { duration: 0.3 }
              }}
            >
              <Link to={feature.href} className="block h-full">
                <Card className="mobile-card h-full cursor-pointer group hover:bg-white/10 transition-all duration-300 mobile-touch-target">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} mr-4 mb-3 sm:mb-0 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-white/70 text-base md:text-lg mb-4 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center text-white/60 group-hover:text-white transition-colors duration-300 mt-auto">
                    <span className="mr-2">Explore</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="mt-16 md:mt-20 text-center flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 md:mb-12 text-center">Why Choose EchoAid?</h2>
          <div className="mobile-grid max-w-4xl mx-auto flex justify-center">
            {[
              { number: "24/7", label: "Always Available", icon: Globe },
              { number: "Personalized", label: "Support Tailored to You", icon: Brain },
              { number: "Crisis-Ready", label: "Emergency Help", icon: Shield }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center mobile-card flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <stat.icon className="h-10 w-10 md:h-12 md:w-12 text-purple-400 mx-auto mb-4" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">{stat.number}</div>
                <div className="text-white/70 text-sm md:text-base text-center">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mobile-optimized bottom spacing */}
        <div className="h-20 md:h-32"></div>
      </div>
    </div>
  );
}; 