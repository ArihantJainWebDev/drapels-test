// components/sections/FeaturesSection.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Route, Lightbulb, MessageSquareText, Mails } from 'lucide-react';
import FeatureCard from '@/components/ui/FeatureCard';

interface FeaturesSectionProps {
  t: (key: string) => string;
}

const FeaturesSection = ({ t }: FeaturesSectionProps) => {
  const features = [
    {
      icon: Route,
      title: t('home.features.roadmaps'),
      description: t('home.features.roadmaps.desc'),
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: Lightbulb,
      title: t('home.features.resources'),
      description: t('home.features.resources.desc'),
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: MessageSquareText,
      title: t('home.features.insights'),
      description: t('home.features.insights.desc'),
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Mails,
      title: t('home.features.email'),
      description: t('home.features.email.desc'),
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-28 px-4 relative bg-[#FFF2E0] dark:bg-gray-950/50">
      {/* Static background elements */}
      <div className="absolute w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:h-80 rounded-full bg-gradient-to-br from-gray-200/15 to-gray-300/10 dark:from-gray-700/15 dark:to-gray-600/10 blur-3xl top-[10%] left-[5%]" />
      <div className="absolute w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 rounded-full bg-gradient-to-br from-gray-100/20 to-gray-200/15 dark:from-gray-800/20 dark:to-gray-700/15 blur-2xl bottom-[15%] right-[8%]" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 leading-tight text-gray-900 dark:text-white px-4 sm:px-0">
            {t('home.features.heading')} <span className="font-extralight text-gray-600 dark:text-gray-400">{t('home.features.heading.highlight')}</span>
          </h2>
          <div className="mx-auto h-px w-16 sm:w-24 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full" />
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light mt-4 px-4 sm:px-0">
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              feature={feature} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;