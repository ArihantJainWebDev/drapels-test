'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const AboutPage = () => {
  const languageContext = useLanguage();
  if (!languageContext) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  const { t } = languageContext;

  const founders = [
    {
      name: t('about.founders.aditya.name'),
      role: t('about.founders.aditya.role'),
      bio: t('about.founders.aditya.bio'),
      avatar: "A",
      image: "/Aditya.PNG"
    },
    {
      name: t('about.founders.taizun.name'),
      role: t('about.founders.taizun.role'),
      bio: t('about.founders.taizun.bio'),
      avatar: "TK",
      image: "/Taizun.PNG"
    },
    {
      name: t('about.founders.arihant.name'),
      role: t('about.founders.arihant.role'),
      bio: t('about.founders.arihant.bio'),
      avatar: "AJ",
      image: "/Arihant.PNG"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF8EE] dark:bg-black">
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-light mb-4 text-gray-900 dark:text-white">{t('about.title')}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
              {t('about.subtitle')}
            </p>
          </div>

          <div className="mb-16">
            <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-light mb-6 text-gray-900 dark:text-white">{t('about.mission.title')}</h2>
                <p className="text-lg mb-6">
                  {t('about.mission.para1')}
                </p>
                <p className="text-lg">
                  {t('about.mission.para2')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-light mb-8 text-center text-gray-900 dark:text-white">{t('about.founders.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {founders.map((founder, index) => {
                const getProfileUrl = (name: string) => {
                  if (name === t('about.founders.aditya.name')) return "/aditya";
                  if (name === t('about.founders.taizun.name')) return "/taizun";
                  if (name === t('about.founders.arihant.name')) return "/arihant";
                  return "";
                };
                
                return (
                  <Link key={index} href={getProfileUrl(founder.name)}>
                    <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                      <CardContent className="p-6 text-center flex flex-col flex-grow">
                        <Avatar className="w-24 h-24 mx-auto mb-4">
                          <AvatarImage src={founder.image} alt={founder.name} />
                          <AvatarFallback className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xl">
                            {founder.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold mb-1">{founder.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{founder.role}</p>
                        <p className="text-muted-foreground">{founder.bio}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-light mb-6 text-gray-900 dark:text-white">{t('about.join.title')}</h2>
                <p className="text-lg max-w-3xl mx-auto">
                  {t('about.join.desc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
