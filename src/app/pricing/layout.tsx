import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plans & Pricing — Drapels',
  description: 'Choose the perfect plan for your journey. Free, Pro, Teams and Enterprise plans with light/dark friendly design.'
};

export default function PricingLayout({
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
