import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { Heart, Brain, Lightbulb } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              EchoAid
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered emotional wellness platform for teens and students
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {isLogin ? (
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Heart className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Voice Journaling
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Record your thoughts and feelings with voice recognition
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Brain className="h-6 w-6 text-secondary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              AI Analysis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get emotional insights and personalized recommendations
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="h-6 w-6 text-warning-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Wellness Resources
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access mental health resources and support networks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 