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
    <section className="py-12 sm:py-16 bg-muted/30 dark:bg-accent-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white mb-3">
            {t('home.faq.title')}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground dark:text-gray-300">
            {t('home.faq.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="mb-3 overflow-hidden rounded-lg border border-border/50 dark:border-gray-700/50 transition-all duration-300 bg-card dark:bg-accent-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                className={`flex w-full items-center justify-between p-4 sm:p-5 text-left transition-all ${
                  openIndex === index 
                    ? 'bg-primary/5 dark:bg-primary/10' 
                    : 'hover:bg-muted/50 dark:hover:bg-gray-700/30'
                }`}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-${index}`}
              >
                <div className="flex items-start">
                  <div className={`p-1 rounded-lg mr-3 mt-0.5 ${openIndex === index ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400' : 'bg-muted text-muted-foreground dark:bg-gray-700 dark:text-gray-400'}`}>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h3 className={`text-base sm:text-lg font-medium text-left ${
                    openIndex === index ? 'text-foreground dark:text-white' : 'text-foreground/90 dark:text-gray-200'
                  }`}>
                    {faq.question}
                  </h3>
                </div>
                <div className={`p-1 rounded-full ${openIndex === index ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400' : 'text-muted-foreground dark:text-gray-400'}`}>
                  {openIndex === index ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
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
                    <div className="px-4 sm:px-5 pb-4 text-muted-foreground dark:text-gray-300 text-sm sm:text-base pl-7 sm:pl-8">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-8 sm:mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-muted-foreground dark:text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg">
            {t('home.faq.contactPrompt')}
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary-600 dark:hover:bg-primary-700">
            <Mail className="w-4 h-4 mr-2" />
            {t('home.faq.contactButton')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;