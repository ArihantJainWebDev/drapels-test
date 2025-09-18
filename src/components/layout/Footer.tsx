"use client"
import { useLanguage } from "@/context/LanguageContext";
import FooterBrand from "./footer/FooterBrand";
import FooterLinkColumn from "./footer/FooterLinkColumn";

const Footer = () => {
  const { t } = useLanguage();

  const resourcesLinks = [
    { title: "Documentation", href: "/docs" },
    { title: "Tools", href: "/tools" },
    { title: "Pricing", href: "/pricing" },
  ];

  const companyLinks = [
    { title: t('Help') || "Help", href: "/help" },
    { title: t('nav.about') || "About", href: "/about" },
    { title: t('nav.contact') || "Contact", href: "/contact" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#FFF8EE] to-[#FFF2E0] dark:from-black dark:to-gray-950 border-t border-white/60 dark:border-white/10">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 mb-3 md:mb-4">
          <FooterBrand t={t} />
          <FooterLinkColumn title="Resources" links={resourcesLinks} />
          <FooterLinkColumn title="Company" links={companyLinks} />
        </div>

        <div className="border-t border-white/60 dark:border-white/10 pt-3 md:pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm">
            2025 Drapels. {t('footer.rights') || 'All rights reserved.'}
          </p>
          <p className="hidden sm:block text-gray-600 dark:text-gray-400 text-xs md:text-sm">
            Made for developers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;