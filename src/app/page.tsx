"use client"

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import HeroSection from '@/components/home/HeroSection';
import QuickAccessSection from '@/components/home/QuickAccessSection';
import SearchFilterSection from '@/components/home/SearchFilterSection';
import TrendingSection from '@/components/home/TrendingSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CommunitySnapshotSection from '@/components/home/CommunitySnapshotSection';
import PersonalizedFeedSection from '@/components/home/PersonalizedFeedSection';
import CTAStripSection from '@/components/home/CTAStripSection';

const HomePage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-accent-900">
      <HeroSection user={user} t={t} />
      <QuickAccessSection user={user} t={t} />
      <SearchFilterSection user={user} t={t} />
      <TrendingSection user={user} t={t} />
      <HowItWorksSection user={user} t={t} />
      <CommunitySnapshotSection user={user} t={t} />
      {user && <PersonalizedFeedSection user={user} t={t} />}
      <CTAStripSection user={user} t={t} />
    </div>
  );
};

export default HomePage;