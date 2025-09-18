import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  className = '', 
  animated = false 
}) => {
  const baseClasses = "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent";
  
  if (animated) {
    return (
      <motion.span
        className={`${baseClasses} ${className}`}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={`${baseClasses} ${className}`}>
      {children}
    </span>
  );
};