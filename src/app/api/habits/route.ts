import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch habits
    const { data: habits, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id) // Strict filtering
        .order("created_at", { ascending: true });

    if (habitsError) {
        return NextResponse.json({ error: habitsError.message }, { status: 500 });
    }

    // Fetch all check-ins for the user (needed for streak calc)
    const { data: checkIns, error: checkInsError } = await supabase
        .from("checkins")
        .select("*")
        .eq("user_id", user.id); // Strict filtering for personal stats

    if (checkInsError) {
        return NextResponse.json({ error: checkInsError.message }, { status: 500 });
    }

    return NextResponse.json({ habits, checkIns });
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name } = await request.json();
        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        const { data: newHabit, error } = await supabase
            .from("habits")
            .insert({
                user_id: user.id,
                name,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(newHabit);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to create habit" },
            { status: 500 }
        );
    }
}
