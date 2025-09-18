'use client'

import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="ml-2 p-2 rounded-full hover:opacity-80 transition flex items-center justify-center"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <Moon className="w-5 h-5 text-indigo-500 transition-transform rotate-0" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400 transition-transform rotate-0" />
      )}
    </button>
  );
};

export default DarkModeToggle;