"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Calendar, Trophy, CheckCircle, Edit2, Save, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileData {
    username: string;
    full_name: string | null;
    bio: string | null;
    created_at: string;
}

interface StatsData {
    totalHabits: number;
    totalCheckins: number;
}

export default function ProfilePage() {
    const { user } = useAuth();
    const supabase = createClient();
    const router = useRouter();

    // State
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [stats, setStats] = useState<StatsData>({ totalHabits: 0, totalCheckins: 0 });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        full_name: "",
        bio: "",
    });

    // Fetch Data
    useEffect(() => {
        if (!user) return;

        async function loadProfile() {
            try {
                // 1. Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user!.id)
                    .single();

                if (profileError) throw profileError;

                // 2. Fetch Stats
                // a. Total Habits
                const { count: habitsCount, error: habitsError } = await supabase
                    .from("habits")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", user!.id);

                if (habitsError) throw habitsError;

                // b. Total Checkins
                const { count: checkinsCount, error: checkinsError } = await supabase
                    .from("checkins")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", user!.id);

                if (checkinsError) throw checkinsError;

                // Set Data
                setProfile(profileData);
                setStats({
                    totalHabits: habitsCount || 0,
                    totalCheckins: checkinsCount || 0,
                });

                // Init Form
                setFormData({
                    full_name: profileData.full_name || "",
                    bio: profileData.bio || "",
                });

            } catch (error: any) {
                console.error("Error loading profile:", error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [user, supabase]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: formData.full_name,
                    bio: formData.bio,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (error) throw error;

            setProfile(prev => prev ? { ...prev, ...formData } : null);
            setIsEditing(false);
            toast.success("Profile updated");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <Button
                variant="ghost"
                size="sm"
                className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/dashboard")}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Button>

            {/* Header / Main Card */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 border-b border-border">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{profile.username}</h1>
                                <p className="text-muted-foreground flex items-center gap-1 text-sm">
                                    <Calendar className="w-3 h-3" />
                                    Joined {new Date(profile.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {!isEditing && (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* View Mode */}
                    {!isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Full Name</h3>
                                <p className="text-lg">{profile.full_name || "Not set"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Bio</h3>
                                <p className="text-base whitespace-pre-wrap">
                                    {profile.bio || "No bio yet."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        // Edit Mode
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    value={formData.full_name}
                                    onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bio</label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                    value={formData.bio}
                                    onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm font-medium">Total Habits</p>
                        <p className="text-2xl font-bold">{stats.totalHabits}</p>
                    </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm font-medium">Check-ins</p>
                        <p className="text-2xl font-bold">{stats.totalCheckins}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
