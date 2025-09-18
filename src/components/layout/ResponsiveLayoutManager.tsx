"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type DeviceType = 'mobile' | 'tablet' | 'desktop';
type Orientation = 'portrait' | 'landscape';

interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

interface LayoutContextType {
  breakpoint: BreakpointKey;
  deviceType: DeviceType;
  orientation: Orientation;
  screenWidth: number;
  screenHeight: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
}

const defaultBreakpoints: Breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useResponsiveLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useResponsiveLayout must be used within a ResponsiveLayoutProvider');
  }
  return context;
};

interface ResponsiveLayoutProviderProps {
  children: React.ReactNode;
  breakpoints?: Partial<Breakpoints>;
}

export const ResponsiveLayoutProvider: React.FC<ResponsiveLayoutProviderProps> = ({
  children,
  breakpoints: customBreakpoints = {}
}) => {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    const detectTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    updateDimensions();
    detectTouch();

    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  const getBreakpoint = (): BreakpointKey => {
    if (screenWidth >= breakpoints['2xl']) return '2xl';
    if (screenWidth >= breakpoints.xl) return 'xl';
    if (screenWidth >= breakpoints.lg) return 'lg';
    if (screenWidth >= breakpoints.md) return 'md';
    if (screenWidth >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  const getDeviceType = (): DeviceType => {
    if (screenWidth < breakpoints.md) return 'mobile';
    if (screenWidth < breakpoints.lg) return 'tablet';
    return 'desktop';
  };

  const getOrientation = (): Orientation => {
    return screenWidth > screenHeight ? 'landscape' : 'portrait';
  };

  const breakpoint = getBreakpoint();
  const deviceType = getDeviceType();
  const orientation = getOrientation();

  const value: LayoutContextType = {
    breakpoint,
    deviceType,
    orientation,
    screenWidth,
    screenHeight,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isTouch,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

// Responsive Container Component
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: BreakpointKey | 'none';
  padding?: boolean | BreakpointKey[];
  center?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
  padding = true,
  center = true
}) => {
  const { breakpoint } = useResponsiveLayout();

  const getMaxWidthClass = () => {
    if (maxWidth === 'none') return '';
    const maxWidthMap = {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
    };
    return maxWidthMap[maxWidth] || 'max-w-7xl';
  };

  const getPaddingClass = () => {
    if (!padding) return '';
    if (padding === true) return 'px-4 sm:px-6 lg:px-8';
    
    // Custom padding per breakpoint
    if (Array.isArray(padding)) {
      return padding.map(bp => `${bp}:px-4`).join(' ');
    }
    
    return 'px-4';
  };

  return (
    <div
      className={cn(
        'w-full',
        getMaxWidthClass(),
        getPaddingClass(),
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number | string;
  autoFit?: boolean;
  minItemWidth?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  autoFit = false,
  minItemWidth = '250px'
}) => {
  const getGridClass = () => {
    if (autoFit) {
      return `grid-cols-[repeat(auto-fit,minmax(${minItemWidth},1fr))]`;
    }

    const colClasses = Object.entries(cols)
      .map(([bp, colCount]) => {
        if (bp === 'xs') return `grid-cols-${colCount}`;
        return `${bp}:grid-cols-${colCount}`;
      })
      .join(' ');

    return colClasses;
  };

  const getGapClass = () => {
    return typeof gap === 'number' ? `gap-${gap}` : gap;
  };

  return (
    <div
      className={cn(
        'grid',
        getGridClass(),
        getGapClass(),
        className
      )}
    >
      {children}
    </div>
  );
};

// Responsive Show/Hide Component
interface ResponsiveVisibilityProps {
  children: React.ReactNode;
  show?: BreakpointKey[];
  hide?: BreakpointKey[];
  className?: string;
}

export const ResponsiveVisibility: React.FC<ResponsiveVisibilityProps> = ({
  children,
  show,
  hide,
  className
}) => {
  const { breakpoint } = useResponsiveLayout();

  const shouldShow = () => {
    if (show && !show.includes(breakpoint)) return false;
    if (hide && hide.includes(breakpoint)) return false;
    return true;
  };

  if (!shouldShow()) return null;

  return (
    <div className={className}>
      {children}
    </div>
  );
};

// Responsive Sidebar Component
interface ResponsiveSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  overlay?: boolean;
  className?: string;
}

export const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({
  children,
  isOpen,
  onClose,
  side = 'left',
  overlay = true,
  className
}) => {
  const { isMobile } = useResponsiveLayout();

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: side === 'left' ? '-100%' : '100%',
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  if (!isMobile) {
    // Desktop: always visible sidebar
    return (
      <div className={cn("w-64 flex-shrink-0", className)}>
        {children}
      </div>
    );
  }

  // Mobile: overlay sidebar
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {overlay && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={onClose}
            />
          )}
          <motion.div
            className={cn(
              "fixed top-0 z-50 h-full w-64 bg-background border-r shadow-lg",
              side === 'left' ? 'left-0' : 'right-0',
              className
            )}
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Hook for responsive values
export const useResponsiveValue = <T,>(values: Partial<Record<BreakpointKey, T>>): T | undefined => {
  const { breakpoint } = useResponsiveLayout();
  
  const breakpointOrder: BreakpointKey[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  // Find the closest defined value for current or smaller breakpoint
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return undefined;
};