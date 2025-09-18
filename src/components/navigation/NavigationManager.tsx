'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { NavigationItem, getNavigationItemByHref, navigationConfig } from '@/config/navigation';

interface NavigationContextType {
  currentItem: NavigationItem | null;
  breadcrumbs: NavigationItem[];
  relatedItems: NavigationItem[];
  navigationHistory: string[];
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  addToHistory: (path: string) => void;
  getRecommendedItems: () => NavigationItem[];
  navigationItems: NavigationItem[];
  activeItem: NavigationItem | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  // Get current navigation item
  const currentItem = getNavigationItemByHref(pathname as string);

  // Generate breadcrumbs
  const breadcrumbs = React.useMemo(() => {
    const pathSegments = (pathname || '').split('/').filter(Boolean);
    const crumbs: NavigationItem[] = [];
    
    // Always add home
    if (pathname !== '/') {
      crumbs.push({
        id: 'home',
        label: 'Home',
        href: '/',
        category: 'primary'
      });
    }
    
    let currentPath = '';
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      const navItem = getNavigationItemByHref(currentPath);
      
      if (navItem) {
        crumbs.push(navItem);
      } else {
        // Create fallback breadcrumb
        crumbs.push({
          id: segment,
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          href: currentPath
        });
      }
    }
    
    return crumbs;
  }, [pathname]);

  // Get related items based on current context
  const relatedItems = React.useMemo(() => {
    if (!currentItem) return [];
    
    const related: NavigationItem[] = [];
    
    // Find items in the same category
    const sameCategory = navigationConfig.filter(item => 
      item.category === currentItem.category && item.id !== currentItem.id
    );
    related.push(...sameCategory.slice(0, 3));
    
    // Find items with similar functionality (tools, career, etc.)
    if (currentItem.category === 'tools') {
      const toolsItem = navigationConfig.find(item => item.id === 'tools');
      if (toolsItem?.children) {
        const similarTools = toolsItem.children.filter(child => 
          child.id !== currentItem.id
        );
        related.push(...similarTools.slice(0, 2));
      }
    }
    
    return related.slice(0, 5); // Limit to 5 related items
  }, [currentItem]);

  // Get recommended items based on user behavior and item priority
  const getRecommendedItems = React.useCallback(() => {
    const recommended: NavigationItem[] = [];
    
    // Get high-priority items
    const highPriority = navigationConfig.filter(item => 
      (item.priority || 0) <= 3 && !navigationHistory.includes(item.href)
    );
    recommended.push(...highPriority.slice(0, 3));
    
    // Get new/popular items
    const featured = navigationConfig.filter(item => 
      (item.isNew || item.isPopular) && !navigationHistory.includes(item.href)
    );
    recommended.push(...featured.slice(0, 2));
    
    // Get tools if user hasn't visited tools page
    if (!navigationHistory.includes('/tools')) {
      const toolsItem = navigationConfig.find(item => item.id === 'tools');
      if (toolsItem) recommended.push(toolsItem);
    }
    
    return recommended.slice(0, 6);
  }, [navigationHistory]);

  // Navigation history management
  const addToHistory = React.useCallback((path: string) => {
    setNavigationHistory(prev => {
      const newHistory = [...prev];
      const existingIndex = newHistory.indexOf(path);
      
      if (existingIndex !== -1) {
        // Move to end if already exists
        newHistory.splice(existingIndex, 1);
      }
      
      newHistory.push(path);
      
      // Keep only last 20 items
      if (newHistory.length > 20) {
        newHistory.shift();
      }
      
      return newHistory;
    });
  }, []);

  const canGoBack = currentHistoryIndex > 0;
  const canGoForward = currentHistoryIndex < navigationHistory.length - 1;

  const goBack = React.useCallback(() => {
    if (canGoBack) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      router.push(navigationHistory[newIndex]);
    }
  }, [canGoBack, currentHistoryIndex, navigationHistory, router]);

  const goForward = React.useCallback(() => {
    if (canGoForward) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      router.push(navigationHistory[newIndex]);
    }
  }, [canGoForward, currentHistoryIndex, navigationHistory, router]);

  // Track navigation changes
  useEffect(() => {
    addToHistory(pathname || '');
    setCurrentHistoryIndex(navigationHistory.length);
  }, [pathname, addToHistory, navigationHistory.length]);

  const value: NavigationContextType = {
    currentItem,
    breadcrumbs,
    relatedItems,
    navigationHistory,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    addToHistory,
    getRecommendedItems,
    navigationItems: navigationConfig,
    activeItem: currentItem
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;