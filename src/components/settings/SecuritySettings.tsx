'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

export const SecuritySettings = () => {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPwd, setChangingPwd] = useState(false);
    const [pwdMessage, setPwdMessage] = useState("");

    const handleChangePassword = async () => {
        if (!user) return;
        if (newPassword !== confirmPassword) {
            setPwdMessage("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setPwdMessage("Password should be at least 6 characters.");
            return;
        }

        setChangingPwd(true);
        setPwdMessage("");

        try {
            if (user.providerData.some(provider => provider.providerId === EmailAuthProvider.PROVIDER_ID)) {
                const credential = EmailAuthProvider.credential(user.email!, currentPassword);
                await reauthenticateWithCredential(user, credential);
            }
            await updatePassword(user, newPassword);
            setPwdMessage("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            setPwdMessage("Error: " + error.message);
        } finally {
            setChangingPwd(false);
        }
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="font-light text-gray-900 dark:text-white">Security</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Change your password and manage account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                {pwdMessage && <p className={`text-sm ${pwdMessage.includes("Error") ? "text-destructive" : "text-green-600"}`}>{pwdMessage}</p>}
                <Button onClick={handleChangePassword} disabled={changingPwd}>
                    {changingPwd ? "Changing..." : "Change Password"}
                </Button>
            </CardContent>
        </>
    );
};