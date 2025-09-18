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
}

export const DynamicMenuGenerator: React.FC<DynamicMenuGeneratorProps> = ({
  variant = 'header',
  className,
  showCategories = true,
  maxItemsPerCategory = 6
}) => {
  const { user } = useAuth();
  const pathname = usePathname();

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

  const renderMobileMenu = () => (
    <div className={cn('space-y-4 p-4', className)}>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Main Navigation
        </h3>
        {filteredNavigation.primary.map((item, index) => {
          const IconComponent = item.icon;
          const active = isActive(item.href);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <a
                href={item.href}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                  active
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                )}
              >
                {IconComponent && (
                  <IconComponent className={cn(
                    'w-5 h-5',
                    active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                  )} />
                )}
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.description}
                    </div>
                  )}
                </div>
                {(item.isNew || item.isPopular) && (
                  <div className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    item.isNew 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  )}>
                    {item.isNew ? 'New' : 'Popular'}
                  </div>
                )}
              </a>
            </motion.div>
          );
        })}
      </div>

      <ProgressiveDisclosure
        items={filteredNavigation.tools}
        title="Developer Tools"
        variant="compact"
        defaultExpanded={false}
      />

      <ProgressiveDisclosure
        items={filteredNavigation.career}
        title="Career Development"
        variant="compact"
        defaultExpanded={false}
      />

      <ProgressiveDisclosure
        items={filteredNavigation.company}
        title="Company & Support"
        variant="compact"
        defaultExpanded={false}
      />
    </div>
  );

  const renderFooterMenu = () => (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-8', className)}>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Platform
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
          Developer Tools
        </h3>
        <ul className="space-y-2">
          {filteredNavigation.tools.slice(0, 5).map(item => (
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
