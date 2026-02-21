-- Fix RLS Policies to allow Community Feed to see Habit names

-- Drop the restrictive policy
drop policy if exists "Users can view their own habits" on habits;

-- Create a new policy allowing public read access (required for Feed)
create policy "Habits are publicly viewable"
on habits for select
using (true);

-- Ensure Checkins are also public (already should be, but just in case)
drop policy if exists "Checkins are viewable by everyone (for Feed)" on checkins;
create policy "Checkins are viewable by everyone"
on checkins for select
using (true);
