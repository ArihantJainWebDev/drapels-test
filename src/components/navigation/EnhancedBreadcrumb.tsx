import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigation } from './NavigationManager';
import { cn } from '@/lib/utils';

interface EnhancedBreadcrumbProps {
  className?: string;
  showHome?: boolean;
  maxItems?: number;
  separator?: React.ReactNode;
}

export const EnhancedBreadcrumb: React.FC<EnhancedBreadcrumbProps> = ({
  className,
  showHome = true,
  maxItems = 5,
  separator = <ChevronRight className="w-4 h-4 text-muted-foreground" />
}) => {
  const { breadcrumbs } = useNavigation();

  if (!breadcrumbs.length) return null;

  // Truncate breadcrumbs if they exceed maxItems
  const displayBreadcrumbs = breadcrumbs.length > maxItems 
    ? [
        ...breadcrumbs.slice(0, 1),
        { id: 'ellipsis', label: '...', href: '#' },
        ...breadcrumbs.slice(-maxItems + 2)
      ]
    : breadcrumbs;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      {showHome && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </motion.div>
          {breadcrumbs.length > 0 && (
            <span className="text-muted-foreground">{separator}</span>
          )}
        </>
      )}

      {displayBreadcrumbs.map((item, index) => {
        const isLast = index === displayBreadcrumbs.length - 1;
        const isEllipsis = item.id === 'ellipsis';

        return (
          <React.Fragment key={item.id}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center"
            >
              {isEllipsis ? (
                <span className="text-muted-foreground px-2">...</span>
              ) : isLast ? (
                <span 
                  className="font-medium text-foreground truncate max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}
            </motion.div>
            
            {!isLast && (
              <span className="text-muted-foreground">{separator}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};