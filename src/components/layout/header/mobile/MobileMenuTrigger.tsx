"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getMenuIconClasses } from '@/utils/header/header.utils';

interface MobileMenuTriggerProps {
  isHome: boolean;
  isScrolled: boolean;
  isMenuOpen: boolean;
  onClick: () => void;
}

const MobileMenuTrigger: React.FC<MobileMenuTriggerProps> = ({ 
  isHome, 
  isScrolled, 
  isMenuOpen,
  onClick 
}) => {
  // Use a more reliable theming approach
  const iconClasses = cn(
    'w-5 h-5',
    isHome && !isScrolled ? 'text-gray-900' : 'text-gray-800 dark:text-gray-200'
  );
  
  const buttonClasses = cn(
    'p-2.5 rounded-xl transition-all duration-200', // Reduced duration for snappier feel
    'hover:bg-gray-100/60 dark:hover:bg-gray-800/60',
    'focus:outline-none focus:ring-2 focus:ring-primary/50',
    'relative overflow-hidden group z-50', // Added z-index
    isMenuOpen ? 'bg-gray-100/80 dark:bg-gray-800/80' : '',
    'text-current' // Ensure text color inheritance
  );

  return (
    <motion.div
      initial={false}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: 'spring', 
        stiffness: 500, 
        damping: 30,
        mass: 0.5
      }}
      className="relative z-50"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={buttonClasses}
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isMenuOpen ? 'close' : 'menu'}
            initial={{ opacity: 0, rotate: isMenuOpen ? 90 : -90 }}
            animate={{ 
              opacity: 1, 
              rotate: 0,
              transition: { duration: 0.2 }
            }}
            exit={{ 
              opacity: 0, 
              rotate: isMenuOpen ? 90 : -90,
              transition: { duration: 0.15 }
            }}
            className="flex items-center justify-center w-5 h-5 relative z-10"
          >
            {isMenuOpen ? (
              <X className={cn(iconClasses, 'w-5 h-5')} />
            ) : (
              <Menu className={cn(iconClasses, 'w-5 h-5')} />
            )}
          </motion.span>
        </AnimatePresence>
        
        {/* Ripple effect - simplified for better performance */}
        <span className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </Button>
    </motion.div>
  );
};

export default MobileMenuTrigger;