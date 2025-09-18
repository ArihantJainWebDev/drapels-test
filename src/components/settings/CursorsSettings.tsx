'use client';
import { useState, useEffect } from 'react';
import { useSpotlight } from '@/context/SpotlightContext';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const CursorsSettings = () => {
    const { isSpotlightEnabled, toggleSpotlight } = useSpotlight();
    const [elasticCursorEnabled, setElasticCursorEnabled] = useState(false);
    const [fireCursorEnabled, setFireCursorEnabled] = useState(false);

    useEffect(() => {
        setElasticCursorEnabled(localStorage.getItem("elasticCursorEnabled") === "true");
        setFireCursorEnabled(localStorage.getItem("fireCursorEnabled") === "true");
    }, []);

    const handleElasticCursorToggle = (checked: boolean) => {
        setElasticCursorEnabled(checked);
        localStorage.setItem("elasticCursorEnabled", checked ? "true" : "false");
        if (checked) {
            if (fireCursorEnabled) {
                setFireCursorEnabled(false);
                localStorage.setItem("fireCursorEnabled", "false");
                window.dispatchEvent(new StorageEvent("storage", { key: "fireCursorEnabled", newValue: "false" }));
            }
            if (isSpotlightEnabled) {
                toggleSpotlight();
            }
        }
        window.dispatchEvent(new StorageEvent("storage", { key: "elasticCursorEnabled", newValue: checked ? "true" : "false" }));
    };

    const handleFireCursorToggle = (checked: boolean) => {
        setFireCursorEnabled(checked);
        localStorage.setItem("fireCursorEnabled", checked ? "true" : "false");
        if (checked) {
            if (elasticCursorEnabled) {
                setElasticCursorEnabled(false);
                localStorage.setItem("elasticCursorEnabled", "false");
                window.dispatchEvent(new StorageEvent("storage", { key: "elasticCursorEnabled", newValue: "false" }));
            }
            if (isSpotlightEnabled) {
                toggleSpotlight();
            }
        }
        window.dispatchEvent(new StorageEvent("storage", { key: "fireCursorEnabled", newValue: checked ? "true" : "false" }));
    };

    const handleSpotlightToggle = (checked: boolean) => {
        if (checked) {
            if (elasticCursorEnabled) {
                setElasticCursorEnabled(false);
                localStorage.setItem("elasticCursorEnabled", "false");
                window.dispatchEvent(new StorageEvent("storage", { key: "elasticCursorEnabled", newValue: "false" }));
            }
            if (fireCursorEnabled) {
                setFireCursorEnabled(false);
                localStorage.setItem("fireCursorEnabled", "false");
                window.dispatchEvent(new StorageEvent("storage", { key: "fireCursorEnabled", newValue: "false" }));
            }
        }
        toggleSpotlight();
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="font-light text-gray-900 dark:text-white">Animated Cursors</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Customize your cursor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="elastic-cursor-toggle" className="font-light">Elastic Cursor</Label>
                    <Switch id="elastic-cursor-toggle" checked={elasticCursorEnabled} onCheckedChange={handleElasticCursorToggle} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="fire-cursor-toggle" className="font-light">Fire Cursor</Label>
                    <Switch id="fire-cursor-toggle" checked={fireCursorEnabled} onCheckedChange={handleFireCursorToggle} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="spotlight-cursor-toggle" className="font-light">Spotlight Cursor</Label>
                    <Switch id="spotlight-cursor-toggle" checked={isSpotlightEnabled} onCheckedChange={handleSpotlightToggle} />
                </div>
            </CardContent>
        </>
    );
};