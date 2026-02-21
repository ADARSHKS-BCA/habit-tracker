-- Add new columns to profiles
alter table profiles 
add column if not exists full_name text,
add column if not exists bio text,
add column if not exists updated_at timestamp with time zone;

-- Add category to habits
alter table habits
add column if not exists category text;

-- Update the handle_new_user trigger to populate full_name from metadata if available
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id, 
    split_part(new.email, '@', 1),
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;
