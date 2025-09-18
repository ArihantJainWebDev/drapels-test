// components/sections/CTASection.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, CheckCircle, Rocket } from 'lucide-react';

interface CTASectionProps {
  user: any;
  t: (key: string) => string;
}

const CTASection = ({ user, t }: CTASectionProps) => {
  const router = useRouter();

  const goOrLogin = (path: string) => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(path);
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-32 px-4 relative bg-white dark:bg-black">
      {/* Static background */}
      <div className="absolute w-56 sm:w-64 md:w-72 h-56 sm:h-64 md:h-72 rounded-full bg-gradient-to-br from-gray-100/20 to-gray-200/10 dark:from-gray-800/20 dark:to-gray-700/10 blur-3xl top-[20%] right-[10%]" />
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gray-100/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 backdrop-blur-xl rounded-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 mb-6 sm:mb-8 shadow-lg">
            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-light text-sm sm:text-base">Ready to Transform Your Career?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-6 sm:mb-8 leading-tight text-gray-900 dark:text-white px-4 sm:px-0">
            Your Dream Job is Just{' '}
            <span className="font-extralight text-gray-600 dark:text-gray-400">
              One Click Away
            </span>
          </h2>
          <div className="mx-auto h-px w-16 sm:w-24 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full" />

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-8 sm:mb-12 px-4 sm:px-0">
            Join thousands of successful developers who've accelerated their careers with our proven methodology.
            <span className="text-gray-900 dark:text-white"> Your future self will thank you.</span>
          </p>

          <div className="flex justify-center px-4 sm:px-0">
            <Button
              onClick={() => goOrLogin("/roadmap")}
              size="lg"
              className="!bg-white/60 hover:!bg-white/70 active:!bg-white/70 dark:!bg-black/50 text-[#1EB36B] border border-[#1EB36B]/40 hover:border-[#1EB36B]/60 hover:text-[#149056] backdrop-blur-xl text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto rounded-full font-medium shadow-xl ring-0 focus:ring-0 focus-visible:ring-0 !ring-transparent focus:!ring-transparent focus-visible:!ring-transparent outline-none group"
            >
              <Rocket className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" /> 
              Start My Journey Now
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2 sm:ml-3" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 md:space-x-12 pt-6 sm:pt-8">
            <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#1EB36B]" />
              <span className="text-sm sm:text-base font-light">Join in 30 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;