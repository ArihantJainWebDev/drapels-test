"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import { getPrimaryNavigation } from '@/config/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getNavLinkClasses, createTranslationFallback } from '@/utils/header/header.utils';
import NavigationDropdown from './NavigationDropdown';
import ToolsDropdown from './ToolsDropdown';

interface DesktopNavigationProps {
  isHome: boolean;
  isScrolled: boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ isHome, isScrolled }) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const tr = createTranslationFallback(t);

  // Get navigation items from configuration
  const primaryNavLinks = getPrimaryNavigation().map(item => ({
    ...item,
    label: item.id === 'home' ? tr('nav.home', item.label) :
      item.id === 'roadmaps' ? tr('nav.roadmaps', item.label) :
        item.id === 'community' ? tr('nav.community', item.label) :
          item.label
  }));

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="hidden lg:flex items-center space-x-1 p-2 rounded-md" role="navigation" aria-label="Main navigation">
      {primaryNavLinks.map((link, index) => {
        const IconComponent = link.icon;
        const active = isActive(link.href);
        
        return (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={link.href}
              title={link.seoTitle}
              className={getNavLinkClasses(active, isHome, isScrolled)}
              aria-current={active ? "page" : undefined}
            >
              {IconComponent && <IconComponent className="w-4 h-4" />}
              {link.label}
              {active && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-3 right-3 bottom-1 h-0.5 rounded-full bg-[#1EB36B]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}

      {/* Tools Dropdown */}
      <ToolsDropdown />

      {/* More Dropdown */}
      <NavigationDropdown isHome={isHome} isScrolled={isScrolled} />
    </nav>
  );
};

export default DesktopNavigation;