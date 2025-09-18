'use client';

import { motion } from 'framer-motion';
import { Code, MessageSquare, BarChart2, GitBranch, Zap, Users, CheckCircle, Clock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InteractiveSectionProps {
  t: (key: string) => string;
}

const InteractiveSection = ({ t }: InteractiveSectionProps) => {
  const stats = [
    { 
      value: '10,000+', 
      label: t('home.stats.users'), 
      icon: <Users className="w-5 h-5" />,
      color: 'text-primary'
    },
    { 
      value: '50+', 
      label: t('home.stats.companies'), 
      icon: <Building2 className="w-5 h-5" />,
      color: 'text-secondary'
    },
    { 
      value: '1M+', 
      label: t('home.stats.questions'), 
      icon: <Code className="w-5 h-5" />,
      color: 'text-accent'
    },
    { 
      value: '95%', 
      label: t('home.stats.successRate'), 
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-success'
    },
  ];

  const features = [
    {
      icon: <Code className="w-5 h-5" />,
      title: t('home.interactive.features.codeEditor'),
      description: t('home.interactive.features.codeEditorDesc'),
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: t('home.interactive.features.collaboration'),
      description: t('home.interactive.features.collaborationDesc'),
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary'
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      title: t('home.interactive.features.analytics'),
      description: t('home.interactive.features.analyticsDesc'),
      bgColor: 'bg-accent/10',
      textColor: 'text-accent'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: t('home.interactive.features.timeTracking'),
      description: t('home.interactive.features.timeTrackingDesc'),
      bgColor: 'bg-warning/10',
      textColor: 'text-warning'
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-8">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-foreground">
                {t('home.interactive.heading')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('home.interactive.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="bg-card p-4 rounded-lg shadow-sm border border-border/50 transition-all hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded-md ${stat.color}/10`}>
                      <span className={stat.color}>
                        {stat.icon}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {t('home.interactive.cta.primary')}
                <Zap className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="text-foreground">
                {t('home.interactive.cta.secondary')}
                <GitBranch className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div 
              className="relative z-10 bg-card rounded-xl shadow-lg overflow-hidden border border-border/50"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="h-10 flex items-center px-4 bg-muted/50 border-b border-border/50">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-warning"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
                </div>
                <div className="ml-4 text-sm text-muted-foreground font-mono">
                  interactive-demo.jsx
                </div>
              </div>
              <div className="p-6 space-y-4">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className={`flex items-start space-x-4 p-3 rounded-lg transition-all hover:bg-muted/50`}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${feature.bgColor} ${feature.textColor}`}>
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-2xl opacity-10 blur-3xl"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-warning to-secondary rounded-2xl opacity-10 blur-3xl"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveSection;