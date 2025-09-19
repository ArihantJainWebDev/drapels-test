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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut" 
      }}
      role="banner"
    >
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
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

      {/* Subtle bottom border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent opacity-50" />
    </motion.header>
  );
};

export default Header;