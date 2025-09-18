'use client';

import { motion } from 'framer-motion';
import { Code, Brain, Lightbulb, MessageSquare, Mail as MailIcon, BookOpen, Users, Briefcase, FileText } from 'lucide-react';

interface FeaturesSectionProps {
  t: (key: string) => string;
}

const FeaturesSection = ({ t }: FeaturesSectionProps) => {
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: t('home.features.ai.title'),
      description: t('home.features.ai.description'),
      tools: [
        { name: t('home.features.ai.tools.neuron'), icon: <Brain className="w-4 h-4" /> },
        { name: t('home.features.ai.tools.mock'), icon: <Users className="w-4 h-4" /> },
        { name: t('home.features.ai.tools.quiz'), icon: <BookOpen className="w-4 h-4" /> },
        { name: t('home.features.ai.tools.roadmap'), icon: <Code className="w-4 h-4" /> },
      ]
    },
    {
      icon: <Code className="w-6 h-6 text-secondary" />,
      title: t('home.features.practice.title'),
      description: t('home.features.practice.description'),
      tools: [
        { name: t('home.features.practice.tools.compiler'), icon: <Code className="w-4 h-4" /> },
        { name: t('home.features.practice.tools.problem'), icon: <BookOpen className="w-4 h-4" /> },
        { name: t('home.features.practice.tools.documentation'), icon: <BookOpen className="w-4 h-4" /> },
      ]
    },
    {
      icon: <Briefcase className="w-6 h-6 text-accent" />,
      title: t('home.features.career.title'),
      description: t('home.features.career.description'),
      tools: [
        { name: t('home.features.career.tools.company'), icon: <Briefcase className="w-4 h-4" /> },
        { name: t('home.features.career.tools.resume'), icon: <FileText className="w-4 h-4" /> },
        { name: t('home.features.career.tools.email'), icon: <MailIcon className="w-4 h-4" /> },
        { name: t('home.features.career.tools.community'), icon: <Users className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('home.features.heading')}
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('home.features.subtitle')}
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                index === 0 ? 'bg-primary/10 text-primary' : 
                index === 1 ? 'bg-secondary/10 text-secondary' : 
                'bg-accent/10 text-accent'
              } mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {feature.description}
              </p>
              <div className="mt-4 space-y-2">
                {feature.tools.map((tool, toolIndex) => (
                  <div key={toolIndex} className="flex items-center text-sm text-muted-foreground">
                    <span className={`mr-2 ${
                      index === 0 ? 'text-primary' : 
                      index === 1 ? 'text-secondary' : 'text-accent'
                    }`}>•</span>
                    <span>{tool.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;