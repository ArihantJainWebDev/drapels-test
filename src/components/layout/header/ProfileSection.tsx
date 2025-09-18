"use client"
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileDropdown from '@/components/layout/ProfileDropdown';
import { useHeaderAuth } from '@/hooks/header/useHeaderAuth';
import { useLanguage } from '@/context/LanguageContext';
import { createTranslationFallback } from '@/utils/header/header.utils';

interface ProfileSectionProps {
  isHome: boolean;
  isScrolled: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ isHome, isScrolled }) => {
  const { isAuthenticated, navigateToLogin } = useHeaderAuth();
  const { t } = useLanguage();
  const tr = createTranslationFallback(t);

  if (isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <ProfileDropdown brandMode={isHome && !isScrolled ? "hero" : "solid"} />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      <Button
        className="bg-white/60 dark:bg-black/40 text-[#1EB36B] border border-[#1EB36B]/40 hover:border-[#1EB36B]/60 hover:text-[#149056] backdrop-blur-xl px-5 py-2 font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-200"
        onClick={navigateToLogin}
      >
        <User className="w-4 h-4 mr-2 relative z-10" />
        <span className="relative z-10">{tr('nav.login', 'Get Started')}</span>
      </Button>
    </motion.div>
  );
};

export default ProfileSection;