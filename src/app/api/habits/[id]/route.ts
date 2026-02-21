import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // Redundant if RLS checks, but good practice

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { date, name, category } = await request.json();

    // 1. Handle Habit metadata update (Rename / Category)
    if (name !== undefined || category !== undefined) {
        const updates: any = {};
        if (name !== undefined) updates.name = name;
        if (category !== undefined) updates.category = category;

        const { data, error } = await supabase
            .from("habits")
            .update(updates)
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ action: "updated", habit: data });
    }

    // 2. Handle Check-in Toggle (if date is provided)
    if (date) {
        // Check if check-in exists
        const { data: existing } = await supabase
            .from("checkins")
            .select("id")
            .eq("habit_id", id)
            .eq("user_id", user.id)
            .eq("date", date)
            .single();

        if (existing) {
            // Uncheck (Delete)
            const { error } = await supabase
                .from("checkins")
                .delete()
                .eq("id", existing.id);

            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ action: "unchecked" });
        } else {
            // Check (Insert)
            const { data: newCheckIn, error } = await supabase
                .from("checkins")
                .insert({
                    habit_id: id,
                    user_id: user.id,
                    date: date
                })
                .select()
                .single();

            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ action: "checked", checkIn: newCheckIn });
        }
    }

    return NextResponse.json({ error: "No valid action found" }, { status: 400 });
}
