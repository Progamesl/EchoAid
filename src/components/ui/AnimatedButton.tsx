import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface AnimatedButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  variant = 'default',
  size = 'md',
  icon,
  children,
  className,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    ghost: 'text-white hover:bg-white/10 focus:ring-white/20',
    outline: 'border border-white/20 text-white hover:bg-white/10 focus:ring-white/20'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};
