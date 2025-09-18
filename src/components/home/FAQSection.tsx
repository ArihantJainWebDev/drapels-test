'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, HelpCircle, Mail } from 'lucide-react';

interface FAQSectionProps {
  t: (key: string) => string;
}

type FAQItem = {
  question: string;
  answer: string;
};

const FAQSection = ({ t }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: t('home.faq.howToStart'),
      answer: t('home.faq.howToStartAnswer')
    },
    {
      question: t('home.faq.freeTrial'),
      answer: t('home.faq.freeTrialAnswer')
    },
    {
      question: t('home.faq.languages'),
      answer: t('home.faq.languagesAnswer')
    },
    {
      question: t('home.faq.aiLearning'),
      answer: t('home.faq.aiLearningAnswer')
    },
    {
      question: t('home.faq.interviewPrep'),
      answer: t('home.faq.interviewPrepAnswer')
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('home.faq.title')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('home.faq.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="mb-4 overflow-hidden rounded-xl border border-border/50 transition-all duration-300 bg-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                className={`flex w-full items-center justify-between p-6 text-left transition-all ${
                  openIndex === index 
                    ? 'bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-${index}`}
              >
                <div className="flex items-start">
                  <div className={`p-1.5 rounded-lg mr-4 mt-0.5 ${openIndex === index ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h3 className={`text-lg font-medium text-left ${
                    openIndex === index ? 'text-foreground' : 'text-foreground/90'
                  }`}>
                    {faq.question}
                  </h3>
                </div>
                <div className={`p-1 rounded-full ${openIndex === index ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 text-muted-foreground pl-16">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-muted-foreground mb-6 text-lg">
            {t('home.faq.contactPrompt')}
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Mail className="w-4 h-4 mr-2" />
            {t('home.faq.contactButton')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;