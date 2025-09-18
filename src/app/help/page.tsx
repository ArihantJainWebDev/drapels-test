'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function HelpPage() {
  const { t } = useLanguage();
  
  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-light mb-4 text-gray-900 dark:text-white">{title}</h2>
      <Separator className="my-3" />
      <div className="prose prose-slate dark:prose-invert max-w-none">{children}</div>
    </section>
  );

  return (
    <main className="min-h-screen bg-[#FFF8EE] dark:bg-black">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-full bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 text-gray-700 dark:text-gray-300 px-2.5 py-0.5 text-xs font-light">
              Guide
            </span>
            <span className="text-gray-600 dark:text-gray-400 font-light">Last updated automatically as features ship</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900 dark:text-white">Help & User Guide</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl font-light">
            Welcome to Drapels – your one-stop platform for AI coding assistance, learning, community, and content.
            This guide explains what you can do here and how to get the most out of every feature.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of contents */}
          <aside className="lg:col-span-1 order-last lg:order-first lg:sticky lg:top-24 h-fit">
            <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-base font-light text-gray-900 dark:text-white">On this page</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2 text-sm">
                  <ul className="space-y-2">
                    <li><Link href="#overview">Overview</Link></li>
                    <li><Link href="#getting-started">Getting Started</Link></li>
                    <li><Link href="#core-features">Core Features</Link></li>
                    <li><Link href="#how-to">How-to Guides</Link></li>
                    <li><Link href="#credits">Credits & Usage</Link></li>
                    <li><Link href="#privacy">Privacy & Security</Link></li>
                    <li><Link href="#faq">FAQ</Link></li>
                    <li><Link href="#troubleshooting">Troubleshooting</Link></li>
                    <li><Link href="#contact">Contact & Support</Link></li>
                  </ul>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Overview section */}
            <Section id="overview" title="Overview">
              <p>
                Drapels combines AI tools, developer resources, community interactions, and content publishing into a seamless experience. Explore AI-powered solvers like <Link href="/neuron" className="text-[#1EB36B] hover:opacity-80">Neuron</Link> and real-time voice AI via <Link href="/nexa" className="text-[#1EB36B] hover:opacity-80">Nexa</Link>, build your learning roadmap, create a resume, read and write blogs, participate in the community, and more.
              </p>
              <ul>
                <li><strong>AI Utilities</strong>: Neuron (AI DSA solver), Nexa (live AI voice calls), Email Generator, Online Compiler.</li>
                <li><strong>Learning</strong>: Roadmap Generator, DSA Sheet, Interview Preparation, Courses.</li>
                <li><strong>Content</strong>: Blogs (read, create, edit), Documentation.</li>
                <li><strong>Community</strong>: Public communities, channels, events, user profiles and posts.</li>
                <li><strong>Account</strong>: Authentication, username setup, profile and settings, usage credits.</li>
              </ul>
            </Section>

            {/* Getting Started section */}
            <Section id="getting-started" title="Getting Started">
              <ol>
                <li>
                  <strong>Create your account</strong>: Use <Link href="/login" className="text-[#1EB36B] hover:opacity-80">Login</Link> with GitHub/Google or email.
                </li>
                <li>
                  <strong>Complete your profile</strong>: Set up your username, profile picture, and bio.
                </li>
                <li>
                  <strong>Explore the platform</strong>: Familiarize yourself with the different sections and features.
                </li>
              </ol>
            </Section>

            {/* Core Features section */}
            <Section id="core-features" title="Core Features">
              <h3 className="text-xl font-light">AI & Developer Tools</h3>
              <ul>
                <li><strong>Neuron</strong>: AI DSA solver for coding assistance.</li>
                <li><strong>Nexa</strong>: Real-time voice AI for live conversations.</li>
                <li><strong>Email Generator</strong>: Generate professional emails with ease.</li>
                <li><strong>Online Compiler</strong>: Compile and run code online.</li>
              </ul>
              <h3 className="text-xl font-light">Learning Resources</h3>
              <ul>
                <li><strong>Roadmap Generator</strong>: Create a personalized learning plan.</li>
                <li><strong>DSA Sheet</strong>: Practice DSA problems and track progress.</li>
                <li><strong>Interview Preparation</strong>: Prepare for coding interviews with resources and tips.</li>
                <li><strong>Courses</strong>: Take online courses to improve coding skills.</li>
              </ul>
              <h3 className="text-xl font-light">Content Creation</h3>
              <ul>
                <li><strong>Blogs</strong>: Read, create, and edit blog posts on various topics.</li>
                <li><strong>Documentation</strong>: Access official documentation for Drapels features.</li>
              </ul>
              <h3 className="text-xl font-light">Community Features</h3>
              <ul>
                <li><strong>Public Communities</strong>: Join and participate in public communities.</li>
                <li><strong>Channels</strong>: Engage in discussions on various channels.</li>
                <li><strong>Events</strong>: Attend events and meetups organized by the community.</li>
                <li><strong>User Profiles and Posts</strong>: View user profiles and posts.</li>
              </ul>
            </Section>

            {/* How-to Guides section */}
            <Section id="how-to" title="How-to Guides">
              <ol>
                <li><strong>Use Neuron for coding help</strong>: Go to <Link href="/neuron" className="text-[#1EB36B] hover:opacity-80">/neuron</Link> and ask Neuron for coding assistance.</li>
                <li><strong>Create a blog post</strong>: Go to <Link href="/blog" className="text-[#1EB36B] hover:opacity-80">/blog</Link> and create a new blog post.</li>
                <li><strong>Participate in the community</strong>: Join a public community and engage in discussions.</li>
              </ol>
            </Section>

            {/* Credits & Usage section */}
            <Section id="credits" title="Credits & Usage">
              <p>
                Learn about Drapels' usage credits and how to earn them.
              </p>
              <ul>
                <li><strong>Earning credits</strong>: Find out how to earn usage credits by contributing to the community and creating content.</li>
                <li><strong>Using credits</strong>: Learn how to use your credits to access premium features and content.</li>
              </ul>
            </Section>

            {/* Privacy & Security section */}
            <Section id="privacy" title="Privacy & Security">
              <p>
                Learn about Drapels' privacy and security policies.
              </p>
              <ul>
                <li><strong>Data protection</strong>: Find out how Drapels protects your personal data.</li>
                <li><strong>Security measures</strong>: Learn about the security measures Drapels has in place to protect your account and data.</li>
              </ul>
            </Section>

            {/* FAQ Section */}
            <Section id="faq" title="Frequently Asked Questions">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger>Why can't I see my username or profile?</AccordionTrigger>
                  <AccordionContent>
                    Make sure you've completed <Link href="/username" className="text-[#1EB36B] hover:opacity-80">username setup</Link> and are logged in. Some areas require authentication.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                  <AccordionContent>
                    Go to the <Link href="/login" className="text-[#1EB36B] hover:opacity-80">Login</Link> page and click on "Forgot password".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>What is the purpose of the roadmap generator?</AccordionTrigger>
                  <AccordionContent>
                    The roadmap generator helps you create a personalized learning plan based on your goals and interests.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger>How do I join a community?</AccordionTrigger>
                  <AccordionContent>
                    Click on the "Communities" tab and browse through the list of available communities. You can join a community by clicking on the "Join" button.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-5">
                  <AccordionTrigger>Can I create my own community?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can create your own community by clicking on the "Create Community" button on the Communities page.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-6">
                  <AccordionTrigger>How do I report a bug or issue?</AccordionTrigger>
                  <AccordionContent>
                    You can report a bug or issue by clicking on the "Report Issue" button on the bottom right corner of the screen.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-7">
                  <AccordionTrigger>What is the difference between a blog post and a documentation page?</AccordionTrigger>
                  <AccordionContent>
                    A blog post is a personal article written by a user, while a documentation page is a official resource created by the Drapels team.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-8">
                  <AccordionTrigger>How do I delete my account?</AccordionTrigger>
                  <AccordionContent>
                    You can delete your account by going to the Settings page and clicking on the "Delete Account" button.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-9">
                  <AccordionTrigger>What happens to my data when I delete my account?</AccordionTrigger>
                  <AccordionContent>
                    When you delete your account, all your personal data will be permanently deleted from our servers.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Section>

            {/* Troubleshooting section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <p>
                Get help with common issues and errors.
              </p>
              <ul>
                <li><strong>Login issues</strong>: Find out what to do if you're having trouble logging in.</li>
                <li><strong>Content not loading</strong>: Learn how to troubleshoot content loading issues.</li>
              </ul>
            </Section>

            {/* Contact & Support section */}
            <Section id="contact" title="Contact & Support">
              <p>
                Get in touch with the Drapels team for support and feedback.
              </p>
              <ul>
                <li><strong>Contact form</strong>: Use the contact form to send us a message.</li>
                <li><strong>Support email</strong>: Email us directly for support and feedback.</li>
              </ul>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}
