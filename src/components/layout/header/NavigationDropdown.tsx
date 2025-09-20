"use client"
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, X, HelpCircle, BookOpen, Users, Briefcase, Code, MessageSquare, Zap } from 'lucide-react';
import { getCompanyNavigation } from '@/config/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { createTranslationFallback } from '@/utils/header/header.utils';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface NavigationDropdownProps {
  isHome: boolean;
  isScrolled: boolean;
}

const NavigationDropdown: React.FC<NavigationDropdownProps> = ({ isHome, isScrolled }) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const tr = createTranslationFallback(t);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'company' | 'resources' | 'help'>('company');

  // Navigation data
  const companyNavLinks = getCompanyNavigation().map(item => ({
    ...item,
    label: item.id === 'blogs' ? (t('nav.blogs') !== 'nav.blogs' ? t('nav.blogs') : item.label) :
      item.id === 'about' ? tr('nav.about', item.label) :
        item.id === 'contact' ? tr('nav.contact', item.label) :
          item.id === 'settings' ? tr('nav.settings', item.label) :
            item.label,
    external: false
  }));

  const resourceItems = [
    {
      id: 'documentation',
      label: 'Documentation',
      description: 'Comprehensive guides and API references',
      icon: BookOpen,
      href: '/docs'
    },
    {
      id: 'community',
      label: 'Community',
      description: 'Join our developer community',
      icon: Users,
      href: '/community'
    },
    {
      id: 'careers',
      label: 'Careers',
      description: 'Join our team',
      icon: Briefcase,
      href: '/careers'
    },
    {
      id: 'changelog',
      label: 'Changelog',
      description: 'Latest updates and releases',
      icon: Code,
      href: '/changelog'
    }
  ];

  const helpItems = [
    {
      id: 'support',
      label: 'Support Center',
      description: 'Get help with any issues',
      icon: HelpCircle,
      href: '/support'
    },
    {
      id: 'contact',
      label: 'Contact Us',
      description: 'Get in touch with our team',
      icon: MessageSquare,
      href: '/contact'
    },
    {
      id: 'status',
      label: 'Status',
      description: 'Check our system status',
      icon: Zap,
      href: '/status'
    }
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveTab('company');
    }
  };

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative h-full flex items-center">
      <button
        type="button"
        className={cn(
          'flex items-center gap-1 px-3 py-2 h-full text-sm font-medium rounded-lg transition-colors',
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50',
          isOpen && 'text-primary-600 dark:text-primary-400 bg-gray-100 dark:bg-gray-800/70',
          isHome && !isScrolled ? 'text-white hover:bg-white/10' : ''
        )}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label="More navigation options"
      >
        <span>More</span>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-0 w-[480px] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">More from Drapels</h3>
                <button 
                  onClick={closeDropdown}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                {[
                  { id: 'company' as const, label: 'Company', icon: Briefcase },
                  { id: 'resources' as const, label: 'Resources', icon: BookOpen },
                  { id: 'help' as const, label: 'Help', icon: HelpCircle },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                      activeTab === tab.id 
                        ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 max-h-[400px] overflow-y-auto">
              {activeTab === 'company' && (
                <div className="grid grid-cols-2 gap-4">
                  {companyNavLinks.map((link) => {
                    const IconComponent = link.icon as React.ComponentType<{ className?: string }>;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        onClick={closeDropdown}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                              {link.label}
                            </div>
                            {link.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {link.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="grid grid-cols-2 gap-4">
                  {resourceItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={closeDropdown}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {item.label}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {activeTab === 'help' && (
                <div className="grid grid-cols-2 gap-4">
                  {helpItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={closeDropdown}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {item.label}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}