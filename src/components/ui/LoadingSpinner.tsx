import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ring' | 'dots';
  color?: string;
  className?: string;
}

export const __getSpinnerSizeClass = (size: 'sm' | 'md' | 'lg') => ({
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
}[size]);

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'ring',
  color = '#8b5cf6',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (variant === 'ring') {
    return (
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-slate-200 border-t-purple-500', 
          sizeClasses[size], 
          className
        )}
        style={{ borderTopColor: color }}
      />
    );
  }

  return (
    <div className={cn('flex space-x-1', className)}>
      <div 
        className={cn('animate-pulse rounded-full', sizeClasses[size])} 
        style={{ backgroundColor: color, animationDelay: '0ms' }} 
      />
      <div 
        className={cn('animate-pulse rounded-full', sizeClasses[size])} 
        style={{ backgroundColor: color, animationDelay: '150ms' }} 
      />
      <div 
        className={cn('animate-pulse rounded-full', sizeClasses[size])} 
        style={{ backgroundColor: color, animationDelay: '300ms' }} 
      />
    </div>
  );
};
