import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  feature: {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
  };
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  return (
    <div className="group h-full">
      <Card className="h-full border-0 shadow-lg hover:shadow-2xl hover:ring-1 hover:ring-[#1EB36B]/30 transition-all duration-300 bg-white/80 dark:bg-black/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/30 dark:border-gray-800/30">
        <CardContent className="p-6 sm:p-8 text-center relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg bg-gradient-to-br from-[#93C5FD] to-[#1EB36B] text-white">
            <feature.icon className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>

          <h3 className="font-medium text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-gray-900 dark:text-white">
            {index === 0 ? (
              <>
                <span className="sm:hidden">Personalised Roadmap</span>
                <span className="hidden sm:inline">{feature.title}</span>
              </>
            ) : (
              feature.title
            )}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-light">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureCard;