"use client"
import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code, ChevronDown, Briefcase, BookOpen, Target, HelpCircle, FileText, Building2 } from 'lucide-react';
import { 
  NavigationItem, 
  getHelpNavigation, 
  getCompanyNavigation, 
  getPrimaryNavigation, 
  getToolsNavigation, 
  getCareerNavigation, 
  getResourcesNavigation 
} from '@/config/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getNavLinkClasses, createTranslationFallback } from '@/utils/header/header.utils';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface DesktopNavigationProps {
  isHome: boolean;
  isScrolled: boolean;
}

type TabType = 'career' | 'practice' | 'learning' | 'company' | 'resources' | 'help';
type DropdownType = 'tools' | 'more';

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ isHome, isScrolled }) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const tr = createTranslationFallback(t);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // State management
  const [activeDropdown, setActiveDropdown] = useState<DropdownType | null>(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('career');
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('left');

  // Get navigation items from configuration
  const primaryNavLinks = getPrimaryNavigation().map(item => ({
    ...item,
    label: item.id === 'home' ? tr('nav.home', item.label) :
      item.id === 'roadmaps' ? tr('nav.roadmaps', item.label) :
        item.id === 'community' ? tr('nav.community', item.label) :
          item.label
  }));

  // Navigation data
  const toolsItems = getToolsNavigation();
  const careerItems = getCareerNavigation();
  const resourceItems = getResourcesNavigation();
  const helpItems = getHelpNavigation();
  const companyItems = getCompanyNavigation();

  // Define tab item type
  type TabItem = {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  };

  // Tabs configuration - simplified labels
  const tabs: { tools: TabItem[], more: TabItem[] } = {
    tools: [
      { id: 'career', label: 'Career', icon: Briefcase },
      { id: 'practice', label: 'Practice', icon: Target },
      { id: 'learning', label: 'Learning', icon: BookOpen }
    ],
    more: [
      { id: 'company', label: 'Company', icon: Building2 },
      { id: 'resources', label: 'Resources', icon: FileText },
      { id: 'help', label: 'Help', icon: HelpCircle }
    ]
  };

  // Calculate dropdown position based on screen bounds
  const calculateDropdownPosition = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const dropdownWidth = 480; // Reduced width for better fit
    const screenWidth = window.innerWidth;
    const spaceOnRight = screenWidth - rect.right;
    
    if (spaceOnRight < dropdownWidth && rect.left > dropdownWidth) {
      setDropdownPosition('right');
    } else {
      setDropdownPosition('left');
    }
  }, []);

  // Utility functions
  const isActive = (href: string) => pathname === href;

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const setCloseTimeout = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringDropdown) {
        setActiveDropdown(null);
      }
    }, 150);
  }, [isHoveringDropdown, clearCloseTimeout]);

  // Get items for the current active tab
  const getCurrentItems = useCallback(() => {
    if (!activeDropdown) return [];
    
    if (activeDropdown === 'tools') {
      switch (activeTab) {
        case 'career':
          return careerItems;
        case 'practice':
          return toolsItems.filter(item => item.id.includes('practice') || item.label.toLowerCase().includes('practice'));
        case 'learning':
          return toolsItems.filter(item => item.id.includes('learning') || item.label.toLowerCase().includes('learn'));
        default:
          return careerItems;
      }
    } else if (activeDropdown === 'more') {
      switch (activeTab) {
        case 'company':
          return companyItems;
        case 'resources':
          return resourceItems;
        case 'help':
          return helpItems;
        default:
          return companyItems;
      }
    }
    
    return [];
  }, [activeDropdown, activeTab, careerItems, toolsItems, companyItems, resourceItems, helpItems]);

  // Event handlers
  const handleMouseEnter = useCallback((id: DropdownType, element: HTMLElement) => {
    clearCloseTimeout();
    calculateDropdownPosition(element);
    setActiveDropdown(id);
    // Set default active tab based on which dropdown is opening
    if (id === 'tools') {
      setActiveTab('career');
    } else if (id === 'more') {
      setActiveTab('company');
    }
  }, [clearCloseTimeout, calculateDropdownPosition]);

  const handleMouseLeave = useCallback(() => {
    setCloseTimeout();
  }, [setCloseTimeout]);

  const handleDropdownEnter = useCallback(() => {
    clearCloseTimeout();
    setIsHoveringDropdown(true);
  }, [clearCloseTimeout]);

  const handleDropdownLeave = useCallback(() => {
    setIsHoveringDropdown(false);
    setCloseTimeout();
  }, [setCloseTimeout]);

  const handleTabChange = useCallback((tabId: TabType) => {
    setActiveTab(tabId);
  }, []);

  // Add this effect for click outside handling
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      closeDropdown();
    }
  };

  // Add event listener when dropdown is open
  if (activeDropdown) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  // Cleanup
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [activeDropdown]);

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
    setIsHoveringDropdown(false);
    clearCloseTimeout();
  }, [clearCloseTimeout]);

  // Enhanced navigation items with Tools and More
  const navItems = [
    ...primaryNavLinks,
    {
      id: 'tools',
      label: 'Tools',
      href: '#',
      icon: Code,
      category: 'tools' as const,
      seoTitle: 'Development Tools',
      description: 'Tools for developers'
    },
    {
      id: 'more',
      label: 'More',
      href: '#',
      icon: ChevronDown,
      category: 'more' as const,
      seoTitle: 'More Options',
      description: 'Additional options and links'
    }
  ];

  // Close dropdown on scroll or resize
  useEffect(() => {
    const handleScroll = () => closeDropdown();
    const handleResize = () => closeDropdown();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [closeDropdown]);

  return (
    <nav className="hidden lg:flex items-center space-x-1 h-full" role="navigation" aria-label="Main navigation">
      {navItems.map((link) => {
        const IconComponent = link.icon;
        const active = isActive(link.href);
        const isTools = link.id === 'tools';
        const isMore = link.id === 'more';
        const isDropdownItem = isTools || isMore;
        const isDropdownOpen = activeDropdown === link.id;
        const currentTabs = isTools ? tabs.tools : tabs.more;
        const currentItems = getCurrentItems();

        return (
          <div 
            key={link.id} 
            className="relative h-full flex items-center" 
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={isDropdownItem ? '#' : link.href}
              title={link.seoTitle}
              className={cn(
                getNavLinkClasses(active, isHome, isScrolled),
                'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                'flex items-center gap-2 h-full relative',
                isDropdownOpen 
                  ? 'text-primary-600 dark:text-primary-400 bg-gray-100 dark:bg-gray-800/70' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
                isDropdownItem && 'pr-8'
              )}
              aria-current={active ? "page" : undefined}
              aria-expanded={isDropdownItem ? isDropdownOpen : undefined}
              onMouseEnter={(e) => isDropdownItem && handleMouseEnter(link.id as DropdownType, e.currentTarget)}
              onClick={isDropdownItem ? (e) => e.preventDefault() : closeDropdown}
            >
              {IconComponent && (
                <IconComponent className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="whitespace-nowrap">{link.label}</span>
              {isDropdownItem && (
                <ChevronDown 
                  className={cn(
                    'w-4 h-4 ml-1 transition-transform duration-200 absolute right-2',
                    isDropdownOpen && 'rotate-180'
                  )} 
                />
              )}
            </Link>

            {/* Dropdown Content */}
            {isDropdownItem && (
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className={cn(
                      'absolute top-full mt-2 w-[480px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50',
                      dropdownPosition === 'right' ? 'right-0' : 'left-0'
                    )}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {/* Tabs - More Minimal Design */}
                    <div className="px-4 py-3 border-b border-gray-100/80 dark:border-gray-800/80">
                      <div className="flex space-x-1">
                        {currentTabs.map((tab, index) => (
                          <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id as TabType)}
                            className={cn(
                              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
                              activeTab === tab.id 
                                ? 'bg-primary-600 text-white shadow-sm' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50',
                              'whitespace-nowrap'
                            )}
                          >
                            <tab.icon className="w-3 h-3" />
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Content - Minimal Grid */}
                    <div className="p-3">
                      {currentItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-1">
                          {currentItems.slice(0, 6).map((item) => ( // Limit items to prevent overflow
                            <Link
                              key={item.id}
                              href={item.href}
                              className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                              onClick={closeDropdown}
                            >
                              {item.icon && (
                                <div className="flex-shrink-0 w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                                  {React.createElement(item.icon, { className: "w-4 h-4" })}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                                  {item.label}
                                </div>
                                {item.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          ))}
                          {currentItems.length > 6 && (
                            <div className="mt-1 pt-2 border-t border-gray-100 dark:border-gray-800">
                              <div className="text-center">
                                <Link
                                  href="#"
                                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                                  onClick={closeDropdown}
                                >
                                  View all {currentItems.length} items
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                          <div className="text-xs">No items available</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default DesktopNavigation;