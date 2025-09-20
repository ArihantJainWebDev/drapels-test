"use client"
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileMenuContent from './MobileMenuContent';
import { headerConfig } from '@/config/header/header.config';

interface MobileMenuProps {
  isOpen: boolean;
  menuReady: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, menuReady, onClose }) => {
  // Add/remove class to body when menu opens/closes
  React.useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('menu-open');
    } else {
      document.documentElement.classList.remove('menu-open');
    }
    
    return () => {
      document.documentElement.classList.remove('menu-open');
    };
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop - Simplified with CSS transitions */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            onClick={onClose}
            key="backdrop"
          />

          {/* Mobile Menu Panel - Optimized */}
          <motion.div
            className="fixed top-0 right-0 h-screen w-72 max-w-[85vw] bg-white/95 dark:bg-gray-900/95 shadow-2xl z-50 flex flex-col border-l border-gray-200/30 dark:border-gray-800/30"
            style={{
              // Performance optimizations
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: 1000,
              willChange: 'transform, opacity',
              // Scroll handling
              overflowY: 'auto'
            }}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              transition: {
                x: { type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.3 },
                opacity: { duration: 0.2 }
              }
            }}
            exit={{ 
              x: '100%', 
              opacity: 0,
              transition: {
                x: { type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.25 },
                opacity: { duration: 0.15 }
              }
            }}
            key="mobile-menu"
          >
            <style jsx global>{`
              /* Optimized mobile styles */
              @media (max-width: 640px) {
                html.menu-open, 
                html.menu-open body {
                  position: fixed;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  touch-action: none;
                  -webkit-overflow-scrolling: touch;
                }
                
                /* Optimize rendering performance */
                * {
                  -webkit-tap-highlight-color: transparent;
                  -webkit-touch-callout: none;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                  text-rendering: optimizeLegibility;
                }
                
                /* Prevent zoom on focus */
                input, select, textarea {
                  font-size: 16px !important;
                }
              }
            `}</style>
            
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/30 dark:border-gray-800/30 bg-gradient-to-r from-gray-50/50 to-indigo-50/50 dark:from-gray-900/50 dark:to-indigo-950/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/Drapels.PNG" alt="Drapels Logo" className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Navigation
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Explore Drapels</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-200"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {menuReady && (
              <MobileMenuContent onClose={onClose} menuReady={true} />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;