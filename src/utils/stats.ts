import { CheckIn } from "@/types";

export function calculateHabitStats(habitId: string, checkIns: CheckIn[]) {
    const habitCheckIns = checkIns
        .filter((c) => c.habit_id === habitId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalCompletions = habitCheckIns.length;

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if completed today or yesterday to start counting
    // If not completed today or yesterday, streak is 0
    // Actually, simple logic:
    // Iterate back from today.

    // Normalize dates to strings YYYY-MM-DD for easier comparison
    const dates = new Set(habitCheckIns.map(c => c.date));

    // Check today
    const todayStr = today.toISOString().split('T')[0];
    if (dates.has(todayStr)) {
        currentStreak++;
    } else {
        // If not today, check if yesterday exists, otherwise streak is 0
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        if (!dates.has(yesterdayStr)) {
            return { totalCompletions, currentStreak: 0 };
        }
    }

    // Continue checking backwards
    // If we started with today, we check yesterday.
    // If we started with yesterday (because today wasn't done), we check day before yesterday.

    // Let's do a robust loop
    // Start from today or yesterday depending on latest checkin
    // Actually, simpler:
    // 1. Get today
    // 2. Loop backwards day by day
    // 3. Count if exists
    // 4. Break if doesn't exist AND it's not "today" (since today is optional for streak if yesterday was done)

    let checkDate = new Date(today);
    // If today is NOT checked, we allow the loop to continue ONLY if yesterday IS checked. 
    // If today is NOT checked and yesterday is NOT checked, streak is 0.

    if (!dates.has(todayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = checkDate.toISOString().split('T')[0];
        if (!dates.has(yesterdayStr)) {
            return { totalCompletions, currentStreak: 0 };
        }
        // If yesterday is checked, we start counting from yesterday
        // (currentStreak is already 0, loop will increment it)
    } else {
        // Today is checked, currentStreak is 1 (from manual check above), 
        // but let's reset to 0 and let the loop handle it cleanly
        checkDate = new Date(today);
        currentStreak = 0;
    }

    // Now loop
    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (dates.has(dateStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    return { totalCompletions, currentStreak };
}
