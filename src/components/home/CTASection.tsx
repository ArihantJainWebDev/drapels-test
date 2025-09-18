// components/sections/CTASection.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Zap, Users, Clock, Trophy } from 'lucide-react';

interface CTASectionProps {
  user: any;
  t: (key: string) => string;
}

const CTASection = ({ user, t }: CTASectionProps) => {
  const features = [
    {
      icon: <CheckCircle className="w-5 h-5 text-success" />,
      text: t('home.cta.features.one'),
      bgColor: 'bg-success/10',
      textColor: 'text-success'
    },
    {
      icon: <Zap className="w-5 h-5 text-warning" />,
      text: t('home.cta.features.two'),
      bgColor: 'bg-warning/10',
      textColor: 'text-warning'
    },
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      text: t('home.cta.features.three'),
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      icon: <Trophy className="w-5 h-5 text-accent" />,
      text: t('home.cta.features.four'),
      bgColor: 'bg-accent/10',
      textColor: 'text-accent'
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-40 -left-20 w-72 h-72 bg-accent/50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('home.cta.heading')}
          </motion.h2>
          
          <motion.p 
            className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('home.cta.subtitle')}
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className={`flex items-start space-x-3 backdrop-blur-sm rounded-xl p-4 transition-all hover:-translate-y-1 ${feature.bgColor} ${feature.textColor} hover:shadow-lg`}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`p-1 rounded-md ${feature.textColor}/20`}>
                  {feature.icon}
                </div>
                <span className="text-foreground text-left">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="bg-background text-foreground hover:bg-background/90 font-medium group text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              {user ? t('home.cta.primaryLoggedIn') : t('home.cta.primary')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-background border-background/30 hover:bg-background/10 hover:text-background text-lg px-8 py-6 hover:shadow-lg transition-all"
            >
              {t('home.cta.secondary')}
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center space-x-2 text-primary-foreground/80 text-sm mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CheckCircle className="w-4 h-4 text-success" />
            <span>{t('home.cta.note')}</span>
          </motion.div>
          
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-primary-foreground/80 text-sm">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
            <span className="text-sm sm:text-base">Join in 30 seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;