import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';
import { MentalHealthResource } from '../../types';
import { Phone, Globe, MapPin, Star, ExternalLink, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

// Mock data for resources - in production, this would come from an API
const mockResources: MentalHealthResource[] = [
  {
    id: '1',
    name: 'National Suicide Prevention Lifeline',
    type: 'hotline',
    description: '24/7 crisis support and suicide prevention',
    phone: '1-800-273-8255',
    website: 'https://suicidepreventionlifeline.org',
    rating: 4.9,
    tags: ['crisis', 'suicide-prevention', '24-7'],
  },
  {
    id: '2',
    name: 'Crisis Text Line',
    type: 'hotline',
    description: 'Text HOME to 741741 for crisis support',
    phone: '741741',
    website: 'https://www.crisistextline.org',
    rating: 4.8,
    tags: ['crisis', 'text-support', '24-7'],
  },
  {
    id: '3',
    name: 'Teen Line',
    type: 'hotline',
    description: 'Peer support for teens by teens',
    phone: '1-310-855-4673',
    website: 'https://teenline.org',
    rating: 4.7,
    tags: ['teen-support', 'peer-support'],
  },
  {
    id: '4',
    name: 'Local Counseling Center',
    type: 'counseling',
    description: 'Professional mental health counseling services',
    phone: '555-0123',
    website: 'https://localcounseling.com',
    distance: 2.5,
    rating: 4.6,
    tags: ['counseling', 'therapy', 'local'],
  },
  {
    id: '5',
    name: 'Youth Support Group',
    type: 'support-group',
    description: 'Weekly support group for young people',
    phone: '555-0456',
    website: 'https://youthsupport.org',
    distance: 1.8,
    rating: 4.5,
    tags: ['support-group', 'youth', 'weekly'],
  },
  {
    id: '6',
    name: 'Headspace',
    type: 'app',
    description: 'Meditation and mindfulness app',
    website: 'https://headspace.com',
    rating: 4.8,
    tags: ['meditation', 'mindfulness', 'app'],
  },
  {
    id: '7',
    name: 'Calm',
    type: 'app',
    description: 'Sleep and meditation app',
    website: 'https://calm.com',
    rating: 4.7,
    tags: ['sleep', 'meditation', 'app'],
  },
  {
    id: '8',
    name: 'BetterHelp',
    type: 'app',
    description: 'Online therapy and counseling',
    website: 'https://betterhelp.com',
    rating: 4.6,
    tags: ['online-therapy', 'counseling', 'app'],
  },
];

export const MentalHealthResources: React.FC = () => {
  const { language } = useTheme();
  const [resources, setResources] = useState<MentalHealthResource[]>(mockResources);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(resource => {
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotline':
        return <Phone className="h-5 w-5 text-error-600" />;
      case 'counseling':
        return <Heart className="h-5 w-5 text-primary-600" />;
      case 'support-group':
        return <MapPin className="h-5 w-5 text-secondary-600" />;
      case 'app':
        return <Globe className="h-5 w-5 text-success-600" />;
      default:
        return <Heart className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hotline':
        return 'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-700';
      case 'counseling':
        return 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700';
      case 'support-group':
        return 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-700';
      case 'app':
        return 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-700';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700';
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleVisit = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('mentalHealthResources', language)}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find support and resources for your mental health journey
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'hotline', 'counseling', 'support-group', 'app'].map(type => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {t(type, language)}
            </Button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <div
            key={resource.id}
            className={`card border-2 ${getTypeColor(resource.type)} transition-all duration-200 hover:shadow-lg`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getTypeIcon(resource.type)}
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {t(resource.type, language)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-warning-500 fill-current" />
                <span className="text-sm font-medium">{resource.rating}</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              {resource.name}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              {resource.description}
            </p>

            {resource.distance && (
              <div className="flex items-center space-x-1 mb-4 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{resource.distance} miles away</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {resource.phone && (
                <Button
                  onClick={() => handleCall(resource.phone!)}
                  size="sm"
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  {t('call', language)}
                </Button>
              )}
              {resource.website && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVisit(resource.website!)}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  {t('visit', language)}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Section */}
      <div className="card bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-700">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-error-800 dark:text-error-200 mb-2">
            {t('emergencySupport', language)}
          </h2>
          <p className="text-error-700 dark:text-error-300 mb-4">
            {t('emergencyDescription', language)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleCall('911')}
              variant="destructive"
              className="flex items-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              {t('call911', language)}
            </Button>
            <Button
              onClick={() => handleCall('1-800-273-8255')}
              variant="destructive"
              className="flex items-center"
            >
              <Heart className="h-4 w-4 mr-2" />
              {t('suicidePrevention', language)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 