import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';
import { MentalHealthResource } from '../../types';
import { 
  Phone, 
  Globe, 
  Star, 
  ExternalLink, 
  Heart, 
  Users, 
  Search,
  AlertTriangle,
  Filter,
  BookOpen,
  Brain,
  Shield,
  MessageCircle,
  Video,
  Calendar,
  MapPin,
  Clock,
  Award,
  Zap,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Home,
  Smartphone,
  Monitor,
  Headphones,
  Camera,
  Mail,
  MessageSquare,
  PhoneCall,
  VideoIcon,
  MessageCircle as ChatIcon,
  Globe as WebIcon,
  Book as BookIcon,
  Users as GroupIcon,
  Heart as TherapyIcon,
  Brain as MeditationIcon,
  Shield as SafetyIcon,
  Zap as CrisisIcon
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

// Comprehensive mental health resources data
const resources: MentalHealthResource[] = [
  // Crisis Resources
  {
    id: 'crisis-1',
    name: 'National Suicide Prevention Lifeline',
    type: 'crisis',
    category: 'emergency',
    description: '24/7 crisis support and suicide prevention. Call or text 988 for immediate help.',
    phone: '988',
    website: 'https://988lifeline.org',
    rating: 4.9,
    tags: ['crisis', 'suicide-prevention', '24-7', 'free', 'immediate'],
    availability: '24/7',
    cost: 'Free',
    languages: ['English', 'Spanish'],
  },
  {
    id: 'crisis-2',
    name: 'Crisis Text Line',
    type: 'crisis',
    category: 'emergency',
    description: 'Text HOME to 741741 for immediate crisis support via text message.',
    phone: '741741',
    website: 'https://www.crisistextline.org',
    rating: 4.8,
    tags: ['crisis', 'text-support', '24-7', 'free', 'immediate'],
    availability: '24/7',
    cost: 'Free',
    languages: ['English'],
  },
  {
    id: 'crisis-3',
    name: 'Emergency Services',
    type: 'crisis',
    category: 'emergency',
    description: 'For immediate life-threatening emergencies, call 911.',
    phone: '911',
    rating: 5.0,
    tags: ['emergency', 'immediate', 'life-threatening'],
    availability: '24/7',
    cost: 'Free',
    languages: ['English'],
  },
  
  // Therapy & Counseling
  {
    id: 'therapy-1',
    name: 'BetterHelp',
    type: 'therapy',
    category: 'professional',
    description: 'Online therapy with licensed professionals. Video, phone, and chat sessions available.',
    website: 'https://betterhelp.com',
    rating: 4.5,
    tags: ['online-therapy', 'licensed', 'video', 'chat', 'phone'],
    availability: '24/7',
    cost: 'Sliding scale',
    languages: ['English'],
  },
  {
    id: 'therapy-2',
    name: 'Talkspace',
    type: 'therapy',
    category: 'professional',
    description: 'Online therapy platform with licensed therapists. Text, video, and voice messaging.',
    website: 'https://talkspace.com',
    rating: 4.4,
    tags: ['online-therapy', 'licensed', 'text', 'video', 'messaging'],
    availability: '24/7',
    cost: 'Subscription',
    languages: ['English'],
  },
  {
    id: 'therapy-3',
    name: 'Psychology Today Directory',
    type: 'therapy',
    category: 'professional',
    description: 'Find local therapists, psychiatrists, and treatment centers in your area.',
    website: 'https://psychologytoday.com',
    rating: 4.6,
    tags: ['local-therapy', 'directory', 'in-person', 'licensed'],
    availability: 'Varies',
    cost: 'Varies',
    languages: ['English'],
  },
  
  // Apps & Digital Tools
  {
    id: 'app-1',
    name: 'Headspace',
    type: 'app',
    category: 'wellness',
    description: 'Meditation and mindfulness app with guided sessions for stress, sleep, and anxiety.',
    website: 'https://headspace.com',
    rating: 4.8,
    tags: ['meditation', 'mindfulness', 'sleep', 'stress', 'anxiety'],
    availability: '24/7',
    cost: 'Free/Premium',
    languages: ['English', 'Spanish'],
  },
  {
    id: 'app-2',
    name: 'Calm',
    type: 'app',
    category: 'wellness',
    description: 'Meditation, sleep stories, and relaxation tools for better mental health.',
    website: 'https://calm.com',
    rating: 4.7,
    tags: ['meditation', 'sleep', 'relaxation', 'stories'],
    availability: '24/7',
    cost: 'Free/Premium',
    languages: ['English'],
  },
  {
    id: 'app-3',
    name: 'Wysa',
    type: 'app',
    category: 'digital-support',
    description: 'Digital mental health companion with mood tracking and coping techniques.',
    website: 'https://wysa.com',
    rating: 4.3,
    tags: ['digital-support', 'chat', 'mood-tracking', 'coping'],
    availability: '24/7',
    cost: 'Free/Premium',
    languages: ['English'],
  },
  {
    id: 'app-4',
    name: 'Moodfit',
    type: 'app',
    category: 'wellness',
    description: 'Mood tracking and mental health tools with personalized insights and exercises.',
    website: 'https://moodfit.com',
    rating: 4.4,
    tags: ['mood-tracking', 'mental-health', 'exercises', 'insights'],
    availability: '24/7',
    cost: 'Free/Premium',
    languages: ['English'],
  },
  
  // Support Groups
  {
    id: 'group-1',
    name: 'NAMI Support Groups',
    type: 'support-group',
    category: 'community',
    description: 'Free support groups for individuals and families affected by mental illness.',
    website: 'https://nami.org',
    rating: 4.7,
    tags: ['support-group', 'free', 'family', 'community'],
    availability: 'Weekly',
    cost: 'Free',
    languages: ['English'],
  },
  {
    id: 'group-2',
    name: 'Depression and Bipolar Support Alliance',
    type: 'support-group',
    category: 'community',
    description: 'Peer-led support groups for depression and bipolar disorder.',
    website: 'https://dbsalliance.org',
    rating: 4.6,
    tags: ['support-group', 'depression', 'bipolar', 'peer-led'],
    availability: 'Weekly',
    cost: 'Free',
    languages: ['English'],
  },
  
  // Educational Resources
  {
    id: 'education-1',
    name: 'MentalHealth.gov',
    type: 'education',
    category: 'information',
    description: 'Government resource with information about mental health conditions and treatment.',
    website: 'https://mentalhealth.gov',
    rating: 4.5,
    tags: ['education', 'government', 'information', 'treatment'],
    availability: '24/7',
    cost: 'Free',
    languages: ['English'],
  },
  {
    id: 'education-2',
    name: 'NIMH',
    type: 'education',
    category: 'information',
    description: 'National Institute of Mental Health - research and information about mental health.',
    website: 'https://nimh.nih.gov',
    rating: 4.8,
    tags: ['research', 'education', 'government', 'information'],
    availability: '24/7',
    cost: 'Free',
    languages: ['English'],
  },
  
  // Specialized Support
  {
    id: 'specialized-1',
    name: 'Trevor Project',
    type: 'specialized',
    category: 'lgbtq',
    description: 'Crisis intervention and suicide prevention for LGBTQ+ youth.',
    phone: '1-866-488-7386',
    website: 'https://thetrevorproject.org',
    rating: 4.9,
    tags: ['lgbtq', 'youth', 'crisis', 'suicide-prevention'],
    availability: '24/7',
    cost: 'Free',
    languages: ['English'],
  },
  {
    id: 'specialized-2',
    name: 'Veterans Crisis Line',
    type: 'specialized',
    category: 'veterans',
    description: 'Confidential support for veterans in crisis and their families.',
    phone: '1-800-273-8255',
    website: 'https://veteranscrisisline.net',
    rating: 4.7,
    tags: ['veterans', 'crisis', 'confidential', 'family'],
    availability: '24/7',
    cost: 'Free',
    languages: ['English'],
  },
  
  // Self-Help Tools
  {
    id: 'self-help-1',
    name: 'MoodGYM',
    type: 'self-help',
    category: 'tools',
    description: 'Interactive online program teaching cognitive behavioral therapy techniques.',
    website: 'https://moodgym.com.au',
    rating: 4.2,
    tags: ['cbt', 'self-help', 'interactive', 'education'],
    availability: '24/7',
    cost: 'Free',
    languages: ['English'],
  },
  {
    id: 'self-help-2',
    name: 'This Way Up',
    type: 'self-help',
    category: 'tools',
    description: 'Online courses for anxiety, depression, and other mental health conditions.',
    website: 'https://thiswayup.org.au',
    rating: 4.4,
    tags: ['courses', 'anxiety', 'depression', 'self-help'],
    availability: '24/7',
    cost: 'Free/Low cost',
    languages: ['English'],
  }
];

const categories = [
  { id: 'all', name: 'All Resources', icon: Globe, color: 'text-blue-500' },
  { id: 'emergency', name: 'Emergency', icon: AlertTriangle, color: 'text-red-500' },
  { id: 'professional', name: 'Professional Help', icon: Heart, color: 'text-purple-500' },
  { id: 'wellness', name: 'Wellness Apps', icon: Brain, color: 'text-green-500' },
  { id: 'community', name: 'Support Groups', icon: Users, color: 'text-orange-500' },
  { id: 'information', name: 'Education', icon: BookOpen, color: 'text-indigo-500' },
  { id: 'lgbtq', name: 'LGBTQ+ Support', icon: Shield, color: 'text-pink-500' },
  { id: 'veterans', name: 'Veterans', icon: Award, color: 'text-yellow-500' },
  { id: 'tools', name: 'Self-Help Tools', icon: Zap, color: 'text-teal-500' }
];

export const MentalHealthResources: React.FC = () => {
  const { language } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [costFilter, setCostFilter] = useState('all');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    const matchesAvailability = availabilityFilter === 'all' || resource.availability === availabilityFilter;
    
    const matchesCost = costFilter === 'all' || resource.cost.toLowerCase().includes(costFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesAvailability && matchesCost;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crisis':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'therapy':
        return <Heart className="h-5 w-5 text-purple-500" />;
      case 'app':
        return <Smartphone className="h-5 w-5 text-green-500" />;
      case 'support-group':
        return <Users className="h-5 w-5 text-orange-500" />;
      case 'education':
        return <BookOpen className="h-5 w-5 text-indigo-500" />;
      case 'specialized':
        return <Shield className="h-5 w-5 text-pink-500" />;
      case 'self-help':
        return <Zap className="h-5 w-5 text-teal-500" />;
      default:
        return <Heart className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleVisit = (url: string) => {
    window.open(url, '_blank');
  };

  const toggleFavorite = (resourceId: string) => {
    setFavorites(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability === '24/7') return 'text-green-400';
    if (availability === 'Weekly') return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getCostColor = (cost: string) => {
    if (cost === 'Free') return 'text-green-400';
    if (cost.includes('Free')) return 'text-green-400';
    return 'text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Find Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Support</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover professional help, crisis support, and wellness resources tailored to your needs
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <category.icon className={`w-4 h-4 ${category.color}`} />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center space-x-2 border-white/20 text-white hover:bg-white/10"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-4"
              >
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Availability</option>
                  <option value="24/7">24/7</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Varies">Varies</option>
                </select>
                
                <select
                  value={costFilter}
                  onChange={(e) => setCostFilter(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Costs</option>
                  <option value="free">Free</option>
                  <option value="low">Low Cost</option>
                  <option value="sliding">Sliding Scale</option>
                  <option value="subscription">Subscription</option>
                </select>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-white/60">
            Found {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Resources Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card variant="glass" className="h-full border border-white/10 hover:border-purple-400/50 transition-all duration-300 group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(resource.type)}
                        <span className="text-xs font-medium text-white/60 uppercase">
                          {resource.type.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(resource.id)}
                          className="text-white/60 hover:text-yellow-400 transition-colors"
                        >
                          <Star className={`h-4 w-4 ${favorites.includes(resource.id) ? 'fill-current text-yellow-400' : ''}`} />
                        </button>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-white">{resource.rating}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors">
                      {resource.name}
                    </h3>

                    <p className="text-white/70 mb-4 text-sm leading-relaxed">
                      {resource.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.slice(0, 4).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 text-white/80 rounded-full text-xs border border-white/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Availability and Cost */}
                    <div className="flex items-center justify-between mb-4 text-xs">
                      <span className={`${getAvailabilityColor(resource.availability)}`}>
                        <Clock className="inline w-3 h-3 mr-1" />
                        {resource.availability}
                      </span>
                      <span className={`${getCostColor(resource.cost)}`}>
                        {resource.cost}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {resource.phone && (
                        <Button
                          onClick={() => handleCall(resource.phone!)}
                          size="sm"
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                      )}
                      {resource.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVisit(resource.website!)}
                          className="flex-1 border-white/20 text-white hover:bg-white/10"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Site
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Emergency Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <Card variant="glass" className="p-8 border-2 border-red-500/30 bg-red-500/10">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <h2 className="text-2xl font-bold text-white">Emergency Support</h2>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-white/80 mb-6 text-lg">
                If you're in crisis or having thoughts of self-harm, help is available 24/7
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => handleCall('911')}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call 911
                </Button>
                <Button
                  onClick={() => handleCall('988')}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Suicide Prevention (988)
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
