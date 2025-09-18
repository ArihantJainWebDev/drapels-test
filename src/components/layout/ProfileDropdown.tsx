"use client"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useLanguage } from "@/context/LanguageContext";
import { User as UserIcon, LogOut } from "lucide-react";

type ProfileDropdownProps = {
  brandMode?: "hero" | "solid";
};

const ProfileDropdown = ({ brandMode = "solid" }: ProfileDropdownProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProfilePic = async () => {
      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            const data = snap.data();
            if (data.profilePic) {
              setProfilePic(data.profilePic);
            }
          }
        } catch (err) {
          console.error("Failed to load profile picture:", err);
        }
      }
    };
    fetchProfilePic();
  }, [user]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const el = dropdownRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick, { passive: true });
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick as any);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const firstName = user?.displayName?.split(" ")[0] || "User";
  const nameColorClass = brandMode === "hero" 
    ? "text-white" 
    : "text-gray-800 dark:text-gray-300";
  const avatarSrc = profilePic || user?.photoURL || "/guest.PNG";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted/40 transition"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <img 
          src={avatarSrc} 
          alt="avatar" 
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/guest.PNG"; }}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <span className={`font-medium text-sm ${nameColorClass} transition-colors duration-300`}>
          {t('profile.greeting')}, {firstName}
        </span>
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg z-50 animate-fade-in">
          <button
            className="cursor-can-hover flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm hover:bg-muted/30 transition rounded-lg"
            onClick={() => { setOpen(false); router.push("/profile"); }}
          >
            <UserIcon className="w-4 h-4" />
            <span className="flex flex-col items-start">
              <span className="font-medium">{t('profile.profile')}</span>
              <span className="text-[11px] text-muted-foreground">View your profile</span>
            </span>
          </button>
          <button
            className="cursor-can-hover flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm hover:bg-muted/30 transition rounded-lg text-destructive"
          >
            <LogOut className="w-4 h-4" />
            <span className="flex flex-col items-start">
              <span className="font-medium">Logout</span>
              <span className="text-[11px] text-muted-foreground">Sign out of your account</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
