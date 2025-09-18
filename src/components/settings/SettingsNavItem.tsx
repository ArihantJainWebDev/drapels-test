"use client";
import { ChevronRight } from "lucide-react";

interface SettingsNavItemProps {
    icon: React.ElementType;
    title: React.ReactNode;
    description: string;
    onClick: () => void;
    active?: boolean;
}

export const SettingsNavItem = ({ icon: Icon, title, description, onClick, active = false }: SettingsNavItemProps) => (
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