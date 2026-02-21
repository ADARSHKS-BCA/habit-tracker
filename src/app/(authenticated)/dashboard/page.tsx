"use client";

import { HabitList } from "@/components/habits/HabitList";
import { CommunityFeed } from "@/components/feed/CommunityFeed";
import { StreakPredictor } from "@/components/analytics/StreakPredictor";

export default function DashboardPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Habits & Analytics */}
            <div className="lg:col-span-2 space-y-8">
                <StreakPredictor />
                <HabitList />
            </div>

            {/* Right Column: Community Feed */}
            <div className="lg:col-span-1">
                <div className="sticky top-8">
                    <CommunityFeed />
                </div>
            </div>
        </div>
    );
}
