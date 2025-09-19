export const headerConfig = {
  logo: {
    src: "/Drapels.PNG",
    alt: "Drapels Logo",
    title: "Drapels - Empowering Tech Careers Worldwide",
    ariaLabel: "Drapels Homepage",
    width: 32,
    height: 32
  },
  animations: {
    header: {
      initial: { y: -20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    scroll: {
      duration: 0.3,
      ease: "easeOut"
    },
    logo: {
      hover: { scale: 1.05 },
      transition: { duration: 0.2 }
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
          damping: 30,
          stiffness: 300,
          opacity: { duration: 0.2 }
        }
      }
    }
  },
  styling: {
    backdrop: "backdrop-blur-md",
    glassmorphism: {
      home: {
        scrolled: "bg-white/90 dark:bg-gray-900/90",
        default: "bg-white/80 dark:bg-gray-900/80"
      },
      other: "bg-white/90 dark:bg-gray-900/90"
    },
    border: "border-gray-200/50 dark:border-gray-700/50",
    shadow: "shadow-sm"
  },
  navigation: {
    activeColor: "text-primary-600 dark:text-primary-400",
    hoverColor: "hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
  }
} as const;