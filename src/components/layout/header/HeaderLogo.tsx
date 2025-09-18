"use client"
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0"
    >
      <Link
        href="/"
        className="flex items-center gap-0 group pt-1 sm:pt-0"
        aria-label={headerConfig.logo.ariaLabel}
        title={headerConfig.logo.title}
      >
        <motion.div
          className="relative w-14 h-14 flex items-center justify-center"
          whileHover={{ rotate: [0, -3, 3, 0] }}
          transition={{ duration: headerConfig.animations.logo.transition.duration }}
        >
          <Image
            src={headerConfig.logo.src}
            alt={headerConfig.logo.alt}
            width={48}
            height={48}
            className={logoImgClass}
            priority={isHome} // Only prioritize on home page
          />
        </motion.div>
        <div className="block">
          <motion.h1
            className={`cursor-can-hover text-xl sm:text-2xl font-bold leading-normal transition-colors duration-300 ${textColorClass}`}
            whileHover={{
              backgroundPosition: "200% center",
              scale: 1.02
            }}
            style={{ backgroundSize: "200% 200%" }}
            transition={{ duration: 0.3 }}
          >
            Drapels
          </motion.h1>
        </div>
      </Link>
    </motion.div>
  );
};

export default HeaderLogo;