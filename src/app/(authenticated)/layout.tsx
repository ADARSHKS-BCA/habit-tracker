"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

import { ProfileDropdown } from "@/components/ui/profile-dropdown";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex bg-background items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-border bg-card sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => router.push("/dashboard")}
                    >
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Social Habit Tracker
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <ProfileDropdown />
                    </div>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
