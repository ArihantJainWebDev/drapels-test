// types/index.ts
import { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface TranslationFunction {
  (key: string): string;
}