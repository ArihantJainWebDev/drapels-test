"use client"
import { useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import InteractiveSection from '@/components/home/InteractiveSection';
import CTASection from '@/components/home/CTASection';
import FAQSection from '@/components/home/FAQSection';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const HomePage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FFF8EE] dark:bg-black">
      <HeroSection user={user} t={t} />
      <FeaturesSection t={t} />
      <InteractiveSection t={t} />
      <CTASection user={user} t={t} />
      <FAQSection />
    </div>
  );
};

export default HomePage;