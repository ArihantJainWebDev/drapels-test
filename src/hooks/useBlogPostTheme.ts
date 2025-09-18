import { useEffect } from 'react';

export const useBlogPostTheme = () => {
  useEffect(() => {
    // Instead of modifying global theme, we'll just ensure BlogPost content uses light mode
    // The BlogPost component itself will handle light-only styling
    // No global theme manipulation needed since BlogPost is hardcoded to light mode
    
    return () => {
      // No cleanup needed since we're not modifying global theme
    };
  }, []);
};
