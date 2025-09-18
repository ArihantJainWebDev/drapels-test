"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCredits } from '@/context/CreditsContext';
import { useAuth } from '@/context/AuthContext';
import { formatCredits, getCreditsProgress, areCreditsLow, areCreditsEmpty } from '@/utils/header/header.utils';

export interface UseHeaderCreditsReturn {
  credits: number | null | undefined;
  loading: boolean;
  isAdmin: boolean;
  creditsOpenDesktop: boolean;
  creditsOpenMobile: boolean;
  formattedCredits: string;
  progressValue: number;
  isLow: boolean;
  isEmpty: boolean;
  setCreditsOpenDesktop: (open: boolean) => void;
  setCreditsOpenMobile: (open: boolean) => void;
  navigateToPricing: () => void;
  closeCreditsPopover: () => void;
}

export const useHeaderCredits = (): UseHeaderCreditsReturn => {
  const router = useRouter();
  const { user } = useAuth();
  const { credits, loading, ensureDailyGrant, refresh, isAdmin } = useCredits();
  const [creditsOpenDesktop, setCreditsOpenDesktop] = useState(false);
  const [creditsOpenMobile, setCreditsOpenMobile] = useState(false);

  // Ensure daily credits are granted on header mount (once per day) when user is logged in
  useEffect(() => {
    if (user) {
      ensureDailyGrant().then(refresh).catch(() => {});
    }
  }, [user, ensureDailyGrant, refresh]);

  const navigateToPricing = () => {
    setCreditsOpenDesktop(false);
    setCreditsOpenMobile(false);
    setTimeout(() => router.push('/pricing'), 50);
  };

  const closeCreditsPopover = () => {
    setCreditsOpenDesktop(false);
    setCreditsOpenMobile(false);
  };

  const formattedCredits = formatCredits(credits, loading);
  const progressValue = getCreditsProgress(credits);
  const isLow = areCreditsLow(credits);
  const isEmpty = areCreditsEmpty(credits);

  return {
    credits,
    loading,
    isAdmin,
    creditsOpenDesktop,
    creditsOpenMobile,
    formattedCredits,
    progressValue,
    isLow,
    isEmpty,
    setCreditsOpenDesktop,
    setCreditsOpenMobile,
    navigateToPricing,
    closeCreditsPopover
  };
};