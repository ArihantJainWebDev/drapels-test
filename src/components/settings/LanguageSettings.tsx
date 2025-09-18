"use client";
import { useLanguage, Language, languageNames } from "@/context/LanguageContext";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const LanguageSettings = () => {
    const { language, setLanguage, t } = useLanguage();

    const handleLanguageChange = (value: Language) => {
        setLanguage(value);
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="font-light text-gray-900 dark:text-white">{t('settings.language')}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{t('settings.language.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup value={language} onValueChange={handleLanguageChange} className="space-y-2">
                    {Object.keys(languageNames).map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                            <RadioGroupItem value={lang} id={`lang-${lang}`} />
                            <Label htmlFor={`lang-${lang}`} className="font-light">{languageNames[lang as Language]}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </>
    );
};