"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCompanyNavigation } from '@/config/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { createTranslationFallback } from '@/utils/header/header.utils';

interface NavigationDropdownProps {
  isHome: boolean;
  isScrolled: boolean;
}

const NavigationDropdown: React.FC<NavigationDropdownProps> = ({ isHome, isScrolled }) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const tr = createTranslationFallback(t);

  // Company navigation with SEO optimization
  const companyNavLinks = getCompanyNavigation().map(item => ({
    ...item,
    label: item.id === 'blogs' ? (t('nav.blogs') !== 'nav.blogs' ? t('nav.blogs') : item.label) :
      item.id === 'about' ? tr('nav.about', item.label) :
        item.id === 'contact' ? tr('nav.contact', item.label) :
          item.id === 'settings' ? tr('nav.settings', item.label) :
            item.label,
    external: false
  }));

  const isActive = (href: string) => pathname === href;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
        >
          More
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 bg-white dark:bg-gray-800 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-2"
        sideOffset={8}
      >
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Company & Support</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Learn more about Drapels</p>
        </div>
        {companyNavLinks.map((link) => {
          const IconComponent = link.icon as React.ComponentType<{ className?: string }>;
          const active = !link.external && isActive(link.href);
          
          return (
            <DropdownMenuItem key={link.href} asChild>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.seoTitle}
                  className="flex items-start gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group rounded-lg"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20 transition-colors">
                    <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {link.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {link.description}
                    </div>
                  </div>
                </a>
              ) : (
                <Link
                  href={link.href}
                  title={link.seoTitle}
                  className="flex items-start gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group rounded-lg"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20 transition-colors">
                    <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {link.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {link.description}
                    </div>
                  </div>
                </Link>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationDropdown;