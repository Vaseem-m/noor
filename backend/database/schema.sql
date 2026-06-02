create extension if not exists pgcrypto;

create table if not exists daily_entries (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  mood text not null default 'Not set',
  energy_level integer not null default 0 check (energy_level between 0 and 10),
  mood_note text,
  focus_minutes integer not null default 0 check (focus_minutes >= 0),
  gym_minutes integer not null default 0 check (gym_minutes >= 0),
  social_screen_time numeric(5, 2) not null default 0 check (social_screen_time >= 0),
  productivity_screen_time numeric(5, 2) not null default 0 check (productivity_screen_time >= 0),
  entertainment_screen_time numeric(5, 2) not null default 0 check (entertainment_screen_time >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists prayer_logs (
  id uuid primary key default gen_random_uuid(),
  daily_entry_id uuid not null unique references daily_entries(id) on delete cascade,
  fajr boolean not null default false,
  dhuhr boolean not null default false,
  asr boolean not null default false,
  maghrib boolean not null default false,
  isha boolean not null default false
);

create table if not exists ai_insights (
  id uuid primary key default gen_random_uuid(),
  daily_entry_id uuid references daily_entries(id) on delete set null,
  insight text not null,
  created_at timestamptz not null default now()
);

create table if not exists daily_mirror_entries (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  content text not null,
  ai_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists daily_entries_date_idx on daily_entries(date desc);
create index if not exists ai_insights_daily_entry_created_idx on ai_insights(daily_entry_id, created_at desc);
create index if not exists daily_mirror_entries_date_idx on daily_mirror_entries(date desc);

alter table daily_entries alter column mood set default 'Not set';
alter table daily_entries alter column energy_level set default 0;
alter table daily_entries add column if not exists updated_at timestamptz not null default now();
alter table daily_entries drop constraint if exists daily_entries_energy_level_check;
alter table daily_entries add constraint daily_entries_energy_level_check check (energy_level between 0 and 10);

create table if not exists goals (
  goal_id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null check (char_length(trim(title)) > 0),
  description text,
  deadline date,
  status text not null default 'Active' check (status in ('Active', 'Completed', 'Paused')),
  progress_percentage integer not null default 0 check (progress_percentage between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists goal_tasks (
  task_id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references goals(goal_id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  description text,
  deadline date,
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists task_action_logs (
  log_id uuid primary key default gen_random_uuid(),
  task_id uuid not null references goal_tasks(task_id) on delete cascade,
  notes text not null check (char_length(trim(notes)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists goals_user_created_idx on goals(user_id, created_at desc);
create index if not exists goal_tasks_goal_created_idx on goal_tasks(goal_id, created_at asc);
create index if not exists task_action_logs_task_created_idx on task_action_logs(task_id, created_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists daily_entries_set_updated_at on daily_entries;
create trigger daily_entries_set_updated_at
before update on daily_entries
for each row
execute function set_updated_at();

drop trigger if exists daily_mirror_entries_set_updated_at on daily_mirror_entries;
create trigger daily_mirror_entries_set_updated_at
before update on daily_mirror_entries
for each row
execute function set_updated_at();

drop trigger if exists goals_set_updated_at on goals;
create trigger goals_set_updated_at
before update on goals
for each row
execute function set_updated_at();

drop trigger if exists goal_tasks_set_updated_at on goal_tasks;
create trigger goal_tasks_set_updated_at
before update on goal_tasks
for each row
execute function set_updated_at();

drop trigger if exists task_action_logs_set_updated_at on task_action_logs;
create trigger task_action_logs_set_updated_at
before update on task_action_logs
for each row
execute function set_updated_at();
