export const headerConfig = {
  logo: {
    src: "/Drapels.PNG",
    alt: "Drapels Logo",
    title: "Drapels - Empowering Tech Careers Worldwide",
    ariaLabel: "Drapels Homepage",
    width: 48,
    height: 48
  },
  animations: {
    header: {
      initial: { y: -100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.6, ease: "easeOut" }
    },
    scroll: {
      duration: 0.6,
      ease: "easeOut"
    },
    orb: {
      duration: 12,
      ease: "linear"
    },
    logo: {
      hover: { rotate: [0, -3, 3, 0] },
      transition: { duration: 0.6 }
    },
    mobileMenu: {
      backdrop: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      panel: {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0 },
        transition: {
          type: 'spring',
          damping: 28,
          stiffness: 260,
          opacity: { duration: 0.15 }
        }
      }
    }
  },
  styling: {
    backdrop: "backdrop-blur-2xl",
    glassmorphism: {
      home: {
        scrolled: "bg-[#FFF8EE]/80 dark:bg-black/40",
        default: "bg-[#FFF8EE]/70 dark:bg-black/30"
      },
      other: "bg-[#FFF8EE]/80 dark:bg-black/40"
    },
    border: "border-[#EFDCC8]/60 dark:border-gray-800/40",
    shadow: "shadow-sm"
  },
  navigation: {
    activeColor: "text-[#1EB36B] dark:text-[#1EB36B]",
    hoverColor: "hover:text-gray-900 hover:bg-[#A7F3D0]/20 dark:hover:text-white dark:hover:bg-white/5"
  }
} as const;