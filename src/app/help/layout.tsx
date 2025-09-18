import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & User Guide | Drapels',
  description: 'Comprehensive help guide for Drapels: features, getting started, how-to steps, FAQs, and troubleshooting.'
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  );
}
