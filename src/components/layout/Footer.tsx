'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from "@/context/LanguageContext";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin, 
  Phone,
  ArrowRight,
  Code,
  BookOpen,
  Trophy,
  Users,
  Wrench,
  ShoppingCart
} from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { title: 'Tools', href: '/tools', icon: Wrench },
        { title: 'Docs', href: '/docs', icon: BookOpen },
        { title: 'Challenges', href: '/challenges', icon: Trophy },
        { title: 'Community', href: '/community', icon: Users },
        { title: 'Marketplace', href: '/marketplace', icon: ShoppingCart }
      ]
    },
    {
      title: 'Company',
      links: [
        { title: 'About', href: '/about', icon: undefined },
        { title: 'Careers', href: '/careers', icon: undefined },
        { title: 'Blog', href: '/blog', icon: undefined },
        { title: 'Press', href: '/press', icon: undefined },
        { title: 'Partners', href: '/partners', icon: undefined }
      ]
    },
    {
      title: 'Support',
      links: [
        { title: 'Help Center', href: '/help', icon: undefined },
        { title: 'Contact', href: '/contact', icon: undefined },
        { title: 'Status', href: '/status', icon: undefined },
        { title: 'API Docs', href: '/api', icon: undefined },
        { title: 'Changelog', href: '/changelog', icon: undefined }
      ]
    },
    {
      title: 'Legal',
      links: [
        { title: 'Privacy', href: '/privacy', icon: undefined },
        { title: 'Terms', href: '/terms', icon: undefined },
        { title: 'Security', href: '/security', icon: undefined },
        { title: 'Cookies', href: '/cookies', icon: undefined },
        { title: 'GDPR', href: '/gdpr', icon: undefined }
      ]
    }
  ];

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/drapels', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/drapels', icon: Linkedin },
    { name: 'Twitter', href: 'https://twitter.com/drapels', icon: Twitter }
  ];

  return (
    <footer className="bg-white dark:bg-accent-900 border-t border-gray-200 dark:border-accent-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center">
                  <img src="/Drapels.PNG" alt="Drapels" className="w-8 h-8" />
                </div>
                <span className="text-xl font-bold text-accent-800 dark:text-white">
                  Drapels
                </span>
              </Link>
              
              <p className="text-sm text-accent-600 dark:text-gray-300 mb-4 max-w-md leading-relaxed">
                Your comprehensive ecosystem for developer tools, documentation, challenges, and community.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-accent-600 dark:text-gray-300">
                  <Mail className="w-3 h-3" />
                  <span>hello@drapels.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-accent-600 dark:text-gray-300">
                  <MapPin className="w-3 h-3" />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="w-8 h-8 bg-gray-100 dark:bg-accent-800 rounded-lg flex items-center justify-center text-accent-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="w-4 h-4" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-base font-semibold text-accent-800 dark:text-white mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.slice(0, 4).map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.title}>
                        <Link
                          href={link.href}
                          className="flex items-center space-x-2 text-sm text-accent-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 group"
                        >
                          {Icon && <Icon className="w-3 h-3" />}
                          <span>{link.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-6 border-t border-gray-200 dark:border-accent-700">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h3 className="text-base font-semibold text-accent-800 dark:text-white mb-1">
                Stay Updated
              </h3>
              <p className="text-sm text-accent-600 dark:text-gray-300">
                Get the latest updates delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 text-sm border border-gray-300 dark:border-accent-600 rounded-lg bg-white dark:bg-accent-800 text-accent-800 dark:text-white placeholder-accent-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-0 sm:w-64"
              />
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 text-sm rounded-lg font-semibold transition-colors duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-gray-200 dark:border-accent-700">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-accent-500 dark:text-gray-400">
              <p> 2025 Drapels. {t('footer.rights') || 'All rights reserved.'}</p>
              <div className="flex items-center space-x-3">
                <Link href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Privacy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Terms
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-accent-500 dark:text-gray-400">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>for developers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;