import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();

    // Fetch recent checkins with related data
    // We need to join profiles and habits
    // Supabase syntax: select('*, profiles(username), habits(name)')

    const { data: events, error } = await supabase
        .from("checkins")
        .select(`
        id,
        created_at,
        profiles (username),
        habits (name)
    `)
        .order("created_at", { ascending: false })
        .limit(50);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedEvents = events.map((e: any) => ({
        id: e.id,
        userId: e.user_id,
        userName: e.profiles?.username || "Unknown User",
        habitName: e.habits?.name || "Unknown Habit",
        timestamp: e.created_at,
    }));

    return NextResponse.json(formattedEvents);
}
