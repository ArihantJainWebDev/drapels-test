import {
  Brain,
  Sparkles,
  Code,
  User,
  Mail,
  FileText,
  Building2,
  ListChecks,
  GraduationCap,
} from "lucide-react";

export type ToolLink = {
  href: string;
  labelKey: string; // i18n key
  fallbackLabel: string; // default label
  description: string;
  seoTitle: string;
  icon: any;
  topics?: string[];
};

// Factory to build tools list with translations supplied by caller
export const getToolsNavLinks = (t: (key: string) => string): ToolLink[] => {
  const tr = (key: string, fallback: string) => {
    const v = t(key);
    return v === key ? fallback : v;
  };

  return [
    {
      href: "/quiz",
      labelKey: "tools.aiquiz",
      fallbackLabel: "AI-Powered Quiz",
      icon: Brain,
      description: "Test your knowledge with AI",
      seoTitle: "AI Programming Quiz - Test Your Coding Skills",
      topics: ["MCQ", "Timed", "Explanations"],
    },
    {
      href: "/nexa",
      labelKey: "tools.nexa",
      fallbackLabel: "Nexa",
      icon: Sparkles,
      description: "Talk to your career & company tech assistant",
      seoTitle: "Nexa - AI Career & Company Tech Voice Assistant",
      topics: ["Voice", "Realtime", "Assistant"],
    },
    {
      href: "/neuron",
      labelKey: "tools.neuron",
      fallbackLabel: "Neuron",
      icon: Code,
      description: "AI-powered DSA problem solver",
      seoTitle: "Neuron AI DSA Solver - Data Structures & Algorithms Solutions",
      topics: ["Algorithm", "Pseudocode", "Flowchart", "Code"],
    },
    {
      href: "/neuron-ai",
      labelKey: "tools.neuronai",
      fallbackLabel: "Neuron AI Chat",
      icon: Code,
      description: "Interactive conversational AI for guided DSA learning",
      seoTitle: "Neuron Conversational AI - Interactive DSA Learning",
      topics: ["Conversational AI", "Guided Learning", "Interactive", "DSA"],
    },
    {
      href: "/compiler",
      labelKey: "tools.compiler",
      fallbackLabel: "Online Compiler",
      icon: Code,
      description: "Code, compile and debug online",
      seoTitle: "Online Code Compiler - Write and Execute Code in Browser",
      topics: ["Coding", "Debugging", "Multiple Languages"],
    },
    {
      href: "/interview-preparation",
      labelKey: "tools.interviewprep",
      fallbackLabel: "Interview Preparation",
      icon: User,
      description: "Ace your tech interviews",
      seoTitle: "Technical Interview Preparation - Coding Interview Practice",
      topics: ["DSA", "Behavioral", "System Design"],
    },
    {
      href: "/email-generator",
      labelKey: "tools.emailgenerator",
      fallbackLabel: "Professional Email Generator",
      icon: Mail,
      description: "AI-powered professional email templates",
      seoTitle: "AI Email Generator - Professional Email Templates",
      topics: ["Cover Letters", "Follow-ups", "Outreach"],
    },
    {
      href: "/resume-builder",
      labelKey: "tools.resumebuilder",
      fallbackLabel: "Resume Builder",
      icon: FileText,
      description: "Design professional resumes with multiple templates",
      seoTitle: "Resume Builder - Create Professional Resumes Online",
      topics: ["Templates", "ATS", "PDF"],
    },
    {
      href: "/dsa-sheet",
      labelKey: "tools.dsasheet",
      fallbackLabel: "DSA Practice Sheet",
      icon: ListChecks,
      description: "Master data structures and algorithms",
      seoTitle: "Data Structures & Algorithms Practice - Coding Problems",
      topics: ["Arrays", "Graphs", "DP"],
    },
    {
      href: "/companies",
      labelKey: "nav.companies",
      fallbackLabel: "Top Tech Companies",
      icon: Building2,
      description: "Explore career opportunities",
      seoTitle: "Top Tech Companies - Career Opportunities & Insights",
      topics: ["Salaries", "Openings", "Insights"],
    },
    {
      href: "/courses",
      labelKey: "tools.courses",
      fallbackLabel: "Course Platform",
      icon: GraduationCap,
      description: "Learn with interactive courses and hands-on projects",
      seoTitle:
        "Course Platform - Interactive Learning with AI-Powered Feedback",
      topics: ["Interactive", "Projects", "AI Feedback"],
    },
  ].map((item) => ({
    ...item,
    // Provide translated label lazily via a getter pattern
    // Consumers should compute label with the same tr function where needed
    // We'll keep key and fallback to recompute in components
  })) as ToolLink[];
};
