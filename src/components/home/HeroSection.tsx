// components/sections/HeroSection.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  user: any;
  t: (key: string) => string;
}

const HeroSection = ({ user, t }: HeroSectionProps) => {
  const router = useRouter();

  const goOrLogin = (path: string) => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(path);
    }
  };

  return (
    <section className="relative min-h-screen bg-[#FFF8EE] dark:bg-black">
      {/* Static Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 rounded-full bg-gradient-to-br from-[#A5F3FC]/20 via-[#1EB36B]/10 to-[#93C5FD]/20 dark:from-gray-800/30 dark:to-gray-700/20 blur-3xl top-[10%] left-[5%] sm:left-[10%]" />
        <div className="absolute w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:h-80 rounded-full bg-gradient-to-br from-[#93C5FD]/20 to-[#A7F3D0]/15 dark:from-gray-700/20 dark:to-gray-600/15 blur-3xl top-[60%] right-[5%] sm:right-[15%]" />
        <div className="absolute w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 rounded-full bg-gradient-to-br from-[#A7F3D0]/20 to-[#93C5FD]/15 dark:from-gray-750/25 dark:to-gray-800/20 blur-2xl bottom-[20%] left-[50%] sm:left-[60%]" />
      </div>

      {/* Content */}
      <div className="container min-h-screen mx-auto px-4 relative z-20 flex items-center justify-center pt-20 sm:pt-16 pb-8 md:pb-16">
        <div className="max-w-4xl text-center space-y-6 sm:space-y-8 w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-tight tracking-[-0.03em] text-gray-900 dark:text-white">
            <span className="block mb-2 sm:mb-4">
              {t('home.hero.title.first')}
            </span>
            <span className="block font-extralight">
              {t('home.hero.title.second')}
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-6 px-4 sm:px-0">
            <Button
              onClick={() => goOrLogin("/roadmap")}
              size="lg"
              className="w-full sm:w-auto rounded-full !bg-white/60 hover:!bg-white/70 active:!bg-white/70 dark:!bg-black/50 text-[#1EB36B] border border-[#1EB36B]/40 hover:border-[#1EB36B]/60 hover:text-[#149056] backdrop-blur-xl shadow-lg hover:shadow-xl ring-0 focus:ring-0 focus-visible:ring-0 outline-none px-6 sm:px-8 md:px-10 py-3 md:py-4 lg:py-5 text-sm sm:text-base font-medium transition-all duration-300 min-w-[180px] sm:min-w-[200px]"
            >
              Get Roadmap
            </Button>

            <Button
              onClick={() => goOrLogin("/companies")}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-full !bg-white/60 hover:!bg-white/70 active:!bg-white/70 dark:!bg-black/60 text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl shadow-lg hover:shadow-xl ring-0 focus:ring-0 focus-visible:ring-0 outline-none px-6 sm:px-8 md:px-10 py-3 md:py-4 lg:py-5 text-sm sm:text-base font-medium transition-all duration-300 min-w-[180px] sm:min-w-[200px]"
            >
              Explore Companies
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;