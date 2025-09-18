import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'subtle' | 'vibrant' | 'hero';
  children?: React.ReactNode;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  variant = 'subtle', 
  children 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return 'from-indigo-600/20 via-purple-600/10 to-pink-600/20';
      case 'vibrant':
        return 'from-indigo-500/15 via-purple-500/10 to-pink-500/15';
      default:
        return 'from-indigo-500/10 via-purple-500/8 to-pink-500/10';
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient overlay (restored to original continuous animation) */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${getVariantStyles()}`}
        animate={{
          background: [
            `linear-gradient(45deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.12))`,
            `linear-gradient(225deg, rgba(139, 92, 246, 0.12), rgba(236, 72, 153, 0.08), rgba(99, 102, 241, 0.12))`,
            `linear-gradient(45deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.12))`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Floating orbs (restored 3 orbs; slightly higher opacity for light mode visibility) */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-xl ${
            i === 0 ? 'w-64 h-64 bg-indigo-400/20 dark:bg-indigo-400/10' :
            i === 1 ? 'w-48 h-48 bg-purple-400/20 dark:bg-purple-400/10' : 
            'w-32 h-32 bg-pink-400/20 dark:bg-pink-400/10'
          }`}
          style={{
            top: `${20 + i * 25}%`,
            left: `${10 + i * 30}%`,
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid pattern (increased contrast/opacity so it's visible in both modes) */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.2] dark:opacity-[0.08] text-slate-600/80 dark:text-slate-200/70"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${variant}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${variant})`} />
      </svg>

      {children}
    </div>
  );
};
