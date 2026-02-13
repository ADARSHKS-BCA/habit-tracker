import { api } from "@/lib/api";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export interface FeedEvent {
    id: string;
    userId: string;
    userName: string;
    habitName: string;
    timestamp: string;
}

export function useFeed() {
    const [feed, setFeed] = useState<FeedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const supabase = createClient();

    // 1. Initial Fetch Effect
    useEffect(() => {
        let mounted = true;

        async function fetchFeed() {
            try {
                const { data } = await api.get<FeedEvent[]>("/feed");
                if (mounted) {
                    setFeed(data);
                    setIsLoading(false);
                }
            } catch (error) {
                if (mounted) {
                    console.error("Failed to fetch feed:", error);
                    setIsError(true);
                    setIsLoading(false);
                }
            }
        }

        fetchFeed();

        return () => {
            mounted = false;
        };
    }, []);

    // 2. Realtime Subscription Effect
    useEffect(() => {
        const channel = supabase
            .channel("feed-updates")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "checkins",
                },
                async (payload) => {
                    const newRecord = payload.new as { id: string };

                    // Fetch details
                    const { data, error } = await supabase
                        .from("checkins")
                        .select(`
                            id,
                            created_at,
                            user_id,
                            profiles (username),
                            habits (name)
                        `)
                        .eq("id", newRecord.id)
                        .single();

                    if (!error && data) {
                        const newEvent: FeedEvent = {
                            id: data.id,
                            userId: data.user_id,
                            userName: (data.profiles as any)?.username || "Unknown User",
                            habitName: (data.habits as any)?.name || "Unknown Habit",
                            timestamp: data.created_at,
                        };

                        setFeed((prev) => {
                            // Deduplicate
                            if (prev.some((e) => e.id === newEvent.id)) {
                                return prev;
                            }
                            return [newEvent, ...prev];
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return {
        data: feed,
        isLoading,
        isError,
    };
}
