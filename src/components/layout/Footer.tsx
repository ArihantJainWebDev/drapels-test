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
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-accent-800 dark:text-white">
                  Drapels
                </span>
              </Link>
              
              <p className="text-accent-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
                Your comprehensive ecosystem for developer tools, documentation, challenges, and community. 
                Build, collaborate, and grow with thousands of developers worldwide.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-accent-600 dark:text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>hello@drapels.com</span>
                </div>
                <div className="flex items-center space-x-3 text-accent-600 dark:text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-accent-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 bg-gray-100 dark:bg-accent-800 rounded-lg flex items-center justify-center text-accent-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold text-accent-800 dark:text-white mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.title}>
                        <Link
                          href={link.href}
                          className="flex items-center space-x-2 text-accent-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 group"
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                          <span>{link.title}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
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
        <div className="py-8 border-t border-gray-200 dark:border-accent-700">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h3 className="text-lg font-semibold text-accent-800 dark:text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-accent-600 dark:text-gray-300">
                Get the latest tools, challenges, and community updates delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 border border-gray-300 dark:border-accent-600 rounded-lg bg-white dark:bg-accent-800 text-accent-800 dark:text-white placeholder-accent-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-0 sm:w-80"
              />
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200 dark:border-accent-700">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-accent-500 dark:text-gray-400">
              <p> 2025 Drapels. {t('footer.rights') || 'All rights reserved.'}</p>
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link href="/cookies" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-accent-500 dark:text-gray-400">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>for developers worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;