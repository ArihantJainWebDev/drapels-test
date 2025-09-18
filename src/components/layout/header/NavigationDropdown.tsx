"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings, ChevronDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { getCompanyNavigation } from '@/config/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getDropdownItemClasses, getIconWrapClasses, createTranslationFallback } from '@/utils/header/header.utils';

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

  const buttonColorClasses = isHome && !isScrolled 
    ? "text-gray-800 hover:text-gray-900 hover:bg-black/5 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5"
    : "text-gray-700 hover:text-gray-900 hover:bg-black/5 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className={`cursor-can-hover flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${buttonColorClasses}`}
          >
            <Settings className="w-4 h-4" />
            {tr('nav.more', 'More')}
            <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/30 dark:border-gray-800/30 shadow-2xl rounded-2xl p-2"
        sideOffset={12}
      >
        <DropdownMenuLabel className="text-sm font-bold text-gray-900 dark:text-gray-100 px-4 py-3 bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-900/50 dark:to-indigo-950/20 rounded-xl mb-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            Company & Support
          </div>
        </DropdownMenuLabel>
        {companyNavLinks.map((link, index) => {
          const IconComponent = link.icon as React.ComponentType<{ className?: string }>;
          const active = !link.external && isActive(link.href);
          
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <DropdownMenuItem asChild>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.seoTitle}
                    className={getDropdownItemClasses(active)}
                  >
                    <motion.div
                      className={getIconWrapClasses(active)}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                        {link.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {link.description}
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    title={link.seoTitle}
                    className={getDropdownItemClasses(active)}
                  >
                    <motion.div
                      className={getIconWrapClasses(active)}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                        {link.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {link.description}
                      </div>
                    </div>
                  </Link>
                )}
              </DropdownMenuItem>
            </motion.div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationDropdown;