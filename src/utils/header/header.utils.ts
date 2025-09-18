import { headerConfig } from '@/config/header/header.config';

export const getHeaderClasses = (isHome: boolean, isScrolled: boolean): string => {
  const baseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-[env(safe-area-inset-top,0px)] overflow-visible";
  
  let dynamicClasses = "";
  
  if (isHome) {
    const bgClass = isScrolled 
      ? headerConfig.styling.glassmorphism.home.scrolled
      : headerConfig.styling.glassmorphism.home.default;
    dynamicClasses = `${bgClass} ${headerConfig.styling.backdrop} border-b ${headerConfig.styling.border} ${headerConfig.styling.shadow}`;
  } else {
    dynamicClasses = `${headerConfig.styling.glassmorphism.other} ${headerConfig.styling.backdrop} border-b ${headerConfig.styling.border} ${headerConfig.styling.shadow}`;
  }
  
  return `${baseClasses} ${dynamicClasses}`;
};

export const getLogoClasses = (isHero: boolean): string => {
  return `w-12 h-12 relative z-10`;
};

export const getTextColor = (isHome: boolean, isScrolled: boolean, variant: 'normal' | 'hover' = 'normal'): string => {
  const isHero = isHome && !isScrolled;
  
  if (variant === 'hover') {
    return isHero 
      ? "text-gray-800 hover:text-gray-900 hover:bg-[#A7F3D0]/20 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5"
      : "text-gray-700 hover:text-gray-900 hover:bg-[#A7F3D0]/20 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5";
  }
  
  return isHero 
    ? "text-gray-900 dark:text-white"
    : "text-gray-900 dark:text-white";
};

export const getCreditsButtonClasses = (isHome: boolean, isScrolled: boolean): string => {
  const isHero = isHome && !isScrolled;
  
  return `px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border ${
    isHero
      ? 'bg-black/45 text-white border-white/25'
      : 'bg-white/80 text-gray-800 border-gray-200 dark:bg-gray-800/70 dark:text-gray-100 dark:border-gray-700'
  }`;
};

export const getCreditsStatus = (credits: number | null): 'empty' | 'low' | 'normal' => {
  if (!credits || credits === 0) return 'empty';
  if (credits < 20) return 'low';
  return 'normal';
};

export const getCreditsMessage = (status: 'empty' | 'low' | 'normal'): string => {
  switch (status) {
    case 'empty':
      return 'Outta credits — subscribe.';
    case 'low':
      return "You're low on credits.";
    default:
      return 'Top up to keep going.';
  }
};

export const getUserInitial = (displayName: string | null): string => {
  return displayName?.split(" ")[0]?.[0] || "U";
};

export const getFirstName = (displayName: string | null): string => {
  return displayName?.split(" ")[0] || "User";
};

export const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

export const unlockBodyScroll = () => {
  document.body.style.overflow = '';
};

export const getNavLinkClasses = (
  isActive: boolean, 
  isHome: boolean, 
  isScrolled: boolean
): string => {
  const baseClasses = "cursor-can-hover relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 group";
  
  if (isActive) {
    return `${baseClasses} text-[#1EB36B] dark:text-[#1EB36B]`;
  }
  
  const hoverClasses = "hover:text-gray-900 hover:bg-[#A7F3D0]/20 dark:hover:text-white dark:hover:bg-white/5";
  
  if (isHome && !isScrolled) {
    return `${baseClasses} text-gray-800 ${hoverClasses} dark:text-gray-300`;
  }
  
  return `${baseClasses} text-gray-700 ${hoverClasses} dark:text-gray-300`;
};

export const getDropdownItemClasses = (isActive: boolean): string => {
  const baseClasses = "cursor-can-hover flex items-start gap-3 p-4 m-1 rounded-xl transition-all duration-200 group cursor-pointer";
  
  if (isActive) {
    return `${baseClasses} bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-800/50 dark:to-indigo-950/30 text-indigo-600 dark:text-indigo-400 ring-1 ring-gray-200/50 dark:ring-indigo-800/30`;
  }
  
  return `${baseClasses} hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02]`;
};

export const getIconWrapClasses = (isActive: boolean): string => {
  const baseClasses = "p-2 rounded-lg";
  
  if (isActive) {
    return `${baseClasses} bg-gradient-to-r from-gray-600 to-indigo-600 text-white`;
  }
  
  return `${baseClasses} bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:text-gray-700 dark:group-hover:text-gray-300`;
};

export const getMobileCreditsButtonClasses = (isHome: boolean, isScrolled: boolean): string => {
  const baseClasses = "px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border";
  
  if (isHome && !isScrolled) {
    return `${baseClasses} bg-black/45 text-white border-white/25`;
  }
  
  return `${baseClasses} bg-white/80 text-gray-800 border-gray-200 dark:bg-gray-800/70 dark:text-gray-100 dark:border-gray-700`;
};

export const getTextColorClasses = (isHome: boolean, isScrolled: boolean): string => {
  if (isHome && !isScrolled) {
    return "text-gray-900 dark:text-white";
  }
  return "text-gray-900 dark:text-white";
};

export const getMenuIconClasses = (isHome: boolean, isScrolled: boolean): string => {
  if (isHome && !isScrolled) {
    return "text-gray-900";
  }
  return "text-gray-800 dark:text-gray-200";
};

// Translation fallback utility
export const createTranslationFallback = (t: (key: string) => string) => {
  return (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };
};

// Format credits for display
export const formatCredits = (credits: number | null | undefined, isLoading: boolean): string => {
  if (isLoading) return '—';
  return typeof credits === 'number' ? String(credits) : '0';
};

// Get credits progress value (0-100)
export const getCreditsProgress = (credits: number | null | undefined): number => {
  return typeof credits === 'number' ? Math.max(0, Math.min(credits, 100)) : 0;
};

// Check if credits are low
export const areCreditsLow = (credits: number | null | undefined): boolean => {
  const val = getCreditsProgress(credits);
  return val > 0 && val < 20;
};

// Check if credits are empty
export const areCreditsEmpty = (credits: number | null | undefined): boolean => {
  return getCreditsProgress(credits) === 0;
};