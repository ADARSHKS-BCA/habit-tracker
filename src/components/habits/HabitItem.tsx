import { useHabits } from "@/hooks/use-habits";
import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Check, Loader2, Edit2, Flame, Trophy, Save, X, Tag } from "lucide-react";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { calculateHabitStats } from "@/utils/stats";
import { ConfirmModal } from "../ui/confirm-modal";

interface HabitItemProps {
    habit: Habit;
}

export function HabitItem({ habit }: HabitItemProps) {
    const { toggleCheckIn, deleteHabit, updateHabit, checkIns } = useHabits();

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(habit.name);
    const [editCategory, setEditCategory] = useState(habit.category || "");

    // Get today's date in YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];
    const isChecked = checkIns.some(c => c.habit_id === habit.id && c.date === today);

    // Stats
    const { currentStreak, totalCompletions } = calculateHabitStats(habit.id, checkIns);

    const handleCheckIn = () => {
        toggleCheckIn.mutate({ id: habit.id, date: today });
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this habit?")) {
            deleteHabit.mutate(habit.id);
        }
    };

    const handleSave = () => {
        if (editName.trim()) {
            updateHabit.mutate({
                id: habit.id,
                name: editName.trim(),
                category: editCategory.trim() || undefined
            }, {
                onSuccess: () => setIsEditing(false)
            });
        }
    };

    return (
        <div className="bg-card rounded-lg border border-border shadow-sm group hover:border-primary/50 transition-all">
            <div className="p-4 flex items-center justify-between">
                {/* Left Section: Check + Info */}
                <div className="flex items-center gap-3 flex-1">
                    <button
                        onClick={handleCheckIn}
                        disabled={toggleCheckIn.isPending}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 shrink-0",
                            isChecked
                                ? "bg-green-500 border-green-500 text-white hover:bg-green-600 scale-110"
                                : "border-muted-foreground hover:border-primary text-transparent hover:text-primary/20",
                            toggleCheckIn.isPending && "opacity-50 cursor-wait"
                        )}
                    >
                        {toggleCheckIn.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Check className="w-5 h-5" strokeWidth={3} />
                        )}
                    </button>

                    {isEditing ? (
                        <div className="flex-1 flex gap-2 animate-in fade-in slide-in-from-left-2">
                            <div className="flex-1 space-y-2">
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Habit name"
                                    className="h-8"
                                    autoFocus
                                />
                                <div className="flex items-center gap-2">
                                    <Tag className="w-3 h-3 text-muted-foreground" />
                                    <Input
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                        placeholder="Category (e.g. Health)"
                                        className="h-6 text-xs w-32"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={handleSave}>
                                    <Save className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setIsEditing(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className={cn("font-medium transition-all", isChecked && "text-muted-foreground line-through decoration-muted-foreground")}>
                                    {habit.name}
                                </h3>
                                {habit.category && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground uppercase tracking-wide">
                                        {habit.category}
                                    </span>
                                )}
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 mt-1">
                                {/* Streak */}
                                <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Current Streak">
                                    <Flame className={cn("w-3 h-3", currentStreak > 0 ? "text-orange-500 fill-orange-500" : "text-muted")} />
                                    <span className={cn(currentStreak > 0 && "text-orange-500 font-medium")}>
                                        {currentStreak} day{currentStreak !== 1 && 's'}
                                    </span>
                                </div>
                                {/* Total */}
                                <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Total Completions">
                                    <Trophy className="w-3 h-3 text-yellow-500" />
                                    <span>{totalCompletions}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Section: Actions */}
                {!isEditing && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(true)}
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            disabled={deleteHabit.isPending}
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            {deleteHabit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
