'use client';

import React, { useCallback, useState } from "react";

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Star, Crown, CheckCircle, Zap, Users, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import ElectricBorder from "@/components/ui/ElectricBorder";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { doc, runTransaction, serverTimestamp, getDoc } from "firebase/firestore";
import { useCredits } from "@/context/CreditsContext";
import { toast } from "@/components/ui/sonner";
import { useSignInRequired } from "@/components/auth/SignInRequiredDialog";

const features = {
  free: [
    "AI Tutor (basic) + AI Quiz access",
    "Credits: +25/day",
    "Personalized roadmaps (basic)",
    "Resume builder: basic template + 1 PDF export",
    "Community forums, company insights & comments",
    "Ad‑supported experience",
  ],
  pro: [
    "Everything in Free, plus:",
    "AI Tutor (advanced) with faster responses",
    "Credits: 1000/mo +100/day",
    "Interview simulator sessions with AI feedback",
    "Resume builder: all templates, unlimited exports & ATS checks",
    "Roadmaps with full personalization",
    "Ad‑free + priority support",
  ],
  teams: [
    "Everything in Pro, plus:",
    "Credits: 2000/mo +250/day",
    "Team workspace with shared chats, prompts & history",
    "Skill analytics & progress dashboards",
    "Admin controls & role‑based permissions",
  ],
  enterprise: [
    "Everything in Teams, plus:",
    "Credits: Unlimited",
    "SSO/SAML + SCIM provisioning",
    "Custom SLAs, security reviews & invoicing",
    "Dedicated success manager",
  ],
};

const Feature: React.FC<{ text: string }> = ({ text }) => {
  const isCredits = text.startsWith("Credits:");
  return (
    <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
      <CheckCircle className="w-4 h-4 text-[#1EB36B] mt-0.5 flex-shrink-0" />
      <span className="font-light leading-relaxed">{isCredits ? text.replace(/^Credits:\s*/, "") : text}</span>
    </li>
  );
};

type PlanKey = keyof typeof features;

const planMeta: Record<PlanKey, { label: string; price: string; sub?: string; color: string }> = {
  free: { label: "Free", price: "$0 / user / month", color: "#ffffff" },
  pro: { label: "Pro", price: "$15 / user / month", color: "#ffffff" },
  teams: { label: "Teams", price: "$30 / user / month", color: "#ffffff" },
  enterprise: { label: "Enterprise", price: "Starting at $60 / user / month", color: "#ffffff" },
};

function PricingPage() {
  const [openPlan, setOpenPlan] = useState<PlanKey | null>(null);
  const [activePlan, setActivePlan] = useState<PlanKey | null>(null);
  const { user } = useAuth();
  const { refresh } = useCredits();
  const { requireAuth, SignInRequiredDialog } = useSignInRequired();

  const activatePlan = useCallback(async (plan: PlanKey) => {
    if (!user) {
      toast.error("Please sign in to select a plan");
      return;
    }
    const userRef = doc(db, "users", user.uid);

    const grantByPlan: Record<PlanKey, number> = {
      free: 0,
      pro: 1000,       // 1000 monthly upfront credits
      teams: 2000,     // 2000 monthly upfront credits
      enterprise: 0,   // enterprise -> unlimited (admin flag below)
    };

    try {
      await runTransaction(db, async (trx) => {
        const snap = await trx.get(userRef);
        const data = (snap.data() as any) || {};
        const current = typeof data.credits === 'number' ? data.credits : 0;
        const add = grantByPlan[plan] || 0;
        const next = current + add;
        const patch: any = {
          plan,
          credits: next,
          updatedAt: serverTimestamp(),
        };
        if (plan === 'enterprise') {
          // Mark as admin/unlimited according to CreditsContext admin checks
          patch.isAdmin = true;
          patch.role = data.role || 'admin';
        }
        if (snap.exists()) {
          trx.update(userRef, patch);
        } else {
          trx.set(userRef, { createdAt: serverTimestamp(), ...patch }, { merge: true });
        }
      });
      await refresh();
      setActivePlan(plan);
      setOpenPlan(null);
      toast.success(plan === 'enterprise' ? 'Enterprise activated — Unlimited credits enabled' : `${planMeta[plan].label} activated — credits added`);
    } catch (e: any) {
      console.error('Plan activation failed', e);
      toast.error('Failed to activate plan. Please try again.');
    }
  }, [user, refresh]);

  // Sync current plan from Firestore on mount/sign-in
  React.useEffect(() => {
    const load = async () => {
      if (!user) { setActivePlan(null); return; }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const data = snap.data() as any | undefined;
        const plan = (data?.plan || 'free') as PlanKey;
        setActivePlan(plan);
      } catch {}
    };
    load();
  }, [user]);

  // Removed badges near prices per request; credits are shown as feature items with SVG

  return (
    <div className="min-h-screen bg-[#FFF8EE] dark:bg-black overflow-x-hidden">
      {/* Pricing Cards Section */}
      <section className="py-16 md:py-28 px-4 relative overflow-hidden bg-[#FFF2E0] dark:bg-gray-950/50">
        {/* Liquid background elements */}
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-gray-200/15 to-gray-300/10 dark:from-gray-700/15 dark:to-gray-600/10 blur-3xl"
          style={{ top: '10%', left: '5%' }}
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-gray-100/20 to-gray-200/15 dark:from-gray-800/20 dark:to-gray-700/15 blur-2xl"
          style={{ bottom: '15%', right: '8%' }}
          animate={{
            x: [0, -45, 0],
            y: [0, 35, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center mb-10 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-light mb-6 leading-tight text-gray-900 dark:text-white">
              Choose Your <span className="font-extralight text-gray-600 dark:text-gray-400">Perfect Plan</span>
            </h2>
            <div className="mx-auto h-px w-24 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full" />
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light mt-6">
              Start free and scale as you grow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Free Plan */}
            <motion.div
              className="group h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl hover:ring-1 hover:ring-[#1EB36B]/30 transition-all duration-500 bg-white/80 dark:bg-black/80 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/30 dark:border-gray-800/30">
                <CardContent className="p-8 relative">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">FREE</h3>
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-4xl font-light text-gray-900 dark:text-white">$0</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm mb-1">per month</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mb-6 !bg-white/60 hover:!bg-white/70 dark:!bg-black/60 text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl shadow-lg ring-0 focus:ring-0 outline-none px-6 py-3 text-base font-medium transition-all duration-300 rounded-full"
                    disabled
                  >
                    Current Plan
                  </Button>

                  <ul className="space-y-3">
                    {features.free.map((f) => (
                      <Feature key={f} text={f} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="group h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="relative h-full border-0 shadow-lg hover:shadow-2xl hover:ring-1 hover:ring-[#1EB36B]/30 transition-all duration-500 bg-white/80 dark:bg-black/80 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/30 dark:border-gray-800/30">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-[#1EB36B] text-white border-0 text-xs px-3 py-1 rounded-full font-medium">POPULAR</Badge>
                </div>
                <CardContent className="p-8 relative">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PRO</h3>
                      <Crown className="h-5 w-5 text-[#1EB36B]" />
                    </div>
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-4xl font-light text-gray-900 dark:text-white">$15</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm mb-1">per month</span>
                    </div>
                  </div>

                  {activePlan === 'pro' ? (
                    <Button
                      className="w-full mb-6 !bg-[#1EB36B] hover:!bg-[#149056] text-white border-0 backdrop-blur-xl shadow-lg ring-0 focus:ring-0 outline-none px-6 py-3 text-base font-medium transition-all duration-300 rounded-full"
                      disabled
                    >
                      Subscribed
                    </Button>
                  ) : (
                    <Button
                      className="w-full mb-6 !bg-[#1EB36B] hover:!bg-[#149056] text-white border-0 backdrop-blur-xl shadow-lg hover:shadow-xl ring-0 focus:ring-0 outline-none px-6 py-3 text-base font-medium transition-all duration-300 rounded-full"
                      onClick={() => setOpenPlan('pro')}
                    >
                      Select Plan
                    </Button>
                  )}

                  <ul className="space-y-3">
                    {features.pro.map((f) => (
                      <Feature key={f} text={f} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Teams Plan */}
            <motion.div
              className="group h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl hover:ring-1 hover:ring-[#1EB36B]/30 transition-all duration-500 bg-white/80 dark:bg-black/80 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/30 dark:border-gray-800/30">
                <CardContent className="p-8 relative">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">TEAMS</h3>
                      <Users className="h-5 w-5 text-[#1EB36B]" />
                    </div>
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-4xl font-light text-gray-900 dark:text-white">$30</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm mb-1">per month</span>
                    </div>
                  </div>

                  {activePlan === 'teams' ? (
                    <Button
                      className="w-full mb-6 !bg-[#1EB36B] hover:!bg-[#149056] text-white border-0 backdrop-blur-xl shadow-lg ring-0 focus:ring-0 outline-none px-6 py-3 text-base font-medium transition-all duration-300 rounded-full"
                      disabled
                    >
                      Subscribed
                    </Button>
                  ) : (
                    <Button
                      className="w-full mb-6 !bg-white/60 hover:!bg-white/70 dark:!bg-black/60 text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl shadow-lg hover:shadow-xl ring-0 focus:ring-0 outline-none px-6 py-3 text-base font-medium transition-all duration-300 rounded-full"
                      onClick={() => setOpenPlan('teams')}
                    >
                      Select Plan
                    </Button>
                  )}

                  <ul className="space-y-3">
                    {features.teams.map((f) => (
                      <Feature key={f} text={f} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              className="group h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl hover:ring-1 hover:ring-[#1EB36B]/30 transition-all duration-500 bg-white/80 dark:bg-black/80 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/30 dark:border-gray-800/30">
                <CardContent className="p-8 relative">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ENTERPRISE</h3>
                      <Building2 className="h-5 w-5 text-[#1EB36B]" />
                    </div>
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-4xl font-light text-gray-900 dark:text-white">$60</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm mb-1">starting at</span>
                    </div>
                  </div>

                  {activePlan === 'enterprise' ? (
                    <Button
                      className="w-full mb-6 !bg-[#1EB36B] hover:!bg-[#149056] text-white border-0 backdrop-blur-xl shadow-lg ring-0 focus:ring-0 outline-none px-6 py-3 text-base font-medium transition-all duration-300 rounded-full"
                      disabled
                    >
                      Subscribed
                    </Button>
                  ) : (
                    <Button
                      className="w-full mb-6 !bg-white/60 hover:!bg-white/70 dark:!bg-black/60 text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl shadow-lg hover:shadow-xl ring-0 focus:ring-0 outline-none px-6 py-3 text-base font-medium transition-all duration-300 rounded-full"
                      onClick={() => setOpenPlan('enterprise')}
                    >
                      Select Plan
                    </Button>
                  )}

                  <ul className="space-y-3">
                    {features.enterprise.map((f) => (
                      <Feature key={f} text={f} />
                    ))}
                  </ul>

                  <Button 
                    variant="ghost" 
                    className="mt-4 w-full text-gray-600 dark:text-gray-400 hover:text-[#1EB36B] hover:bg-transparent transition-colors duration-200"
                  >
                    Contact Sales <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plan Modal */}
      <Dialog open={!!openPlan} onOpenChange={(o) => setOpenPlan(o ? openPlan : null)}>
        <DialogContent className="max-w-lg p-0 overflow-visible bg-transparent border-0">
          {openPlan && (
            <ElectricBorder color={planMeta[openPlan].color} speed={1} chaos={0.5} thickness={3} style={{ borderRadius: 18 }}>
              <div className="rounded-2xl p-6 border border-white/40 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-2xl supports-[backdrop-filter]:backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.35)]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-light text-gray-900 dark:text-gray-100">
                    {planMeta[openPlan].label}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 font-light">
                    {planMeta[openPlan].price}
                  </DialogDescription>
                </DialogHeader>
                <ul className="mt-6 space-y-3">
                  {features[openPlan].map((f) => (
                    <Feature key={f} text={f} />
                  ))}
                </ul>
              </div>
            </ElectricBorder>
          )}
        </DialogContent>
      </Dialog>
      {/* Auth required dialog shown when unauthenticated user taps Subscribe */}
      <SignInRequiredDialog />
    </div>
  );
}

export default PricingPage;
