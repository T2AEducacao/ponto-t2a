create type public.app_role as enum ('admin', 'employee');
create type public.employee_status as enum ('active', 'inactive');
create type public.clock_event_type as enum ('entry', 'lunch_start', 'lunch_end', 'exit');
create type public.location_status as enum ('inside', 'outside', 'unavailable');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role public.app_role not null default 'employee',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  latitude double precision not null,
  longitude double precision not null,
  radius_meters integer not null check (radius_meters > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  work_site_id uuid references public.work_sites(id) on delete set null,
  full_name text not null,
  position text not null,
  email text not null unique,
  status public.employee_status not null default 'active',
  hire_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clock_records (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  work_site_id uuid references public.work_sites(id) on delete set null,
  recorded_at timestamptz not null default now(),
  event_type public.clock_event_type not null,
  latitude double precision,
  longitude double precision,
  accuracy_meters numeric(10, 2),
  approximate_address text,
  ip_address inet,
  browser text,
  operating_system text,
  device text,
  notes text,
  location_status public.location_status not null default 'unavailable',
  created_at timestamptz not null default now()
);

create unique index clock_records_employee_day_event_idx
  on public.clock_records (employee_id, ((recorded_at at time zone 'America/Sao_Paulo')::date), event_type);

create index employees_user_id_idx on public.employees(user_id);
create index employees_status_idx on public.employees(status);
create index clock_records_employee_recorded_at_idx on public.clock_records(employee_id, recorded_at desc);
create index clock_records_user_recorded_at_idx on public.clock_records(user_id, recorded_at desc);
create index clock_records_location_status_idx on public.clock_records(location_status);

alter table public.profiles enable row level security;
alter table public.work_sites enable row level security;
alter table public.employees enable row level security;
alter table public.clock_records enable row level security;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.work_sites to authenticated;
grant select, insert, update, delete on table public.employees to authenticated;
grant select, insert on table public.clock_records to authenticated;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Admins can manage work sites"
  on public.work_sites for all
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Authenticated users can read active work sites"
  on public.work_sites for select
  to authenticated
  using (active = true);

create policy "Admins can manage employees"
  on public.employees for all
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Employees can read their own employee record"
  on public.employees for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Admins can read all clock records"
  on public.clock_records for select
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Employees can read their own clock records"
  on public.clock_records for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Employees can insert their own clock records"
  on public.clock_records for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
