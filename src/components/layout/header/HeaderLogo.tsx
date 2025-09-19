"use client"
import Link from 'next/link';
import Image from 'next/image';
import { headerConfig } from '@/config/header/header.config';
import { getLogoClasses, getTextColorClasses } from '@/utils/header/header.utils';

interface HeaderLogoProps {
  isHome: boolean;
  isScrolled: boolean;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ isHome, isScrolled }) => {
  const isHero = isHome && !isScrolled;
  const logoImgClass = getLogoClasses(isHero);
  const textColorClass = getTextColorClasses(isHome, isScrolled);

  return (
    <div className="flex-shrink-0">
      <Link
        href="/"
        className="flex items-center gap-2 group"
        aria-label={headerConfig.logo.ariaLabel}
        title={headerConfig.logo.title}
      >
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
          <Image
            src={headerConfig.logo.src}
            alt={headerConfig.logo.alt}
            width={32}
            height={32}
            className={`${logoImgClass} w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-200 group-hover:scale-105`}
            priority={isHome}
          />
        </div>
        <h1 className={`text-lg sm:text-xl font-bold transition-colors duration-200 ${textColorClass} group-hover:text-primary-600 dark:group-hover:text-primary-400`}>
          Drapels
        </h1>
      </Link>
    </div>
  );
};

export default HeaderLogo;