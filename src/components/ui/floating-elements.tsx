import React from 'react';
import { motion } from 'framer-motion';

interface FloatingElementsProps {
  count?: number;
  size?: 'small' | 'medium' | 'large';
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({ 
  count = 6, 
  size = 'small' 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'large': return 'w-4 h-4';
      case 'medium': return 'w-3 h-3';
      default: return 'w-2 h-2';
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-sm ${getSizeClass()}`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};