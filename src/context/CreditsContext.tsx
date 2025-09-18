"use client"
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { doc, getDoc, runTransaction, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";

interface CreditsContextType {
  credits: number | null;
  loading: boolean;
  isAdmin: boolean;
  ensureDailyGrant: () => Promise<void>;
  ensureSignupGrant: () => Promise<void>;
  canAfford: (cost: number) => boolean;
  spend: (cost: number, reason?: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const DEFAULT_SIGNUP_CREDITS = 100;
const DAILY_GRANT = 25;
const MAX_CREDITS = 100;

// Admin allowlist: users with any of these emails are treated as admins (unlimited credits)
// Add more admin emails to this set as needed.
const ADMIN_EMAILS = new Set<string>([
  "taizun8@gmail.com",
  // Add other admin emails here, e.g. "founder@yourdomain.com"
]);

const CreditsContext = createContext<CreditsContextType>({
  credits: null,
  loading: true,
  isAdmin: false,
  ensureDailyGrant: async () => {},
  ensureSignupGrant: async () => {},
  canAfford: () => false,
  spend: async () => false,
  refresh: async () => {},
});

export const CreditsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const userRef = useMemo(() => (user ? doc(db, "users", user.uid) : null), [user]);

  const readCredits = useCallback(async () => {
    if (!userRef) { setCredits(null); return; }
    const snap = await getDoc(userRef);
    const data = snap.data() as any | undefined;
    setCredits((data?.credits ?? null));
    // Determine admin via Firestore flags OR allowlist by the authenticated user's email
    const allowlisted = ADMIN_EMAILS.has((user?.email || '').toLowerCase());
    const adminFlag = !!(data?.isAdmin) || (data?.role === 'admin') || allowlisted;
    setIsAdmin(adminFlag);
  }, [userRef, user]);

  const ensureSignupGrant = useCallback(async () => {
    if (!userRef) return;
    await runTransaction(db, async (trx) => {
      const snap = await trx.get(userRef);
      const data = snap.data() as any | undefined;
      if (!snap.exists()) {
        trx.set(userRef, {
          credits: DEFAULT_SIGNUP_CREDITS,
          lastDailyAt: Timestamp.now(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
        return;
      }
      if (typeof data?.credits !== 'number') {
        trx.update(userRef, {
          credits: DEFAULT_SIGNUP_CREDITS,
          updatedAt: serverTimestamp(),
        });
      }
    });
  }, [userRef]);

  const isSameUTCDate = (a: Date, b: Date) => {
    return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
  };

  const ensureDailyGrant = useCallback(async () => {
    if (!userRef) return;
    if (isAdmin) return; // admins don't need daily grants
    await runTransaction(db, async (trx) => {
      const snap = await trx.get(userRef);
      const data = snap.data() as any | undefined;
      const now = new Date();
      if (!snap.exists()) {
        trx.set(userRef, {
          credits: DEFAULT_SIGNUP_CREDITS,
          lastDailyAt: Timestamp.fromDate(now),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
        return;
      }
      const lastDaily = data?.lastDailyAt?.toDate ? data.lastDailyAt.toDate() : (data?.lastDailyAt ? new Date(data.lastDailyAt) : null);
      const lastDailyDate = lastDaily || new Date(0);
      if (!isSameUTCDate(lastDailyDate, now)) {
        const currentCredits = typeof data?.credits === 'number' ? data.credits : DEFAULT_SIGNUP_CREDITS;
        const add = Math.max(0, Math.min(DAILY_GRANT, MAX_CREDITS - currentCredits));
        const nextCredits = Math.min(MAX_CREDITS, currentCredits + add);
        trx.update(userRef, {
          credits: nextCredits,
          lastDailyAt: Timestamp.fromDate(now),
          updatedAt: serverTimestamp(),
        });
      }
    });
  }, [userRef]);

  const spend = useCallback(async (cost: number, reason?: string) => {
    if (!userRef) return false;
    if (isAdmin) return true; // no-op for admins
    if (!Number.isFinite(cost) || cost <= 0) return true;
    try {
      const ok = await runTransaction(db, async (trx) => {
        const snap = await trx.get(userRef);
        const data = snap.data() as any | undefined;
        const current = typeof data?.credits === 'number' ? data.credits : DEFAULT_SIGNUP_CREDITS;
        if (current < cost) return false;
        trx.update(userRef, {
          credits: current - cost,
          updatedAt: serverTimestamp(),
          lastSpendReason: reason || null,
          lastSpendAt: serverTimestamp(),
        });
        return true;
      });
      if (ok) {
        setCredits((c) => (typeof c === 'number' ? Math.max(0, c - cost) : null));
      }
      return !!ok;
    } catch (e) {
      console.error('Failed to spend credits', e);
      return false;
    }
  }, [userRef, isAdmin]);

  const canAfford = useCallback((cost: number) => {
    if (isAdmin) return true;
    if (credits === null) return false;
    return credits >= cost;
  }, [credits, isAdmin]);

  const refresh = useCallback(async () => {
    await readCredits();
  }, [readCredits]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        if (!userRef) { setCredits(null); return; }
        await ensureSignupGrant();
        await ensureDailyGrant();
        await readCredits();
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, userRef]);

  return (
    <CreditsContext.Provider value={{ credits, loading, isAdmin, ensureDailyGrant, ensureSignupGrant, canAfford, spend, refresh }}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => useContext(CreditsContext);
