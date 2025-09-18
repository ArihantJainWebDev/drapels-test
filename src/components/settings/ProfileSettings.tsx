"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export const ProfileSettings = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [displayName, setDisplayName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [username, setUsername] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                setDisplayName(user.displayName || "");
                const snap = await getDoc(doc(db, "users", user.uid));
                if (snap.exists()) {
                    const data = snap.data();
                    if (data.profilePic) {
                        setPhotoURL(data.profilePic);
                    }
                    if (data.username) {
                        setUsername(data.username);
                    }
                }
            }
        };
        fetchData();
    }, [user]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            setUploading(true);
            setMessage("");

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;

                await setDoc(doc(db, "users", user.uid), {
                    profilePic: base64String,
                }, { merge: true });

                setPhotoURL(base64String);
                setMessage("Profile photo updated successfully!");

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            };

            reader.readAsDataURL(file);
        } catch (error: any) {
            setMessage("Upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="font-light text-gray-900 dark:text-white">{t('settings.profile')}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{t('settings.profile.description')}</CardDescription>
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
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
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
                                {t('settings.photo.change')}
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
    );
};