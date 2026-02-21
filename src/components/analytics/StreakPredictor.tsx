"use client";

import { useHabits } from "@/hooks/use-habits";
import { cn } from "@/utils/cn";
import { TrendingUp, Loader2 } from "lucide-react";

export function StreakPredictor() {
    const { habits, checkIns, isLoading } = useHabits();

    if (isLoading) {
        return (
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-4 animate-pulse">
                <div className="h-6 w-40 bg-secondary rounded" />
                <div className="h-3 w-full bg-secondary rounded" />
                <div className="flex gap-1 justify-center pt-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="w-2 h-8 bg-secondary rounded-full" />)}
                </div>
            </div>
        )
    }

    // 1. Get user's habit IDs
    const userHabitIds = new Set(habits.map((h) => h.id));

    // 2. Identify the last 7 days (including today)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
    });

    // 3. Count days where at least ONE habit was completed
    let daysCompleted = 0;
    last7Days.forEach((date) => {
        const hasCheckIn = checkIns.some(
            (c) => userHabitIds.has(c.habit_id) && c.date === date
        );
        if (hasCheckIn) daysCompleted++;
    });

    // 4. Calculate score
    const score = habits.length > 0 ? Math.round((daysCompleted / 7) * 100) : 0;

    // 5. Determine color/status
    let colorClass = "bg-red-500";
    let textClass = "text-red-500";
    let message = "Let's get started!";

    if (score > 70) {
        colorClass = "bg-green-500";
        textClass = "text-green-500";
        message = "Excellent momentum!";
    } else if (score > 40) {
        colorClass = "bg-yellow-500";
        textClass = "text-yellow-600";
        message = "You're building consistency.";
    } else if (habits.length > 0) {
        message = "Keep going, every day counts.";
    }

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Streak Predictor
                </h2>
                <span className={cn("text-2xl font-bold", textClass)}>{score}%</span>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tomorrow Success Probability</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className={cn("h-full transition-all duration-500", colorClass)}
                        style={{ width: `${score}%` }}
                    />
                </div>
                <p className="text-sm text-muted-foreground text-right">{message}</p>
            </div>

            <div className="pt-2 flex gap-1 justify-center">
                {last7Days.slice().reverse().map((date) => {
                    const hasCheckIn = checkIns.some(
                        (c) => userHabitIds.has(c.habit_id) && c.date === date
                    );
                    return (
                        <div
                            key={date}
                            className={cn(
                                "w-2 h-8 rounded-full transition-colors",
                                hasCheckIn ? colorClass : "bg-secondary"
                            )}
                            title={date}
                        />
                    )
                })}
            </div>
        </div>
    );
}
