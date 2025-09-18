"use client"
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import PixelCard from '@/components/ui/PixelCard';
import { useHeaderCredits } from '@/hooks/header/useHeaderCredits';
import { getCreditsButtonClasses, getMobileCreditsButtonClasses } from '@/utils/header/header.utils';

interface CreditsDisplayProps {
  isHome: boolean;
  isScrolled: boolean;
  variant?: 'desktop' | 'mobile';
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ isHome, isScrolled, variant = 'desktop' }) => {
  const {
    formattedCredits,
    progressValue,
    isAdmin,
    isLow,
    isEmpty,
    creditsOpenDesktop,
    creditsOpenMobile,
    setCreditsOpenDesktop,
    setCreditsOpenMobile,
    navigateToPricing,
    closeCreditsPopover
  } = useHeaderCredits();

  const isOpen = variant === 'desktop' ? creditsOpenDesktop : creditsOpenMobile;
  const setIsOpen = variant === 'desktop' ? setCreditsOpenDesktop : setCreditsOpenMobile;
  const buttonClasses = variant === 'desktop' 
    ? getCreditsButtonClasses(isHome, isScrolled)
    : getMobileCreditsButtonClasses(isHome, isScrolled);

  const iconSize = variant === 'desktop' ? 12 : 11;
  const textSize = variant === 'desktop' ? 'text-xs' : 'text-[10px]';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.3 }}
          className={buttonClasses}
          title="Your credits"
        >
          {isAdmin ? (
            <span className="flex items-center gap-1" aria-label="Unlimited credits">
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-yellow-500 dark:text-yellow-400">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
              </svg>
              <span className={`text-yellow-500 dark:text-yellow-400 ${textSize} leading-none`}>∞</span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-sky-500 dark:text-sky-400">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
              </svg>
              {formattedCredits}
            </span>
          )}
        </motion.button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className={`${variant === 'desktop' ? 'w-[360px]' : 'w-72'} ${variant === 'desktop' ? 'p-0 overflow-hidden shadow-2xl border-0 rounded-2xl' : 'p-4 shadow-xl border border-gray-200/60 dark:border-gray-800/60'}`}
      >
        {variant === 'desktop' ? (
          <div className="hidden md:block">
            <PixelCard variant="blue" className="w-full h-[220px] rounded-2xl border-0">
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/20 grid place-items-center pointer-events-auto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold pointer-events-auto">Credits</div>
                  {!isAdmin && (
                    <div className="ml-auto text-xs opacity-90 pointer-events-auto">
                      {progressValue}/100
                    </div>
                  )}
                </div>
                {isAdmin ? (
                  <div className="text-xs text-gray-900/90 dark:text-white/90 pointer-events-auto">
                    Unlimited access — enjoy all features.
                  </div>
                ) : (
                  <div className="space-y-2 text-gray-900 dark:text-white pointer-events-auto">
                    <Progress value={progressValue} className="h-2 bg-black/10 dark:bg-white/20 [&>div]:bg-black dark:[&>div]:bg-white" />
                    <div className="text-[11px] text-gray-700 dark:text-white/90">
                      {isEmpty ? 'Outta credits — subscribe.' : 
                       isLow ? "You're low on credits." : 
                       'Top up to keep going.'}
                    </div>
                    <ul className="text-[11px] grid grid-cols-2 gap-2">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-white" />
                        Faster responses
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-white" />
                        Priority queue
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-white" />
                        All tools access
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-white" />
                        Daily top-ups
                      </li>
                    </ul>
                  </div>
                )}
                <div className="flex items-center justify-end gap-2 pointer-events-auto">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-black/10 text-gray-900 hover:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20" 
                    onClick={closeCreditsPopover}
                  >
                    Close
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90" 
                    onClick={navigateToPricing}
                  >
                    Get more
                  </Button>
                </div>
              </div>
            </PixelCard>
          </div>
        ) : (
          <div className="space-y-3">
            {isAdmin ? (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-yellow-500 dark:text-yellow-400">
                    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                  </svg>
                  <span className="text-yellow-500 dark:text-yellow-400 text-xs leading-none">∞</span>
                  <span>Unlimited credits</span>
                </div>
                <Button onClick={navigateToPricing} size="sm" className="w-full">
                  Manage plan
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Credits</span>
                  <span>{progressValue}/100</span>
                </div>
                <div className="space-y-2">
                  <Progress value={progressValue} className={`h-2 ${isLow || isEmpty ? '[&>div]:bg-red-500' : ''}`} />
                  {isLow && !isEmpty && (
                    <div className="text-xs text-red-600 dark:text-red-400">You're low on credits.</div>
                  )}
                  {isEmpty && (
                    <div className="text-xs text-red-600 dark:text-red-400">Outta credits — subscribe.</div>
                  )}
                </div>
                <Button onClick={navigateToPricing} size="sm" className="w-full">
                  Get more
                </Button>
              </>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CreditsDisplay;