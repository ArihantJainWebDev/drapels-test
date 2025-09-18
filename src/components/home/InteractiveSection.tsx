// components/sections/InteractiveSection.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Users } from 'lucide-react';

interface InteractiveSectionProps {
  t: (key: string) => string;
}

const InteractiveSection = ({ t }: InteractiveSectionProps) => {
  const interactiveFeatures = [
    {
      icon: Zap,
      title: t('home.interactive.realtime.title'),
      description: t('home.interactive.realtime.desc')
    },
    {
      icon: Users,
      title: t('home.community'),
      description: t('home.community.desc')
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-32 px-4 relative bg-gray-50/50 dark:bg-gray-950/50">
      {/* Static elements */}
      <div className="absolute w-64 sm:w-72 md:w-88 h-64 sm:h-72 md:h-88 rounded-full bg-gradient-to-br from-gray-200/18 to-gray-300/12 dark:from-gray-700/18 dark:to-gray-600/12 blur-3xl top-[15%] left-[10%] sm:left-[15%]" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 leading-tight text-gray-900 dark:text-white px-4 sm:px-0">
            <span className="font-extralight text-gray-600 dark:text-gray-400">{t('home.interactive.heading')}</span> {t('home.interactive.heading.rest')}
          </h2>
          <div className="mx-auto h-px w-16 sm:w-24 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full" />
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light mt-4 px-4 sm:px-0">
            {t('home.interactive.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {interactiveFeatures.map((feature, index) => (
            <div key={index} className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl hover:ring-1 hover:ring-[#1EB36B]/30 transition-all duration-300 bg-white/70 dark:bg-black/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#93C5FD] to-[#1EB36B] text-white rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 md:mr-6 shadow-lg flex-shrink-0">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl leading-snug font-medium text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveSection;