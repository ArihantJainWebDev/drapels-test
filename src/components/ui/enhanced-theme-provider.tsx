import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink';
type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type FontSize = 'sm' | 'base' | 'lg';

interface ThemeConfig {
  theme: Theme;
  colorScheme: ColorScheme;
  borderRadius: BorderRadius;
  fontSize: FontSize;
  reducedMotion: boolean;
  highContrast: boolean;
}

interface ThemeContextType extends ThemeConfig {
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setBorderRadius: (radius: BorderRadius) => void;
  setFontSize: (size: FontSize) => void;
  setReducedMotion: (reduced: boolean) => void;
  setHighContrast: (contrast: boolean) => void;
  resetToDefaults: () => void;
  actualTheme: 'light' | 'dark';
}

const defaultConfig: ThemeConfig = {
  theme: 'system',
  colorScheme: 'blue',
  borderRadius: 'md',
  fontSize: 'base',
  reducedMotion: false,
  highContrast: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useEnhancedTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');
  }
  return context;
};

interface EnhancedThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const EnhancedThemeProvider: React.FC<EnhancedThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'enhanced-theme-config'
}) => {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    if (typeof window === 'undefined') {
      return { ...defaultConfig, theme: defaultTheme };
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return { ...defaultConfig, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to parse stored theme config:', error);
    }

    return { ...defaultConfig, theme: defaultTheme };
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Save config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
    } catch (error) {
      console.warn('Failed to save theme config:', error);
    }
  }, [config, storageKey]);

  // Handle system theme detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateActualTheme = () => {
      if (config.theme === 'system') {
        setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setActualTheme(config.theme);
      }
    };

    updateActualTheme();
    mediaQuery.addEventListener('change', updateActualTheme);

    return () => mediaQuery.removeEventListener('change', updateActualTheme);
  }, [config.theme]);

  // Apply theme classes to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme
    root.classList.add(actualTheme);
    
    // Apply color scheme
    root.setAttribute('data-color-scheme', config.colorScheme);
    
    // Apply border radius
    root.setAttribute('data-border-radius', config.borderRadius);
    
    // Apply font size
    root.setAttribute('data-font-size', config.fontSize);
    
    // Apply accessibility preferences
    if (config.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    if (config.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [actualTheme, config]);

  const updateConfig = (updates: Partial<ThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const value: ThemeContextType = {
    ...config,
    actualTheme,
    setTheme: (theme) => updateConfig({ theme }),
    setColorScheme: (colorScheme) => updateConfig({ colorScheme }),
    setBorderRadius: (borderRadius) => updateConfig({ borderRadius }),
    setFontSize: (fontSize) => updateConfig({ fontSize }),
    setReducedMotion: (reducedMotion) => updateConfig({ reducedMotion }),
    setHighContrast: (highContrast) => updateConfig({ highContrast }),
    resetToDefaults: () => setConfig(defaultConfig),
  };

  return (
    <ThemeContext.Provider value={value}>
      <motion.div
        key={`${actualTheme}-${config.colorScheme}-${config.borderRadius}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: config.reducedMotion ? 0 : 0.3 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </ThemeContext.Provider>
  );
};

// Theme customization CSS variables
export const themeVariables = `
  /* Color Schemes */
  [data-color-scheme="blue"] {
    --primary: 221 83% 53%;
    --primary-foreground: 210 40% 98%;
  }
  
  [data-color-scheme="green"] {
    --primary: 142 76% 36%;
    --primary-foreground: 355 100% 97%;
  }
  
  [data-color-scheme="purple"] {
    --primary: 262 83% 58%;
    --primary-foreground: 210 40% 98%;
  }
  
  [data-color-scheme="orange"] {
    --primary: 25 95% 53%;
    --primary-foreground: 210 40% 98%;
  }
  
  [data-color-scheme="red"] {
    --primary: 0 84% 60%;
    --primary-foreground: 210 40% 98%;
  }
  
  [data-color-scheme="pink"] {
    --primary: 322 81% 67%;
    --primary-foreground: 210 40% 98%;
  }

  /* Border Radius */
  [data-border-radius="none"] {
    --radius: 0px;
  }
  
  [data-border-radius="sm"] {
    --radius: 0.25rem;
  }
  
  [data-border-radius="md"] {
    --radius: 0.375rem;
  }
  
  [data-border-radius="lg"] {
    --radius: 0.5rem;
  }
  
  [data-border-radius="xl"] {
    --radius: 0.75rem;
  }

  /* Font Sizes */
  [data-font-size="sm"] {
    font-size: 14px;
  }
  
  [data-font-size="base"] {
    font-size: 16px;
  }
  
  [data-font-size="lg"] {
    font-size: 18px;
  }

  /* Accessibility */
  .reduce-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .high-contrast {
    --border: 0 0% 0%;
    --input: 0 0% 0%;
    --ring: 0 0% 0%;
  }
  
  .dark.high-contrast {
    --border: 0 0% 100%;
    --input: 0 0% 100%;
    --ring: 0 0% 100%;
  }
`;