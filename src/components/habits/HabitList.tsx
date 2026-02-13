"use client";

import { useHabits } from "@/hooks/use-habits";
import { HabitItem } from "./HabitItem";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";

export function HabitList() {
    const { habits, createHabit, isLoading, isError } = useHabits();
    const [newHabitName, setNewHabitName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHabitName.trim()) {
            createHabit.mutate(newHabitName.trim(), {
                onSuccess: () => setNewHabitName(""),
            });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
                    <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-card border border-border rounded-lg animate-pulse" />)}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 text-center text-destructive bg-destructive/10 rounded-xl border border-destructive/20">
                <p>Failed to load habits. Please try again.</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Reload</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">My Habits</h2>
                <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                    {habits.length} Active
                </span>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    placeholder="Add a new habit..."
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="flex-1"
                    disabled={createHabit.isPending}
                />
                <Button type="submit" disabled={!newHabitName.trim() || createHabit.isPending}>
                    {createHabit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Add
                </Button>
            </form>

            <div className="space-y-3">
                {habits.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-muted rounded-xl bg-card/50">
                        <h3 className="text-lg font-medium text-foreground">No habits yet</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Start by adding a habit you want to track!
                        </p>
                    </div>
                ) : (
                    habits.map((habit) => <HabitItem key={habit.id} habit={habit} />)
                )}
            </div>
        </div>
    );
}
