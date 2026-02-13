import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Habit, CheckIn } from "@/types";

interface HabitsResponse {
    habits: Habit[];
    checkIns: CheckIn[];
}

// Keys
const HABIT_KEYS = {
    all: ["habits"] as const,
};

export function useHabits() {
    const queryClient = useQueryClient();

    // Fetch
    const query = useQuery({
        queryKey: HABIT_KEYS.all,
        queryFn: async () => {
            const { data } = await api.get<HabitsResponse>("/habits");
            return data;
        },
    });

    // Create
    const createHabit = useMutation({
        mutationFn: async (name: string) => {
            const { data } = await api.post("/habits", { name });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: HABIT_KEYS.all });
            toast.success("Habit created");
        },
        onError: () => toast.error("Failed to create habit"),
    });

    // Delete
    const deleteHabit = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/habits/${id}`);
        },
        onMutate: async (id) => {
            // Cancel outstanding queries
            await queryClient.cancelQueries({ queryKey: HABIT_KEYS.all });

            // Snapshot previous value
            const previousData = queryClient.getQueryData<HabitsResponse>(HABIT_KEYS.all);

            // Optimastically update
            if (previousData) {
                queryClient.setQueryData<HabitsResponse>(HABIT_KEYS.all, {
                    ...previousData,
                    habits: previousData.habits.filter((h) => h.id !== id),
                });
            }

            return { previousData };
        },
        onError: (err, newTodo, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(HABIT_KEYS.all, context.previousData);
            }
            toast.error("Failed to delete habit");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: HABIT_KEYS.all });
        },
        onSuccess: () => toast.success("Habit deleted"),
    });

    // Toggle Check-in
    const toggleCheckIn = useMutation({
        mutationFn: async ({ id, date }: { id: string; date: string }) => {
            const { data } = await api.patch(`/habits/${id}`, { date });
            return data; // returns { action: 'checked' | 'unchecked', checkIn? }
        },
        onMutate: async ({ id, date }) => {
            await queryClient.cancelQueries({ queryKey: HABIT_KEYS.all });
            const previousData = queryClient.getQueryData<HabitsResponse>(HABIT_KEYS.all);

            if (previousData) {
                const isChecked = previousData.checkIns.some(
                    (c) => c.habit_id === id && c.date === date
                );

                let newCheckIns = [...previousData.checkIns];
                if (isChecked) {
                    newCheckIns = newCheckIns.filter(
                        (c) => !(c.habit_id === id && c.date === date)
                    );
                } else {
                    newCheckIns.push({
                        id: "temp-optimistic",
                        habit_id: id,
                        user_id: "me", // Placeholder
                        date: date,
                    });
                }

                queryClient.setQueryData<HabitsResponse>(HABIT_KEYS.all, {
                    ...previousData,
                    checkIns: newCheckIns,
                });
            }

            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(HABIT_KEYS.all, context.previousData);
            }
            toast.error("Failed to update check-in");
        },
        onSettled: () => {
            // We can stay optimistic or invalidate. 
            // Invalidate ensures true consistency.
            queryClient.invalidateQueries({ queryKey: HABIT_KEYS.all });
        },
    });

    // Update Habit (Name/Category)
    const updateHabit = useMutation({
        mutationFn: async ({ id, name, category }: { id: string; name?: string; category?: string }) => {
            const { data } = await api.patch(`/habits/${id}`, { name, category });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: HABIT_KEYS.all });
            toast.success("Habit updated");
        },
        onError: () => toast.error("Failed to update habit"),
    });

    return {
        habits: query.data?.habits ?? [],
        checkIns: query.data?.checkIns ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        createHabit,
        deleteHabit,
        toggleCheckIn,
        updateHabit,
    };
}
