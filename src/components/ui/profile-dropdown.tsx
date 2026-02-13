"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProfileDropdown() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigation = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                className="flex items-center gap-2 pl-2 pr-4 h-10 hover:bg-secondary/50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                    <User className="w-3 h-3" />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-sm font-medium leading-none">{displayName}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card shadow-lg animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="p-2 space-y-1">
                        <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium border-b border-border/50 mb-1">
                            My Account
                        </div>
                        <button
                            onClick={() => handleNavigation("/profile")}
                            className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-secondary transition-colors text-left"
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
