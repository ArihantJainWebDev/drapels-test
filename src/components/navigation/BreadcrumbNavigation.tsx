import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home, Code, MessageSquare, Building2, Settings, User, BookOpen, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getNavigationItemByHref, NavigationItem } from '@/config/navigation';
import { cn } from '@/lib/utils';

interface BreadcrumbNavigationProps {
  className?: string;
  showHome?: boolean;
  maxItems?: number;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  className,
  showHome = true,
  maxItems = 4
}) => {
  const pathname = usePathname() as string;
  
  const generateBreadcrumbs = (): NavigationItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: NavigationItem[] = [];
    
    // Add home if requested and not already on home page
    if (showHome && pathname !== '/') {
      breadcrumbs.push({
        id: 'home',
        label: 'Home',
        href: '/',
        icon: Home
      });
    }
    
    // Build breadcrumbs from path segments
    let currentPath = '';
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;
      const navItem = getNavigationItemByHref(currentPath);
      
      if (navItem) {
        breadcrumbs.push(navItem);
      } else {
        breadcrumbs.push({
          id: segment,
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          href: currentPath,
        });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  if (pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  const displayBreadcrumbs = breadcrumbs.length > maxItems 
    ? [
        breadcrumbs[0],
        { id: 'ellipsis', label: '...', href: '#' },
        ...breadcrumbs.slice(-2)
      ]
    : breadcrumbs;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('bg-[#FFF8EE] dark:bg-black', className)}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="rounded-full bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-md px-4 py-2">
        <Breadcrumb>
          <BreadcrumbList>
            <AnimatePresence mode="wait">
              {displayBreadcrumbs.map((item, index) => {
                const isLast = index === displayBreadcrumbs.length - 1;
                const isEllipsis = item.id === 'ellipsis';
                const IconComponent = item.icon;

                return (
                  <React.Fragment key={item.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: index * 0.1, duration: 0.2 }}
                    >
                      <BreadcrumbItem>
                        {isEllipsis ? (
                          <span className="text-gray-400 dark:text-gray-600">...</span>
                        ) : isLast ? (
                          <BreadcrumbPage className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            {item.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link
                              href={item.href}
                              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#1EB36B] dark:hover:text-[#1EB36B] transition-colors duration-200"
                            >
                              {IconComponent && <IconComponent className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                              {item.label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </motion.div>
                    
                    {!isLast && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.1, duration: 0.2 }}
                      >
                        <BreadcrumbSeparator>
                          <ChevronRight className="w-4 h-4 text-[#1EB36B]/60" />
                        </BreadcrumbSeparator>
                      </motion.div>
                    )}
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
          </BreadcrumbList>
        </Breadcrumb>
        </div>
      </div>
    </motion.div>
  );
};
