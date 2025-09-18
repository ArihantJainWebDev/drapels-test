"use client";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCursor } from "@/context/CursorContext";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/context/LanguageContext";

export const CursorSettings = () => {
    const { t } = useLanguage();
    const {
        elasticEnabled,
        toggleElastic,
        fireEnabled,
        toggleFire,
        spotlightEnabled,
        toggleSpotlight,
        spotlightSize,
        setSpotlightSize
    } = useCursor();

    return (
        <>
            <CardHeader>
                <CardTitle className="font-light text-gray-900 dark:text-white">Cursor Effects</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Customize your cursor experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label htmlFor="elastic-cursor" className="font-light">Elastic Cursor</Label>
                        <p className="text-sm text-muted-foreground">Jelly-like cursor that stretches when moving</p>
                    </div>
                    <Switch id="elastic-cursor" checked={elasticEnabled} onCheckedChange={toggleElastic} />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label htmlFor="fire-cursor" className="font-light">Fire Cursor</Label>
                        <p className="text-sm text-muted-foreground">Flame trail effect behind your cursor</p>
                    </div>
                    <Switch id="fire-cursor" checked={fireEnabled} onCheckedChange={toggleFire} />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label htmlFor="spotlight-cursor" className="font-light">Spotlight Cursor</Label>
                        <p className="text-sm text-muted-foreground">Dark overlay with a spotlight following your cursor</p>
                    </div>
                    <Switch id="spotlight-cursor" checked={spotlightEnabled} onCheckedChange={toggleSpotlight} />
                </div>

                {spotlightEnabled && (
                    <div className="space-y-3 pt-2">
                        <Label htmlFor="spotlight-size" className="font-light">Spotlight Size</Label>
                        <Slider
                            id="spotlight-size"
                            value={[spotlightSize]}
                            onValueChange={(value) => setSpotlightSize(value[0])}
                            min={80}
                            max={300}
                            step={10}
                        />
                        <p className="text-sm text-muted-foreground">Adjust the spotlight radius: {spotlightSize}px</p>
                    </div>
                )}
            </CardContent>
        </>
    );
};
