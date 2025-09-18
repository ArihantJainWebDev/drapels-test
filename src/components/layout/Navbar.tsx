'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Sun, 
  Moon, 
  User, 
  Menu, 
  X,
  Home,
  Wrench,
  BookOpen,
  Trophy,
  Users,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationTabs = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Tools', href: '/tools', icon: Wrench },
    { name: 'Docs', href: '/docs', icon: BookOpen },
    { name: 'Challenges', href: '/challenges', icon: Trophy },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-accent-900/95 backdrop-blur-md border-b border-gray-200 dark:border-accent-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold text-accent-800 dark:text-white group-hover:text-primary-600 transition-colors">
                Drapels
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className="flex items-center space-x-1 text-accent-800 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 group"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></div>
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search tools, docs, or challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 dark:border-accent-600 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                />
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={handleProfile}
                  className="flex items-center space-x-2 text-accent-800 dark:text-gray-300 hover:text-primary-600"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.displayName || 'Profile'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="text-accent-800 border-accent-300 hover:bg-accent-50 dark:text-gray-300 dark:border-accent-600 dark:hover:bg-accent-800"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="text-accent-800 dark:text-gray-300 hover:text-primary-600"
                >
                  Login
                </Button>
                <Button
                  onClick={handleSignup}
                  className="bg-secondary-700 hover:bg-secondary-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search tools, docs, or challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 dark:border-accent-600 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-accent-900 border-t border-gray-200 dark:border-accent-700"
          >
            <div className="px-4 py-4 space-y-3">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 text-accent-800 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
