import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './card';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({ 
  children, 
  className = '', 
  hover = true, 
  gradient = false,
  onClick 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17,
        duration: 0.15
      }}
      className="h-full"
    >
      <Card
        className={`
          relative border border-border/50 shadow-lg backdrop-blur-sm
          transition-all duration-300 ease-out h-full overflow-hidden
          ${hover ? 'hover:shadow-2xl hover:border-border/80' : ''}
          ${gradient ? 'bg-gradient-to-br from-background/95 to-background/80' : 'bg-background/95'}
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
        onClick={onClick}
      >
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-white/5 dark:bg-white/5 backdrop-blur-[2px]" />
        
        <CardContent className="relative z-10 p-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};