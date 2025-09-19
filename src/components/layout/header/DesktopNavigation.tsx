"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code } from 'lucide-react';
import { getPrimaryNavigation } from '@/config/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getNavLinkClasses, createTranslationFallback } from '@/utils/header/header.utils';
import NavigationDropdown from './NavigationDropdown';

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
    <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
      {primaryNavLinks.map((link, index) => {
        const IconComponent = link.icon;
        const active = isActive(link.href);
        
        return (
          <div key={link.href} className="relative">
            <Link
              href={link.href}
              title={link.seoTitle}
              className={`${getNavLinkClasses(active, isHome, isScrolled)} px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 flex items-center gap-2`}
              aria-current={active ? "page" : undefined}
            >
              {IconComponent && <IconComponent className="w-4 h-4" />}
              {link.label}
            </Link>
            {active && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
            )}
          </div>
        );
      })}

      {/* More Dropdown */}
      <NavigationDropdown isHome={isHome} isScrolled={isScrolled} />
    </nav>
  );
};

export default DesktopNavigation;