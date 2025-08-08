import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}) => {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white/10 backdrop-blur-md border border-white/20',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/20'
  };

  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};
