'use client';
import { useLanguage } from '@/context/LanguageContext';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const PrivacySettings = () => {
    const { t } = useLanguage();

    return (
        <>
            <CardHeader>
                <CardTitle className="font-light text-gray-900 dark:text-white">{t('settings.privacy')}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{t('settings.privacy.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/privacy" className="block">
                        <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-1">
                            <span className="font-medium">{t('settings.privacy.policy')}</span>
                            <span className="text-sm text-gray-500">{t('settings.privacy.policy.description')}</span>
                        </Button>
                    </Link>
                    
                    <Link href="/terms" className="block">
                        <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-1">
                            <span className="font-medium">{t('settings.privacy.terms')}</span>
                            <span className="text-sm text-gray-500">{t('settings.privacy.terms.description')}</span>
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </>
    );
};