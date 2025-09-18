"use client"
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { lockBodyScroll, unlockBodyScroll } from '@/utils/header/header.utils';

// Add this interface above the hook
interface HeaderState {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  menuReady: boolean;
  isHome: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

// Update the hook's return type
export const useHeaderState = (): HeaderState => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuReady, setMenuReady] = useState(false);
  
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Handle scroll effect for dynamic header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile menu state and body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      lockBodyScroll();
      // Defer content mount to next frame to avoid jank
      const id = requestAnimationFrame(() => setMenuReady(true));
      return () => {
        cancelAnimationFrame(id);
        unlockBodyScroll();
      };
    } else {
      setMenuReady(false);
      unlockBodyScroll();
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return {
    isScrolled,
    isMobileMenuOpen,
    menuReady,
    isHome,
    setIsMobileMenuOpen,  // This exists but isn't in the type definition
    openMobileMenu,
    closeMobileMenu
  };
};