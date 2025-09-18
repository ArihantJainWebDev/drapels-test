'use client';

import { useTheme } from '@/context/ThemeContext';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const AppearanceSettings = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <CardHeader>
                <CardTitle className="font-light text-gray-900 dark:text-white">Appearance</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Customize your theme preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                        <Label htmlFor="dark-mode-toggle" className="font-light block text-gray-900 dark:text-white">Dark Mode</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
                    </div>
                    <Switch 
                        id="dark-mode-toggle" 
                        checked={theme === 'dark'} 
                        onCheckedChange={toggleTheme}
                        className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-200"
                    />
                </div>
            </CardContent>
        </>
    );
};