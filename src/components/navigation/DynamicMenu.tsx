import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigation } from './NavigationManager';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface DynamicMenuProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  showIcons?: boolean;
  showDescriptions?: boolean;
  maxDepth?: number;
  variant?: 'default' | 'compact' | 'sidebar';
}

export const DynamicMenu: React.FC<DynamicMenuProps> = ({
  orientation = 'horizontal',
  className,
  showIcons = true,
  showDescriptions = false,
  maxDepth = 2,
  variant = 'default'
}) => {
  const { navigationItems, activeItem } = useNavigation();
  const location = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => location === href;

  const renderMenuItem = (item: any, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const active = isActive(item.href);
    const IconComponent = item.icon;

    if (orientation === 'horizontal' && hasChildren && depth === 0) {
      // Horizontal dropdown menu
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                active && "bg-primary text-primary-foreground",
                variant === 'compact' && "px-2 py-1 text-sm"
              )}
            >
              {showIcons && IconComponent && <IconComponent className="w-4 h-4" />}
              {item.label}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {showDescriptions && item.description && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {item.description}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            {item.children.map((child: any) => (
              <DropdownMenuItem key={child.id} asChild>
                <Link
                  href={child.href}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                >
                  {showIcons && child.icon && (
                    <div className="p-2 rounded-lg bg-muted">
                      <child.icon className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{child.label}</div>
                    {showDescriptions && child.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {child.description}
                      </div>
                    )}
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // Vertical menu item or leaf item
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative",
          depth > 0 && "ml-4 border-l border-border pl-4"
        )}
      >
        <div className="flex items-center">
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 flex-1",
              active && "bg-primary text-primary-foreground shadow-sm",
              !active && "hover:bg-muted",
              variant === 'compact' && "px-2 py-1 text-sm",
              variant === 'sidebar' && "w-full justify-start"
            )}
          >
            {showIcons && IconComponent && (
              <IconComponent className={cn(
                "w-4 h-4",
                variant === 'compact' && "w-3 h-3"
              )} />
            )}
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
          
          {hasChildren && orientation === 'vertical' && depth < maxDepth && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(item.id)}
              className="ml-2 p-1 h-auto"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </Button>
          )}
        </div>

        {showDescriptions && item.description && (
          <p className="text-xs text-muted-foreground mt-1 px-3">
            {item.description}
          </p>
        )}

        <AnimatePresence>
          {hasChildren && orientation === 'vertical' && isExpanded && depth < maxDepth && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 space-y-1"
            >
              {item.children.map((child: any) => renderMenuItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <nav
      className={cn(
        "flex gap-2",
        orientation === 'vertical' && "flex-col space-y-1",
        orientation === 'horizontal' && "flex-row items-center space-x-2",
        className
      )}
      role="navigation"
    >
      {navigationItems.map(item => renderMenuItem(item))}
    </nav>
  );
};