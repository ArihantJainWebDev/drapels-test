"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Settings as SettingsIcon, User, Shield, Moon, Globe, ChevronRight, LogOut, Lock, MousePointer } from 'lucide-react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage, Language, languageNames } from "@/context/LanguageContext";
import { useSpotlight } from "@/context/SpotlightContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { isCurrentUserAdmin } from "@/lib/adminConfig";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { CursorSettings } from "@/components/settings/CursorSettings";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import { CookieBanner } from "@/components/layout";
import { ScrollToTop } from "@/components/layout";
import { ResponsiveLayoutProvider } from "@/components/layout";

export default function SettingsPage() {
    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const { isSpotlightEnabled, toggleSpotlight, spotlightSize, setSpotlightSize } = useSpotlight();
    const pathname = usePathname();
    const router = useRouter();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [username, setUsername] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("profile");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPwd, setChangingPwd] = useState(false);
    const [pwdMessage, setPwdMessage] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [elasticCursorEnabled, setElasticCursorEnabled] = useState(false);
    const [fireCursorEnabled, setFireCursorEnabled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    interface SettingsNavItemProps {
        icon: React.ComponentType<{ className?: string }>;
        title: string | React.ReactNode;
        description: string;
        onClick: () => void;
        active?: boolean;
    }

    const SettingsNavItem = ({ 
        icon: Icon, 
        title, 
        description, 
        onClick, 
        active = false 
    }: SettingsNavItemProps) => (
        <div 
            className={`flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-colors ${active ? 'bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-md' : 'hover:bg-white/40 dark:hover:bg-black/30'}`}
            onClick={onClick}
        >
            <div className="mt-0.5">
                <Icon className="h-5 w-5 text-[#1EB36B]" />
            </div>
            <div className="flex-1">
                <h3 className="font-light text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
    );

    const handleLanguageChange = (language: Language) => {
        setLanguage(language);
    };

    const handleElasticCursorToggle = (checked: boolean) => {
        setElasticCursorEnabled(checked);
        localStorage.setItem("elasticCursorEnabled", checked ? "true" : "false");
        
        // Disable other cursors if elastic cursor is enabled
        if (checked) {
            if (fireCursorEnabled) {
                setFireCursorEnabled(false);
                localStorage.setItem("fireCursorEnabled", "false");
            }
            if (isSpotlightEnabled) {
                toggleSpotlight();
            }
        }
        
        // Notify other parts of app
        window.dispatchEvent(new StorageEvent("storage", { 
            key: "elasticCursorEnabled", 
            newValue: checked ? "true" : "false" 
        }));
    };

    const handleFireCursorToggle = (checked: boolean) => {
        setFireCursorEnabled(checked);
        localStorage.setItem("fireCursorEnabled", checked ? "true" : "false");
        
        // Disable other cursors if fire cursor is enabled
        if (checked) {
            if (elasticCursorEnabled) {
                setElasticCursorEnabled(false);
                localStorage.setItem("elasticCursorEnabled", "false");
            }
            if (isSpotlightEnabled) {
                toggleSpotlight();
            }
        }
        
        // Notify other parts of app
        window.dispatchEvent(new StorageEvent("storage", { 
            key: "fireCursorEnabled", 
            newValue: checked ? "true" : "false" 
        }));
    };

    const handleSpotlightToggle = (checked: boolean) => {
        // Disable other cursors if spotlight is enabled
        if (checked) {
            if (elasticCursorEnabled) {
                setElasticCursorEnabled(false);
                localStorage.setItem("elasticCursorEnabled", "false");
            }
            if (fireCursorEnabled) {
                setFireCursorEnabled(false);
                localStorage.setItem("fireCursorEnabled", "false");
            }
        }
        
        toggleSpotlight();
    };

    return (
        <div className="min-h-screen bg-[#FFF8EE] dark:bg-black">
            <ResponsiveLayoutProvider>
                <Header />
                <div className="container mx-auto px-4 py-20 max-w-6xl">
                    <h1 className="text-3xl font-light mb-8 text-gray-900 dark:text-white">Settings</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Settings Navigation */}
                        <div className="space-y-2">
                            <SettingsNavItem 
                                icon={User} 
                                title="Profile" 
                                description="Manage your account details"
                                onClick={() => setActiveTab("profile")}
                                active={activeTab === "profile"}
                            />
                            <SettingsNavItem 
                                icon={Globe} 
                                title="Language" 
                                description="Set your preferred language"
                                onClick={() => setActiveTab("language")}
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
                                  onClick={() => setActiveTab("cursors")}
                                  active={activeTab === "cursors"}
                              />
                            )}
                            <SettingsNavItem 
                                icon={Moon} 
                                title="Appearance" 
                                description="Customize theme and display"
                                onClick={() => setActiveTab("appearance")}
                                active={activeTab === "appearance"}
                            />
                            <SettingsNavItem 
                                icon={Lock} 
                                title="Security" 
                                description="Change password and security"
                                onClick={() => setActiveTab("security")}
                                active={activeTab === "security"}
                            />
                            <SettingsNavItem 
                                icon={Shield} 
                                title="Privacy" 
                                description="View policies and terms"
                                onClick={() => setActiveTab("privacy")}
                                active={activeTab === "privacy"}
                            />
                        </div>
                        
                        {/* Settings Content */}
                        <div className="md:col-span-2">
                            <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl">
                                {activeTab === "profile" && (
                                    <>
                                        <CardHeader>
                                            <CardTitle className="font-light text-gray-900 dark:text-white">Profile</CardTitle>
                                            <CardDescription className="text-gray-600 dark:text-gray-400">Manage your account details</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                <div className="flex flex-col items-center mb-2">
                                                    <div className="relative">
                                                        <img 
                                                            src={photoURL || "/guest.PNG"}
                                                            alt="Profile"
                                                            className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                                                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/guest.PNG"; }}
                                                            loading="lazy"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    </div>
                                                    <div className="mt-4 flex gap-2">
                                                        <Button 
                                                            type="button" 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            disabled={uploading}
                                                        >
                                                            Change Photo
                                                        </Button>
                                                    </div>
                                                    {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                                                </div>
                                                
                                                <div className="text-center space-y-1">
                                                    {username && (
                                                        <p className="text-sm text-muted-foreground">@{username}</p>
                                                    )}
                                                    <h2 className="text-xl font-light text-gray-900 dark:text-white">{displayName || 'User'}</h2>
                                                </div>

                                                {message && (
                                                    <p className={`text-sm ${message.includes("Error") ? "text-destructive" : "text-green-600"}`}>
                                                        {message}
                                                    </p>
                                                )}

                                                <div className="flex justify-center">
                                                    <Link href="/profile">
                                                        <Button variant="outline" size="sm">Edit Profile</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </>
                                )}
                                {activeTab === "language" && (
                                    <>
                                        <CardHeader>
                                            <CardTitle className="font-light text-gray-900 dark:text-white">Language</CardTitle>
                                            <CardDescription className="text-gray-600 dark:text-gray-400">Set your preferred language</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <RadioGroup 
                                                value={language} 
                                                onValueChange={(value) => handleLanguageChange(value as Language)}
                                                className="space-y-4"
                                            >
                                                {Object.entries(languageNames).map(([code, name]) => (
                                                    <div key={code} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={code} id={`language-${code}`} />
                                                        <Label htmlFor={`language-${code}`} className="flex-1">{name}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </CardContent>
                                    </>
                                )}
                                {activeTab === "appearance" && <AppearanceSettings />}
                                {activeTab === "security" && <SecuritySettings />}
                                {activeTab === "privacy" && (
                                    <>
                                        <CardHeader>
                                            <CardTitle className="font-light text-gray-900 dark:text-white">Privacy & Terms</CardTitle>
                                            <CardDescription className="text-gray-600 dark:text-gray-400">View policies and agreements</CardDescription>
                                        </CardHeader>
                                        <CardContent className="max-w-none">
                                            <div className="grid gap-8 md:grid-cols-2">
                                                {/* Privacy */}
                                                <section id="privacy" className="space-y-4">
                                                    <h3 className="text-xl font-light text-gray-900 dark:text-white">Privacy Policy</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        We collect the minimum data required to provide core features. We never sell personal data.
                                                    </p>
                                                    <div className="space-y-3">
                                                        <h4 className="font-light text-gray-900 dark:text-white">What We Collect</h4>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            <li>Account info (name, email) from signup/login</li>
                                                            <li>Content you create (posts, comments, events)</li>
                                                            <li>Usage logs to improve reliability and safety</li>
                                                        </ul>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h4 className="font-semibold">How We Use Data</h4>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            <li>Operate features (community feed, events, tools)</li>
                                                            <li>Secure accounts and prevent abuse</li>
                                                            <li>Improve UX with aggregate, anonymized insights</li>
                                                        </ul>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h4 className="font-semibold">Your Controls</h4>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            <li>Update profile details anytime</li>
                                                            <li>Request export or deletion of your data via Contact</li>
                                                            <li>Control theme and language preferences</li>
                                                        </ul>
                                                    </div>
                                                </section>

                                                {/* Terms */}
                                                <section id="terms" className="space-y-4">
                                                    <h3 className="text-xl font-semibold">Terms of Service</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        By using Drapels, you agree to follow these terms and community guidelines.
                                                    </p>
                                                    <div className="space-y-3">
                                                        <h4 className="font-semibold">Acceptable Use</h4>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            <li>No illegal, hateful, or malicious content</li>
                                                            <li>Respect intellectual property and privacy</li>
                                                            <li>No spam or automated abuse</li>
                                                        </ul>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h4 className="font-semibold">Content and Ownership</h4>
                                                        <p className="text-sm">You own your content. By posting, you grant Drapels a limited license to display it on the platform.</p>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h4 className="font-semibold">Disclaimers</h4>
                                                        <p className="text-sm">Tools provide best‑effort guidance and may use third‑party AI APIs. Verify critical outputs independently.</p>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h4 className="font-semibold">Contact</h4>
                                                        <p className="text-sm">Have questions? Visit the Contact page for support options.</p>
                                                    </div>
                                                </section>
                                            </div>
                                        </CardContent>
                                    </>
                                )}
                                {activeTab === "cursors" && !isMobile && (
                                    <>
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="font-light text-gray-900 dark:text-white">Animated Cursors</CardTitle>
                                                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                                                    NEW
                                                </span>
                                            </div>
                                            <CardDescription className="text-gray-600 dark:text-gray-400">Customize your cursor with animated effects (Desktop only)</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="elastic-cursor">Elastic Cursor</Label>
                                                        <p className="text-sm text-muted-foreground">Smooth elastic animation that follows your cursor</p>
                                                    </div>
                                                    <Switch 
                                                        id="elastic-cursor" 
                                                        checked={elasticCursorEnabled}
                                                        onCheckedChange={handleElasticCursorToggle}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="fire-cursor">Fire Cursor</Label>
                                                        <p className="text-sm text-muted-foreground">Trailing fire effect with glowing particles</p>
                                                    </div>
                                                    <Switch
                                                        id="fire-cursor"
                                                        checked={fireCursorEnabled}
                                                        onCheckedChange={handleFireCursorToggle}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <Label htmlFor="spotlight-cursor">Spotlight Cursor</Label>
                                                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                                                                BETA
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">Dimmed overlay with spotlight revealing true colors</p>
                                                    </div>
                                                    <Switch 
                                                        id="spotlight-cursor" 
                                                        checked={isSpotlightEnabled}
                                                        onCheckedChange={handleSpotlightToggle}
                                                    />
                                                </div>
                                                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                                    <p className="text-sm text-muted-foreground">
                                                        <strong>Note:</strong> Only one cursor effect can be active at a time. Animated cursors are disabled on mobile devices for performance.
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
                <Footer />
                <CookieBanner />
                <ScrollToTop />
            </ResponsiveLayoutProvider>
        </div>
    );
}
