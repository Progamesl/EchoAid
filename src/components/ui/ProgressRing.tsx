import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};
