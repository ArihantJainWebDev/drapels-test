'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Sparkles, 
  Code, 
  BookOpen, 
  Trophy, 
  Users 
} from 'lucide-react';

interface SearchFilterSectionProps {
  user?: any;
  t?: (key: string) => string;
}

const SearchFilterSection = ({ user, t }: SearchFilterSectionProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: Filter },
    { id: 'tools', name: 'Tools', icon: Code },
    { id: 'docs', name: 'Docs', icon: BookOpen },
    { id: 'challenges', name: 'Challenges', icon: Trophy },
    { id: 'community', name: 'Community', icon: Users }
  ];

  const filterTags = [
    { id: 'trending', name: 'Trending', icon: TrendingUp, color: 'primary' },
    { id: 'new', name: 'New', icon: Sparkles, color: 'secondary' },
    { id: 'popular', name: 'Popular', color: 'accent' },
    { id: 'featured', name: 'Featured', color: 'primary' }
  ];

  const techStacks = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Go', 'Rust', 'Java'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        category: activeFilter !== 'all' ? activeFilter : '',
      });
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    const params = new URLSearchParams({
      q: term,
      category: activeFilter !== 'all' ? activeFilter : '',
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 dark:from-accent-900/50 dark:to-accent-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-accent-800 dark:text-white mb-6">
            Find What You{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-600 bg-clip-text text-transparent">
              Need
            </span>
          </h2>
          <p className="text-xl text-accent-600 dark:text-gray-300 max-w-2xl mx-auto">
            Search through thousands of tools, docs, and challenges. Filter by category, tech stack, or popularity.
          </p>
        </motion.div>

        {/* Main Search Bar */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSearch} className="relative max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Search tools, docs, or challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 pr-32 py-6 text-lg w-full border-2 border-gray-200 dark:border-accent-600 focus:border-primary-500 focus:ring-primary-500 rounded-2xl bg-white dark:bg-accent-800 shadow-lg"
              />
              <Button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold"
              >
                Search
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? "default" : "outline"}
                  onClick={() => handleFilterChange(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeFilter === category.id
                      ? 'bg-primary-500 text-white shadow-lg hover:bg-primary-600'
                      : 'border-2 border-gray-200 dark:border-accent-600 text-accent-700 dark:text-gray-300 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-accent-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Filter Tags */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-4">
            <span className="text-sm font-semibold text-accent-600 dark:text-gray-400 uppercase tracking-wide">
              Quick Filters
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {filterTags.map((tag) => {
              const Icon = tag.icon;
              return (
                <Button
                  key={tag.id}
                  variant="ghost"
                  onClick={() => handleQuickSearch(tag.name.toLowerCase())}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-accent-600 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-accent-700 transition-all duration-300 ${
                    tag.color === 'primary' ? 'text-primary-600 hover:text-primary-700' :
                    tag.color === 'secondary' ? 'text-secondary-600 hover:text-secondary-700' :
                    'text-accent-600 hover:text-accent-700'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="font-medium">{tag.name}</span>
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Tech Stack Tags */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="mb-4">
            <span className="text-sm font-semibold text-accent-600 dark:text-gray-400 uppercase tracking-wide">
              Popular Tech Stacks
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {techStacks.map((tech) => (
              <Button
                key={tech}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickSearch(tech)}
                className="px-3 py-1 text-sm bg-white dark:bg-accent-800 border border-gray-200 dark:border-accent-600 text-accent-600 dark:text-gray-300 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-accent-700 hover:text-primary-600 rounded-lg transition-all duration-300"
              >
                {tech}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchFilterSection;
