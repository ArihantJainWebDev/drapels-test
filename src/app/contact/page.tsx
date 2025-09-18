'use client';

import React from "react";

export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageSquare, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const ContactPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    fetch(form.action, {
      method: form.method,
      body: formData,
      mode: "no-cors",
    })
      .then(() => {
        toast({
          title: "Message sent!",
          description: "We will get back to you.",
          variant: "default",
        });
        form.reset();
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        toast({
          title: "Error",
          description: "There was an error submitting your message. Please try again.",
          variant: "destructive",
          className: cn("top-0 mx-auto flex fixed md:top-4 md:right-4"),
        });
      });
  };

  return (
    <div className="min-h-screen bg-[#FFF8EE] dark:bg-black">
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light mb-4 text-gray-900 dark:text-white">
              {t('contact.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto font-light">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact us
                </CardTitle>
                <CardDescription>
                  We typically reply within 1 business day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={handleSubmit}
                  method="POST"
                  action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSexUH392RlxmEP7zyhB7ccVMFhTcBAFlMZsZEapqUjGE12iSw/formResponse"
                  target="hidden_iframe"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium" htmlFor="fullname">Full name</label>
                      <Input id="fullname" name="entry.1439200971" placeholder="Your Name" type="text" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium" htmlFor="email">Email Address</label>
                      <Input id="email" name="entry.199000082" placeholder="you@example.com" type="email" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="content">Your Message</label>
                    <Textarea id="content" name="entry.1278587839" placeholder="How can we help you?" rows={5} required />
                  </div>
                  <Button
                    className="cursor-can-hover bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                  >
                    <div className="flex items-center justify-center">
                      Send Message <ChevronRight className="w-4 h-4 ml-4" />
                    </div>
                  </Button>
                  <div className="pt-3 overflow-hidden pointer-events-none">
                    <svg
                      className="w-full"
                      height="140"
                      viewBox="0 0 600 140"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="g" x1="0" y1="0" x2="600" y2="140" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--accent))" />
                        </linearGradient>
                        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      <path d="M0 90 C120 70 180 120 300 100 C420 80 480 120 600 95 V140 H0 Z" fill="url(#g2)" />
                      <path d="M0 110 C140 90 200 140 320 120 C440 100 500 140 600 115" stroke="url(#g)" strokeWidth="1.5" strokeOpacity="0.5" fill="none">
                        <animate attributeName="d" dur="6s" repeatCount="indefinite"
                          values="M0 110 C140 90 200 140 320 120 C440 100 500 140 600 115; M0 108 C140 86 200 138 320 116 C440 96 500 138 600 110; M0 110 C140 90 200 140 320 120 C440 100 500 140 600 115" />
                      </path>
                      <g opacity="0.95">
                        <path d="M80 30 l22 7 -22 7 -5-6 5-8z" fill="url(#g)">
                          <animateTransform attributeName="transform" type="translate" dur="2.2s" values="0 0; 0 8; 0 0" repeatCount="indefinite" />
                          <animateTransform attributeName="transform" additive="sum" type="rotate" dur="3.2s" values="0 91 37; 6 91 37; 0 91 37" repeatCount="indefinite" />
                        </path>
                      </g>
                      <g opacity="0.8">
                        <path d="M500 50 l24 8 -24 8 -6-6 6-10z" fill="url(#g)">
                          <animateTransform attributeName="transform" type="translate" dur="2.8s" values="0 0; 0 10; 0 0" repeatCount="indefinite" />
                          <animateTransform attributeName="transform" additive="sum" type="rotate" dur="3.6s" values="0 512 58; -5 512 58; 0 512 58" repeatCount="indefinite" />
                        </path>
                      </g>
                      <g fill="url(#g)" fillOpacity="0.5">
                        <circle cx="200" cy="85" r="2">
                          <animate attributeName="opacity" dur="2.5s" values="0.2;1;0.2" repeatCount="indefinite" />
                        </circle>
                        <circle cx="420" cy="95" r="2">
                          <animate attributeName="opacity" dur="2.2s" values="0.2;1;0.2" repeatCount="indefinite" />
                        </circle>
                        <circle cx="320" cy="70" r="2">
                          <animate attributeName="opacity" dur="2.8s" values="0.2;1;0.2" repeatCount="indefinite" />
                        </circle>
                      </g>
                    </svg>
                  </div>
                </form>
                <iframe name="hidden_iframe" id="hidden_iframe" style={{ display: 'none' }} />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {t('contact.info.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('contact.info.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{t('contact.info.email')}</p>
                      <p className="text-sm text-muted-foreground">{t('contact.info.email.value')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{t('contact.info.phone')}</p>
                      <p className="text-sm text-muted-foreground">{t('contact.info.phone.value')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{t('contact.info.address')}</p>
                      <p className="text-sm text-muted-foreground">{t('contact.info.address.value')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle>{t('contact.faq.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{t('contact.faq.started.question')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('contact.faq.started.answer')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">{t('contact.faq.free.question')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('contact.faq.free.answer')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">{t('contact.faq.contribute.question')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('contact.faq.contribute.answer')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;