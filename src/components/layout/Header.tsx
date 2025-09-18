"use client"
import { motion } from 'framer-motion';
import HeaderLogo from './header/HeaderLogo';
import DesktopNavigation from './header/DesktopNavigation';
import HeaderActions from './header/HeaderActions';
import MobileMenuTrigger from './header/mobile/MobileMenuTrigger';
import MobileMenu from './header/mobile/MobileMenu';
import { useHeaderState } from '@/hooks/header/useHeaderState';
import { getHeaderClasses } from '@/utils/header/header.utils';
import { headerConfig } from '@/config/header/header.config';

const Header: React.FC = () => {
  const {
    isScrolled,
    isMobileMenuOpen,
    menuReady,
    isHome,
    setIsMobileMenuOpen,
    closeMobileMenu
  } = useHeaderState();

  const headerClasses = getHeaderClasses(isHome, isScrolled);

  return (
    <motion.header
      className={headerClasses}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: headerConfig.animations.scroll.duration, 
        ease: headerConfig.animations.scroll.ease 
      }}
      role="banner"
    >
      {/* Subtle liquid orb (lightweight) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-8 w-40 h-40 rounded-full bg-gradient-to-br from-gray-200/20 to-gray-300/10 dark:from-gray-700/20 dark:to-gray-600/10 blur-2xl"
        animate={{ x: [0, 8, 0], y: [0, 6, 0], scale: [1, 1.03, 1] }}
        transition={{ 
          duration: headerConfig.animations.orb.duration, 
          repeat: Infinity, 
          ease: headerConfig.animations.orb.ease 
        }}
      />
      
      <div className="container mx-auto px-4 min-h-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:min-h-[calc(4rem+env(safe-area-inset-top,0px))] py-2 sm:py-1 flex items-center justify-between">
        <HeaderLogo isHome={isHome} isScrolled={isScrolled} />
        <DesktopNavigation isHome={isHome} isScrolled={isScrolled} />
        <HeaderActions isHome={isHome} isScrolled={isScrolled} variant="desktop" />
        
        {/* Mobile Actions and Menu Trigger */}
        <div className="lg:hidden flex items-center gap-3">
          <HeaderActions isHome={isHome} isScrolled={isScrolled} variant="mobile" />
          <MobileMenuTrigger 
            isHome={isHome} 
            isScrolled={isScrolled} 
            onClick={() => setIsMobileMenuOpen(true)} 
          />
        </div>

        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          menuReady={menuReady} 
          onClose={closeMobileMenu} 
        />
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
      
      {/* Bottom accent line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#93C5FD]/0 via-[#93C5FD]/50 to-[#1EB36B]/0" />
    </motion.header>
  );
};

export default Header;