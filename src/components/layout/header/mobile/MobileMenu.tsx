"use client"
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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Mobile Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 h-screen w-72 max-w-[85vw] bg-white/95 dark:bg-gray-900/95 shadow-2xl z-50 flex flex-col border-l border-gray-200/30 dark:border-gray-800/30 will-change-transform transform-gpu"
            style={{
              WebkitTextSizeAdjust: '100%',
              WebkitFontSmoothing: 'antialiased',
              textRendering: 'optimizeLegibility',
              touchAction: 'pan-y',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              overscrollBehavior: 'contain',
              position: 'fixed',
              maxHeight: '100vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: headerConfig.animations.mobileMenu.panel.transition.damping,
              stiffness: headerConfig.animations.mobileMenu.panel.transition.stiffness,
              opacity: { duration: 0.15 }
            }}
          >
            <style>{`
              @media (max-width: 640px) {
                html, body {
                  touch-action: pan-y;
                  -webkit-text-size-adjust: 100%;
                  -webkit-font-smoothing: antialiased;
                  -webkit-tap-highlight-color: transparent;
                  -webkit-touch-callout: none;
                  overscroll-behavior-y: contain;
                  position: fixed;
                  width: 100%;
                  overflow-x: hidden;
                }
                
                /* Prevent content from being zoomed */
                input, select, textarea, button, a {
                  font-size: 16px !important;
                }
                
                /* Disable double-tap zoom */
                * {
                  touch-action: pan-y;
                  -webkit-tap-highlight-color: transparent;
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

            <MobileMenuContent onClose={onClose} menuReady={menuReady} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;