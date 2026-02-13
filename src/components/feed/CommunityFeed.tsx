import { useFeed } from "@/hooks/use-feed";
import { User, Activity, Filter } from "lucide-react";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

// Helper for relative time
function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return "yesterday";
}

export function CommunityFeed() {
    const { data: events, isLoading, isError } = useFeed();
    const { user } = useAuth();
    const [filter, setFilter] = useState<"all" | "mine">("all");

    const filteredEvents = events?.filter(event => {
        if (filter === "mine") return event.userId === user?.id;
        return true;
    });

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col h-[500px]">
                <div className="p-4 border-b border-border">
                    <div className="h-6 w-32 bg-secondary animate-pulse rounded" />
                </div>
                <div className="p-4 space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 bg-secondary animate-pulse rounded" />
                                <div className="h-3 w-1/4 bg-secondary animate-pulse rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-card rounded-xl border border-border shadow-sm h-[200px] flex items-center justify-center text-destructive">
                <p>Failed to load feed.</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col h-[500px]">
            <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Community Feed
                    {filter === "all" && (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    )}
                </h2>
                <div className="flex bg-secondary/50 p-1 rounded-lg">
                    <button
                        onClick={() => setFilter("all")}
                        className={cn(
                            "px-3 py-1 text-xs font-medium rounded-md transition-all",
                            filter === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("mine")}
                        className={cn(
                            "px-3 py-1 text-xs font-medium rounded-md transition-all",
                            filter === "mine" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Mine
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {!filteredEvents || filteredEvents.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        <p>{filter === "mine" ? "You haven't checked in yet." : "No activity yet..."}</p>
                    </div>
                ) : (
                    filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                event.userId === user?.id ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                            )}>
                                <User className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm">
                                    <span className={cn("font-medium", event.userId === user?.id ? "text-primary" : "text-foreground")}>
                                        {event.userId === user?.id ? "You" : event.userName}
                                    </span>{" "}
                                    completed{" "}
                                    <span className="font-medium text-primary">
                                        {event.habitName}
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {timeAgo(event.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
