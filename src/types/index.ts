export interface Habit {
    id: string;
    user_id: string;
    name: string;
    category?: string;
    created_at: string;
}

export interface CheckIn {
    id: string;
    habit_id: string;
    user_id: string;
    date: string; // YYYY-MM-DD
    created_at?: string;
}
