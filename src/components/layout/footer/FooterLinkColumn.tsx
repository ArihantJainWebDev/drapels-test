"use client";
import React from 'react';
import Link from 'next/link';

interface LinkItem {
  title: string;
  href: string;
}

interface FooterLinkColumnProps {
  title: string;
  links: LinkItem[];
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({ title, links }) => {
  return (
    <div>
      <h4 className="text-[11px] md:text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">{title}</h4>
      <nav className="space-y-0.5 md:space-y-1">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block text-xs md:text-sm leading-5 md:leading-6 text-gray-700 dark:text-gray-300 hover:text-[#1EB36B] transition-colors">
            {link.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default FooterLinkColumn;