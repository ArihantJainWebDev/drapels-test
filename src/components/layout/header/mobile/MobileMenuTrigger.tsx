"use client"
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMenuIconClasses } from '@/utils/header/header.utils';

interface MobileMenuTriggerProps {
  isHome: boolean;
  isScrolled: boolean;
  onClick: () => void;
}

const MobileMenuTrigger: React.FC<MobileMenuTriggerProps> = ({ isHome, isScrolled, onClick }) => {
  const iconClasses = getMenuIconClasses(isHome, isScrolled);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="p-2.5 rounded-xl hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300"
        aria-label="Open navigation menu"
      >
        <Menu className={`${iconClasses} w-5 h-5`} />
      </Button>
    </motion.div>
  );
};

export default MobileMenuTrigger;