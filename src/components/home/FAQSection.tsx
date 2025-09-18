// components/sections/FAQSection.tsx
import { Card, CardContent } from '@/components/ui/card';

const FAQSection = () => {
  const faqs = [
    {
      q: "How quickly can I expect to see results?",
      a: "Most users see improvement in their interview performance within 2-4 weeks of consistent practice."
    },
    {
      q: "Is this suitable for beginners?",
      a: "Absolutely! Our adaptive learning system adjusts to your current skill level and experience."
    },
    {
      q: "What companies do you have insights for?",
      a: "We cover 500+ companies including FAANG, startups, and Indian tech giants like Flipkart, Zomato, and more."
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-32 px-4 relative bg-gray-50/50 dark:bg-gray-950/50">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 text-gray-900 dark:text-white px-4 sm:px-0">
            Frequently Asked{' '}
            <span className="font-extralight text-gray-600 dark:text-gray-400">
              Questions
            </span>
          </h2>
          <div className="mx-auto h-px w-16 sm:w-24 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="group">
              <Card className="hover:shadow-2xl hover:ring-1 hover:ring-[#1EB36B]/30 transition-all duration-300 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-0 rounded-2xl sm:rounded-3xl">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-medium text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-gray-900 dark:text-white">
                    {faq.q}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;