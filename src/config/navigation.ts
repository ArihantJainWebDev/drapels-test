import { 
  Home, 
  Trophy, 
  MessageSquare, 
  DollarSign, 
  Code, 
  Brain, 
  Sparkles, 
  GraduationCap, 
  User, 
  Mail, 
  FileText, 
  Building2, 
  BookOpen, 
  Info, 
  Phone, 
  Cog,
  Zap,
  Target,
  Users,
  Calendar,
  BarChart3,
  Briefcase,
  Globe,
  Shield,
  HelpCircle
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  seoTitle?: string;
  badge?: string;
  children?: NavigationItem[];
  external?: boolean;
  requiresAuth?: boolean;
  category?: 'primary' | 'tools' | 'career' | 'community' | 'company';
  priority?: number;
  isNew?: boolean;
  isPopular?: boolean;
}

export const navigationConfig: NavigationItem[] = [
  // Primary Navigation
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: Home,
    description: 'Welcome to Drapels',
    seoTitle: 'Drapels - Tech Career Development Platform',
    category: 'primary',
    priority: 1
  },
  {
    id: 'roadmaps',
    label: 'Learning Roadmaps',
    href: '/roadmap',
    icon: Trophy,
    description: 'Interactive career learning paths',
    seoTitle: 'Tech Career Roadmaps - Programming Learning Paths',
    category: 'primary',
    priority: 2,
    isPopular: true
  },
  {
    id: 'community',
    label: 'Developer Community',
    href: '/community',
    icon: MessageSquare,
    description: 'Connect with tech professionals',
    seoTitle: 'Tech Community - Connect with Developers Worldwide',
    category: 'primary',
    priority: 3,
    children: [
      {
        id: 'community-forums',
        label: 'Discussion Forums',
        href: '/community',
        icon: MessageSquare,
        description: 'Join discussions with developers',
        seoTitle: 'Developer Forums - Tech Discussions'
      },
      {
        id: 'community-events',
        label: 'Events',
        href: '/community/events',
        icon: Calendar,
        description: 'Upcoming tech events and meetups',
        seoTitle: 'Tech Events - Developer Meetups'
      }
    ]
  },
  {
    id: 'pricing',
    label: 'Pricing',
    href: '/pricing',
    icon: DollarSign,
    description: 'Plans & pricing for individuals and teams',
    seoTitle: 'Plans & Pricing - Drapels',
    category: 'primary',
    priority: 4
  },

  // Tools Navigation
  {
    id: 'tools',
    label: 'Developer Tools',
    href: '/tools',
    icon: Code,
    description: 'Comprehensive developer toolkit',
    seoTitle: 'Developer Tools - Complete Toolkit for Programmers',
    category: 'tools',
    priority: 5,
    children: [
      {
        id: 'neuron',
        label: 'Neuron AI DSA Solver',
        href: '/neuron',
        icon: Brain,
        description: 'AI-powered DSA problem solver with guided learning',
        seoTitle: 'Neuron AI DSA Solver - Data Structures & Algorithms Solutions',
        isNew: true,
        isPopular: true
      },
      {
        id: 'neuron-ai',
        label: 'Neuron Conversational AI',
        href: '/neuron-ai',
        icon: Brain,
        description: 'Interactive conversational AI for guided DSA learning',
        seoTitle: 'Neuron Conversational AI - Interactive DSA Learning',
        isNew: true,
        isPopular: true
      },
      {
        id: 'nexa',
        label: 'Nexa Voice Assistant',
        href: '/nexa',
        icon: Sparkles,
        description: 'Talk to your career & company tech assistant',
        seoTitle: 'Nexa - AI Career & Company Tech Voice Assistant',
        isNew: true
      },
      {
        id: 'quiz',
        label: 'AI-Powered Quiz',
        href: '/quiz',
        icon: Zap,
        description: 'Test your knowledge with adaptive AI quizzes',
        seoTitle: 'AI Programming Quiz - Test Your Coding Skills'
      },
      {
        id: 'compiler',
        label: 'Online Compiler',
        href: '/compiler',
        icon: Code,
        description: 'Code, compile and debug online',
        seoTitle: 'Online Code Compiler - Write and Execute Code in Browser'
      },
      {
        id: 'courses',
        label: 'Course Platform',
        href: '/courses',
        icon: GraduationCap,
        description: 'Learn with interactive courses and hands-on projects',
        seoTitle: 'Course Platform - Interactive Learning with AI-Powered Feedback'
      },
      {
        id: 'dsa-sheet',
        label: 'DSA Practice Sheet',
        href: '/dsa-sheet',
        icon: Target,
        description: 'Master data structures and algorithms',
        seoTitle: 'Data Structures & Algorithms Practice - Coding Problems'
      },
      {
        id: 'interview-prep',
        label: 'Interview Preparation',
        href: '/interview-preparation',
        icon: User,
        description: 'Ace your tech interviews with AI mock interviews',
        seoTitle: 'Technical Interview Preparation - Coding Interview Practice'
      },
      {
        id: 'mock-interview',
        label: 'Mock Interview Simulator',
        href: '/mock-interview',
        icon: User,
        description: 'Full AI-powered mock interview simulation with video recording',
        seoTitle: 'Mock Interview Simulator - AI Interview Practice with Video Recording',
        isNew: true,
        isPopular: true
      }
    ]
  },

  // Career Tools
  {
    id: 'career-tools',
    label: 'Career Development',
    href: '/career',
    icon: Briefcase,
    description: 'Tools to advance your tech career',
    seoTitle: 'Career Development Tools - Tech Career Advancement',
    category: 'career',
    priority: 6,
    children: [
      {
        id: 'companies',
        label: 'Top Tech Companies',
        href: '/companies',
        icon: Building2,
        description: 'Explore career opportunities and company insights',
        seoTitle: 'Top Tech Companies - Career Opportunities & Insights'
      },
      {
        id: 'resume-builder',
        label: 'Resume Builder',
        href: '/resume-builder',
        icon: FileText,
        description: 'Design professional resumes with ATS optimization',
        seoTitle: 'Resume Builder - Create Professional Resumes Online'
      },
      {
        id: 'email-generator',
        label: 'Professional Email Generator',
        href: '/email-generator',
        icon: Mail,
        description: 'AI-powered professional email templates',
        seoTitle: 'AI Email Generator - Professional Email Templates'
      }
    ]
  },

  // Company & Support
  {
    id: 'company',
    label: 'Company & Support',
    href: '/company',
    icon: Info,
    description: 'Learn about Drapels and get support',
    seoTitle: 'About Drapels - Company Information & Support',
    category: 'company',
    priority: 7,
    children: [
      {
        id: 'docs',
        label: 'Documentation',
        href: '/docs',
        icon: BookOpen,
        description: 'Comprehensive guides for AI tools and platform features',
        seoTitle: 'Documentation - AI Tools & Platform Guide'
      },
      {
        id: 'blogs',
        label: 'Blogs',
        href: '/blogs',
        icon: MessageSquare,
        description: 'Read our latest articles and updates',
        seoTitle: 'Drapels Blog - Articles, Guides, and Updates'
      },
      {
        id: 'about',
        label: 'About Drapels',
        href: '/about',
        icon: Info,
        description: 'Learn about our mission & vision',
        seoTitle: 'About Drapels - Empowering Tech Careers Worldwide'
      },
      {
        id: 'contact',
        label: 'Contact Support',
        href: '/contact',
        icon: Phone,
        description: 'Get help and support',
        seoTitle: 'Contact Drapels - Support & Help Center'
      },
      {
        id: 'progress',
        label: 'Progress Dashboard',
        href: '/progress',
        icon: BarChart3,
        description: 'Track your learning progress and achievements',
        seoTitle: 'Progress Dashboard - Track Your Learning Journey',
        requiresAuth: true
      },
      {
        id: 'settings',
        label: 'Account Settings',
        href: '/settings',
        icon: Cog,
        description: 'Manage your account preferences',
        seoTitle: 'Account Settings - Personalize Your Experience',
        requiresAuth: true
      }
    ]
  }
];

// Helper functions for navigation
export const getNavigationItemById = (id: string): NavigationItem | null => {
  const findItem = (items: NavigationItem[]): NavigationItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItem(item.children);
        if (found) return found;
      }
    }
    return null;
  };
  return findItem(navigationConfig);
};

export const getNavigationItemByHref = (href: string): NavigationItem | null => {
  const findItem = (items: NavigationItem[]): NavigationItem | null => {
    for (const item of items) {
      if (item.href === href) return item;
      if (item.children) {
        const found = findItem(item.children);
        if (found) return found;
      }
    }
    return null;
  };
  return findItem(navigationConfig);
};

export const getNavigationItemsByCategory = (category: string): NavigationItem[] => {
  return navigationConfig.filter(item => item.category === category);
};

export const getPrimaryNavigation = (): NavigationItem[] => {
  return navigationConfig.filter(item => item.category === 'primary').sort((a, b) => (a.priority || 0) - (b.priority || 0));
};

export const getToolsNavigation = (): NavigationItem[] => {
  const toolsItem = navigationConfig.find(item => item.id === 'tools');
  return toolsItem?.children || [];
};

export const getCareerNavigation = (): NavigationItem[] => {
  const careerItem = navigationConfig.find(item => item.id === 'career-tools');
  return careerItem?.children || [];
};

export const getCompanyNavigation = (): NavigationItem[] => {
  const companyItem = navigationConfig.find(item => item.id === 'company');
  return companyItem?.children || [];
};

export const getResourcesNavigation = (): NavigationItem[] => {
  const resourcesItem = navigationConfig.find(item => item.id === 'resources');
  return resourcesItem?.children || [];
};

export const getHelpNavigation = (): NavigationItem[] => {
  return [
    {
      id: 'help-center',
      label: 'Help Center',
      href: '/help',
      icon: HelpCircle,
      description: 'Find answers to common questions',
      seoTitle: 'Help Center - Get Support'
    },
    {
      id: 'documentation',
      label: 'Documentation',
      href: '/docs',
      icon: FileText,
      description: 'Detailed guides and API references',
      seoTitle: 'Documentation - Developer Guides'
    },
    {
      id: 'contact-support',
      label: 'Contact Support',
      href: '/contact',
      icon: Mail,
      description: 'Get in touch with our support team',
      seoTitle: 'Contact Support - Get Help'
    },
    {
      id: 'faqs',
      label: 'FAQs',
      href: '/faq',
      icon: HelpCircle,
      description: 'Frequently asked questions',
      seoTitle: 'FAQs - Frequently Asked Questions'
    }
  ];
};