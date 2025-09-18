"use client";
import React from 'react';
import { Instagram, X as XIcon, Linkedin, Mail } from 'lucide-react';

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/drapelsai", icon: Instagram },
  { name: "X", href: "https://x.com/drapelsai", icon: XIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/drapels/", icon: Linkedin },
  { name: "Email", href: "mailto:support@drapels.com", icon: Mail }
];

interface FooterBrandProps {
  t: (key: string) => string;
}

const FooterBrand: React.FC<FooterBrandProps> = ({ t }) => {
  return (
    <div className="col-span-2 md:col-span-2">
      <div className="flex items-center gap-2 mb-3">
        <img src="/Drapels.PNG" alt="Drapels" className="w-10 h-10 md:w-12 md:h-12" />
        <span className="text-xl font-bold text-gray-900 dark:text-white">Drapels</span>
      </div>
      <p className="hidden sm:block text-gray-700 dark:text-gray-300 mb-4 max-w-md">
        {t('app.tagline') || 'Empowering developers with learning roadmaps and career guidance.'}
      </p>
      <div className="flex items-center gap-2">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 md:p-1.5 text-gray-700 dark:text-gray-300 hover:text-[#1EB36B] transition-colors"
            aria-label={social.name}
          >
            <social.icon className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterBrand;