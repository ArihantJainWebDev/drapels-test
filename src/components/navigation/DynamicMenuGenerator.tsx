import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  navigationConfig,
  NavigationItem,
  getPrimaryNavigation,
  getToolsNavigation,
  getCareerNavigation,
  getCompanyNavigation
} from '@/config/navigation';
import ProgressiveDisclosure from './ProgressiveDisclosure';
import { cn } from '@/lib/utils';

interface DynamicMenuGeneratorProps {
  variant?: 'header' | 'sidebar' | 'mobile' | 'footer';
  className?: string;
  showCategories?: boolean;
  maxItemsPerCategory?: number;
  onLinkClick?: () => void;
}

export const DynamicMenuGenerator: React.FC<DynamicMenuGeneratorProps> = ({
  variant = 'header',
  className,
  showCategories = true,
  maxItemsPerCategory = 6,
  onLinkClick
}) => {
  const { user } = useAuth();
  const pathname = usePathname();

  // Debug: Log when component renders and the current variant
  React.useEffect(() => {
    console.log('DynamicMenuGenerator mounted with variant:', variant);
    console.log('Current pathname:', pathname);
  }, [variant, pathname]);

  const filteredNavigation = useMemo(() => {
    const filterItems = (items: NavigationItem[]): NavigationItem[] => {
      return items
        .filter(item => {
          // Filter out auth-required items if user is not logged in
          if (item.requiresAuth && !user) return false;
          return true;
        })
        .map(item => ({
          ...item,
          children: item.children ? filterItems(item.children) : undefined
        }))
        .slice(0, maxItemsPerCategory);
    };

    return {
      primary: filterItems(getPrimaryNavigation()),
      tools: filterItems(getToolsNavigation()),
      career: filterItems(getCareerNavigation()),
      company: filterItems(getCompanyNavigation())
    };
  }, [user, maxItemsPerCategory]);

  const isActive = (href: string) => pathname === href;

  const renderHeaderMenu = () => {
    const isHome = pathname === "/";
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <nav className={cn('flex items-center space-x-1', className)} role="navigation" aria-label="Main navigation">
        {filteredNavigation.primary.map((item, index) => {
          const IconComponent = item.icon;
          const active = isActive(item.href);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                title={item.seoTitle}
                className={cn(
                  'cursor-can-hover relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group',
                  active
                    ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25'
                    : `${isHome && !isScrolled ? "text-white hover:text-white/90 hover:bg-white/10" : "text-gray-800 hover:text-gray-800 hover:bg-gray-100/60"} dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/60`
                )}
                aria-current={active ? 'page' : undefined}
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {item.label}
                {active && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {!active && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gray-100/0 dark:bg-gray-800/0 -z-10"
                    whileHover={{
                      backgroundColor: ["rgba(0,0,0,0)", "rgba(107,114,128,0.1)", "rgba(0,0,0,0)"],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}

        {/* Tools Link */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link
            href="/tools"
            title="Developer Tools - Explore all tools"
            className={cn(
              'cursor-can-hover relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group',
              isActive('/tools')
                ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25'
                : `${isHome && !isScrolled ? "text-white hover:text-white/90 hover:bg-white/10" : "text-gray-800 hover:text-gray-800 hover:bg-gray-100/60"} dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/60`
            )}
            aria-current={isActive('/tools') ? 'page' : undefined}
          >
            <Code className="w-4 h-4" />
            Developer Tools
            {isActive('/tools') && (
              <motion.div
                layoutId="activeNavIndicator"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 -z-10"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        </motion.div>
      </nav>
    );
  };

  const renderSidebarMenu = () => (
    <div className={cn('space-y-6', className)}>
      {showCategories && (
        <>
          <ProgressiveDisclosure
            items={filteredNavigation.primary}
            title="Main Navigation"
            variant="compact"
            defaultExpanded={true}
          />
          <ProgressiveDisclosure
            items={filteredNavigation.tools}
            title="Developer Tools"
            variant="default"
            defaultExpanded={false}
          />
          <ProgressiveDisclosure
            items={filteredNavigation.career}
            title="Career Development"
            variant="default"
            defaultExpanded={false}
          />
          <ProgressiveDisclosure
            items={filteredNavigation.company}
            title="Company & Support"
            variant="compact"
            defaultExpanded={false}
          />
        </>
      )}
    </div>
  );

  const renderMobileMenu = () => {
    const handleLinkClick = () => {
      if (onLinkClick) onLinkClick();

      // Close mobile menu when a link is clicked
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('-translate-x-full');
      }
    };

    // Group navigation items by category
    const navigationGroups = {
      primary: filteredNavigation.primary.filter(item => !('hidden' in item) || !item.hidden),
      tools: filteredNavigation.tools.filter(item => !('hidden' in item) || !item.hidden),
      career: filteredNavigation.career.filter(item => !('hidden' in item) || !item.hidden),
      company: filteredNavigation.company.filter(item => !('hidden' in item) || !item.hidden)
    };

    const categoryTitles = {
      primary: 'Quick Links',
      tools: 'Dev Tools',
      career: 'Career',
      company: 'Company'
    };

    const renderIconItem = (item: NavigationItem, index: number) => {
      const IconComponent = item.icon || Code;
      const active = isActive(item.href);
      const labelWords = item.label.split(' ');
      const displayLabel = labelWords.length > 2 
        ? labelWords.map(word => word[0]).join('') 
        : item.label;

      return (
        <motion.div
          key={`${item.id}-${index}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 0.02 * index, 
            duration: 0.15, 
            ease: "easeOut" 
          }}
          className="relative group flex-shrink-0 flex flex-col w-1/3 px-1.5"
        >
          <Link
            href={item.href}
            onClick={handleLinkClick}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full py-3 px-1 rounded-xl',
              'transition-all duration-150',
              'hover:bg-indigo-50 dark:hover:bg-gray-800/60',
              active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300',
              'relative overflow-visible',
              'flex-grow',
            )}
            aria-label={item.label}
            title={item.label}
          >
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center mx-auto',
              'transition-colors duration-150',
              active 
                ? 'bg-indigo-100 dark:bg-indigo-900/40' 
                : 'bg-gray-100/80 dark:bg-gray-800/40',
              'group-hover:bg-indigo-100/80 dark:group-hover:bg-indigo-900/30',
              'shadow-sm flex-shrink-0',
              'border border-gray-200/50 dark:border-gray-700/50' // Add subtle border
            )}>
              <IconComponent 
                className={cn(
                  'w-4 h-4',
                  active 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-600/90 dark:text-gray-400/90',
                  'transition-colors duration-150',
                  'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
                  'flex-shrink-0'
                )} 
                aria-hidden="true" 
              />
            </div>
            <span className="text-[10px] font-medium leading-tight text-center px-0.5 line-clamp-2 h-8 flex items-center justify-center w-full">
              {displayLabel}
            </span>
            
            {active && (
              <motion.span 
                className="absolute bottom-3 h-0.5 w-1/3 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                layoutId="activeIndicator"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
          </Link>
        </motion.div>
      );
    };

    const renderCategory = (category: keyof typeof navigationGroups, index: number) => {
      const items = navigationGroups[category];
      if (!items.length) return null;

      return (
        <div key={category} className="mb-3 last:mb-0">
          <h3 className="px-2 mb-2 text-[11px] font-semibold text-gray-500/90 dark:text-gray-400/90 uppercase tracking-wider">
            {categoryTitles[category]}
          </h3>
          <div className="flex flex-wrap -mx-1.5 w-full">
            {items.map((item, itemIndex) => renderIconItem(item, itemIndex))}
          </div>
        </div>
      );
    };

    return (
      <div className={cn('w-full h-full overflow-y-auto pb-20', className)}>
        <nav className="py-3 space-y-5 w-full px-3" role="navigation" aria-label="Mobile icon navigation">
          {Object.keys(navigationGroups).map((category, index) => 
            renderCategory(category as keyof typeof navigationGroups, index)
          )}
        </nav>
      </div>
    );
  };

  const renderFooterMenu = () => (
    <div className={cn('grid grid-cols-1 md:grid-cols-4 gap-8', className)}>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Product
        </h3>
        <ul className="space-y-2">
          {filteredNavigation.primary.map(item => (
            <li key={item.id}>
              <a
                href={item.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Tools
        </h3>
        <ul className="space-y-2">
          {filteredNavigation.tools.map(item => (
            <li key={item.id}>
              <a
                href={item.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Career
        </h3>
        <ul className="space-y-2">
          {filteredNavigation.career.map(item => (
            <li key={item.id}>
              <a
                href={item.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Company
        </h3>
        <ul className="space-y-2">
          {filteredNavigation.company.map(item => (
            <li key={item.id}>
              <a
                href={item.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  switch (variant) {
    case 'header':
      return renderHeaderMenu();
    case 'sidebar':
      return renderSidebarMenu();
    case 'mobile':
      return renderMobileMenu();
    case 'footer':
      return renderFooterMenu();
    default:
      return renderHeaderMenu();
  }
};

export default DynamicMenuGenerator;
