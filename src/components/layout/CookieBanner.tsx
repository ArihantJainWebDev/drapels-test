"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";

const COOKIE_KEY = "cookie-consent";
const SNOOZE_COOKIE = "cookie_consent_snooze_until";

const getCookie = (name: string) => {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
};

const hasActiveSnooze = () => {
  try {
    const v = getCookie(SNOOZE_COOKIE);
    if (!v) return false;
    const until = parseInt(v, 10);
    if (Number.isNaN(until)) return false;
    const now = Math.floor(Date.now() / 1000);
    return now < until;
  } catch {
    return false;
  }
};

const hasCookieConsent = () => {
  try {
    const consentCookie = getCookie("cookie_consent");
    return consentCookie === "accepted" || consentCookie === "necessary";
  } catch {
    return false;
  }
};

const CookieBanner = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let consent: string | null = null;
    try {
      consent = localStorage.getItem(COOKIE_KEY);
    } catch {
      // ignore
    }

    const accepted = consent === "accepted" || consent === "necessary";
    const cookieAccepted = hasCookieConsent();

    const snoozed = hasActiveSnooze();

    const shouldOpen = !(accepted || cookieAccepted || snoozed);
    setOpen(shouldOpen);
    setTimeout(() => setMounted(true), 10);
  }, []);

  const writeConsent = (value: "accepted" | "necessary") => {
    try {
      localStorage.setItem(COOKIE_KEY, value);
    } catch {}
    try {
      document.cookie = `cookie_consent=${value}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    } catch {}
    try {
      document.cookie = `${SNOOZE_COOKIE}=; Max-Age=0; path=/; SameSite=Lax`;
    } catch {}
    setOpen(false);
  };

  const acceptAll = () => writeConsent("accepted");
  const onlyNecessary = () => writeConsent("necessary");

  const snoozeOneDay = () => {
    const oneDayFromNow = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
    try {
      document.cookie = `${SNOOZE_COOKIE}=${oneDayFromNow}; max-age=${60 * 60 * 24}; path=/; SameSite=Lax`;
    } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className={`fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-95"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 py-3 md:py-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              We use cookies and local storage to remember your preferences and improve performance. By clicking Accept,
              you agree to this use. <Link href="/settings#privacy" className="underline hover:text-foreground">Learn more</Link>.
            </p>
            <button
              aria-label="Dismiss for now"
              onClick={snoozeOneDay}
              className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={onlyNecessary}>Only necessary</Button>
            <Button onClick={acceptAll}>Accept</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
