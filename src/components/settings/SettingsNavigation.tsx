"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SettingsNavItem } from "./SettingsNavItem";
import { User, Globe, Moon, MousePointer, Lock, Shield, LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { isCurrentUserAdmin } from "@/lib/adminConfig";

interface SettingsNavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const SettingsNavigation = ({ activeTab, setActiveTab }: SettingsNavigationProps) => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const setTab = (tab: string) => {
        setActiveTab(tab);
        router.push(`/settings#${tab}`);
    };

    const isAdmin = user ? isCurrentUserAdmin(user) : false;

    return (
        <div className="space-y-2">
            <SettingsNavItem
                icon={User}
                title={t('settings.profile')}
                description={t('settings.profile.description')}
                onClick={() => setTab("profile")}
                active={activeTab === "profile"}
            />
            <SettingsNavItem
                icon={Globe}
                title={t('settings.language')}
                description={t('settings.language.description')}
                onClick={() => setTab("language")}
                active={activeTab === "language"}
            />
            {!isMobile && (
                <SettingsNavItem
                    icon={MousePointer}
                    title={
                        <div className="flex items-center gap-2">
                            Animated Cursors
                            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full font-medium">
                                NEW
                            </span>
                        </div>
                    }
                    description="Customize your cursor"
                    onClick={() => setTab("cursors")}
                    active={activeTab === "cursors"}
                />
            )}
            <SettingsNavItem
                icon={Moon}
                title={t('settings.appearance')}
                description={t('settings.appearance.description')}
                onClick={() => setTab("appearance")}
                active={activeTab === "appearance"}
            />
            <SettingsNavItem
                icon={Lock}
                title="Security"
                description="Change your password and manage account security"
                onClick={() => setTab("security")}
                active={activeTab === "security"}
            />
            <SettingsNavItem
                icon={Shield}
                title={t('settings.privacy')}
                description={t('settings.privacy.description')}
                onClick={() => setTab("privacy")}
                active={activeTab === "privacy"}
            />
            {isAdmin && (
                <Link href="/admin">
                    <div className="mt-2">
                        <SettingsNavItem
                            icon={Shield}
                            title="Admin Panel"
                            description="Manage users, posts and blogs"
                            onClick={() => {}}
                            active={false}
                        />
                    </div>
                </Link>
            )}
            <div className="pt-4">
                <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    {t('profile.logout')}
                </Button>
            </div>
        </div>
    );
};