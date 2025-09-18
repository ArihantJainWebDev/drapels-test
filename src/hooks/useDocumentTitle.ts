import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const routeTitles: Record<string, string> = {
  '/': 'Drapels - Home',
  '/roadmap': 'Drapels - Roadmap Generator',
  '/companies': 'Drapels - Company Insights',
  '/email-generator': 'Drapels - Email Generator',
  '/dsa-sheet': 'Drapels - DSA Sheet',
  '/interview-preparation': 'Drapels - Interview Preparation',
  '/about': 'Drapels - About Us',
  '/contact': 'Drapels - Contact Us',
  '/login': 'Drapels - Login',
  '/forgot-password': 'Drapels - Forgot Password',
  '/reset-password': 'Drapels - Reset Password',
  '/profile': 'Drapels - My Profile',
  '/settings': 'Drapels - Settings',
  '/quiz': 'Drapels - AI Quiz',
  '/community': 'Drapels - Community',
  '/community/events': 'Drapels - Community Events',
  '/events': 'Drapels - Events',
  '/resume-builder': 'Drapels - Resume Builder',
  '/blogs': 'Drapels - Blog',
  '/blogs/create': 'Drapels - Create Blog Post',
  '/admin': 'Drapels - Admin Panel',
  '/username': 'Drapels - Setup Username'
};

const getPageTitle = (pathname: string): string => {
  // Check for blog post route
  if (pathname.startsWith('/blogs/')) {
    const slug = pathname.split('/')[2];
    if (slug && slug !== 'create' && slug !== 'edit') {
      return document.title; // Will be set by BlogPost component
    }
    if (pathname.includes('/edit/')) {
      return 'Drapels - Edit Blog Post';
    }
  }
  
  // Check for user profile route
  if (pathname.startsWith('/user/')) {
    const username = pathname.split('/')[2];
    return `Drapels - ${username}'s Profile`;
  }

  // Check for community post route
  if (pathname.startsWith('/community/post/')) {
    return 'Drapels - Community Post';
  }

  // Check for channel route
  if (pathname.startsWith('/c/') || pathname.startsWith('/channel/')) {
    const channelName = pathname.split('/')[2];
    return `Drapels - ${channelName.charAt(0).toUpperCase() + channelName.slice(1)}`;
  }

  // Default to route title or fallback
  return routeTitles[pathname] || 'Drapels';
};

export const useDocumentTitle = (title?: string) => {
  const pathname = usePathname() as string;

  useEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = getPageTitle(pathname);
    }
  }, [pathname, title]);

  return null;
};

export default useDocumentTitle;
