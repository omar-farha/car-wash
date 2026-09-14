-- ============================================================================
-- Car Wash Management System — Initial Schema
-- Single branch. Roles: owner, employee. Customers are not authenticated.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------

create type public.user_role as enum ('owner', 'employee');

create type public.vehicle_type as enum ('car', 'motorcycle');

create type public.booking_status as enum (
  'pending',    -- قيد الانتظار
  'arrived',    -- تم الوصول
  'in_service', -- جاري الخدمة
  'completed',  -- مكتمل
  'cancelled'   -- ملغي
);

create type public.order_status as enum (
  'waiting',    -- في الانتظار
  'washing',    -- غسيل
  'cleaning',   -- تنظيف
  'ready',      -- جاهز
  'completed',  -- مكتمل
  'cancelled'   -- ملغي
);

create type public.expense_category as enum (
  'supplies',   -- مستلزمات
  'salaries',   -- رواتب
  'utilities',  -- مرافق
  'maintenance',-- صيانة
  'rent',       -- إيجار
  'other'       -- أخرى
);

create type public.notification_type as enum (
  'booking_confirmation',
  'booking_reminder',
  'order_ready'
);

create type public.notification_status as enum (
  'pending', 'sent', 'failed', 'skipped'
);

-- ----------------------------------------------------------------------------
-- profiles — one row per auth user (owner / employee)
-- ----------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'employee',
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Owner and employee accounts. Customers are not represented here.';

-- ----------------------------------------------------------------------------
-- customers — minimal data only: name + phone
-- ----------------------------------------------------------------------------

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  phone text not null unique,
  created_at timestamptz not null default now()
);

create index customers_phone_idx on public.customers (phone);

-- ----------------------------------------------------------------------------
-- services — priced per vehicle type, owner-editable
-- ----------------------------------------------------------------------------

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  description text,
  car_price numeric(10, 2) not null check (car_price >= 0),
  motorcycle_price numeric(10, 2) not null check (motorcycle_price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- settings — single row of business configuration
-- ----------------------------------------------------------------------------

create table public.settings (
  id smallint primary key default 1 check (id = 1),
  business_name text not null default 'مغسلة السيارات',
  whatsapp_number text,
  phone text,
  address text,
  currency text not null default 'EGP',
  invoice_footer_text text,
  updated_at timestamptz not null default now()
);

insert into public.settings (id, business_name) values (1, 'مغسلة السيارات');

-- ----------------------------------------------------------------------------
-- bookings — online appointments, no account required
-- ----------------------------------------------------------------------------

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete restrict,
  service_id uuid not null references public.services (id) on delete restrict,
  vehicle_type public.vehicle_type not null,
  booking_date date not null,
  booking_time time not null,
  status public.booking_status not null default 'pending',
  order_id uuid, -- set once converted to an order (FK added after orders table exists)
  created_at timestamptz not null default now(),
  check (booking_date >= current_date - interval '1 day')
);

-- Prevent double-booking the same slot (single branch = one bay at a time).
-- Cancelled bookings free up the slot.
create unique index bookings_slot_unique_idx
  on public.bookings (booking_date, booking_time)
  where status <> 'cancelled';

create index bookings_date_idx on public.bookings (booking_date);
create index bookings_customer_idx on public.bookings (customer_id);
create index bookings_status_idx on public.bookings (status);

-- ----------------------------------------------------------------------------
-- orders — walk-in or booking-derived, workflow tracked, price snapshot
-- ----------------------------------------------------------------------------

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity,
  customer_id uuid not null references public.customers (id) on delete restrict,
  booking_id uuid references public.bookings (id) on delete set null,
  service_id uuid not null references public.services (id) on delete restrict,
  service_name text not null,       -- snapshot at time of order creation
  vehicle_type public.vehicle_type not null,
  price numeric(10, 2) not null check (price >= 0), -- snapshot, immune to future price changes
  status public.order_status not null default 'waiting',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.bookings
  add constraint bookings_order_id_fkey
  foreign key (order_id) references public.orders (id) on delete set null;

create index orders_status_idx on public.orders (status);
create index orders_customer_idx on public.orders (customer_id);
create index orders_created_at_idx on public.orders (created_at desc);
create unique index orders_order_number_idx on public.orders (order_number);

-- ----------------------------------------------------------------------------
-- invoices — generated automatically when an order completes
-- ----------------------------------------------------------------------------

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number bigint generated always as identity,
  order_id uuid not null unique references public.orders (id) on delete restrict,
  customer_id uuid not null references public.customers (id) on delete restrict,
  service_name text not null,
  vehicle_type public.vehicle_type not null,
  price numeric(10, 2) not null check (price >= 0),
  payment_method text not null default 'cash',
  created_at timestamptz not null default now()
);

create unique index invoices_invoice_number_idx on public.invoices (invoice_number);
create index invoices_customer_idx on public.invoices (customer_id);

-- ----------------------------------------------------------------------------
-- payments — money received against an invoice
-- ----------------------------------------------------------------------------

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete restrict,
  amount numeric(10, 2) not null check (amount >= 0),
  method text not null default 'cash',
  created_at timestamptz not null default now()
);

create index payments_invoice_idx on public.payments (invoice_id);

-- ----------------------------------------------------------------------------
-- expenses — manual, owner-only
-- ----------------------------------------------------------------------------

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null check (char_length(trim(description)) > 0),
  amount numeric(10, 2) not null check (amount > 0),
  category public.expense_category not null default 'other',
  expense_date date not null default current_date,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index expenses_date_idx on public.expenses (expense_date);

-- ----------------------------------------------------------------------------
-- notifications — WhatsApp-ready outbox, safe no-op without credentials
-- ----------------------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  type public.notification_type not null,
  channel text not null default 'whatsapp',
  recipient_phone text not null,
  booking_id uuid references public.bookings (id) on delete set null,
  order_id uuid references public.orders (id) on delete set null,
  status public.notification_status not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index notifications_status_idx on public.notifications (status);

-- ----------------------------------------------------------------------------
-- updated_at triggers
-- ----------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Helper functions for RLS (SECURITY DEFINER to avoid recursive RLS lookups)
-- ----------------------------------------------------------------------------

create function public.current_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create function public.is_active_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true
  );
$$;

create function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner' and is_active = true
  );
$$;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.services enable row level security;
alter table public.settings enable row level security;
alter table public.bookings enable row level security;
alter table public.orders enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.notifications enable row level security;

-- profiles: self can read own row; owner can read/manage all
create policy profiles_select_self on public.profiles
  for select using (id = auth.uid() or public.is_owner());

create policy profiles_insert_owner on public.profiles
  for insert with check (public.is_owner());

create policy profiles_update_owner on public.profiles
  for update using (public.is_owner());

-- customers: any active staff can read/create/update
create policy customers_select_staff on public.customers
  for select using (public.is_active_staff());

create policy customers_insert_staff on public.customers
  for insert with check (public.is_active_staff());

create policy customers_update_staff on public.customers
  for update using (public.is_active_staff());

-- services: anyone can read active services (customer website); staff can
-- also read inactive ones for management. Only owner can write.
create policy services_select_public on public.services
  for select using (is_active = true);

create policy services_select_staff on public.services
  for select using (public.is_active_staff());

create policy services_write_owner on public.services
  for insert with check (public.is_owner());

create policy services_update_owner on public.services
  for update using (public.is_owner());

create policy services_delete_owner on public.services
  for delete using (public.is_owner());

-- settings: publicly readable (business name/contact shown on the public
-- site); only owner can write.
create policy settings_select_public on public.settings
  for select using (true);

create policy settings_update_owner on public.settings
  for update using (public.is_owner());

-- bookings: staff can read/create/update. Public booking creation goes
-- through a server action using the service-role key (bypasses RLS) so no
-- anonymous policy is required here.
create policy bookings_select_staff on public.bookings
  for select using (public.is_active_staff());

create policy bookings_insert_staff on public.bookings
  for insert with check (public.is_active_staff());

create policy bookings_update_staff on public.bookings
  for update using (public.is_active_staff());

-- orders: staff can read/create/update
create policy orders_select_staff on public.orders
  for select using (public.is_active_staff());

create policy orders_insert_staff on public.orders
  for insert with check (public.is_active_staff());

create policy orders_update_staff on public.orders
  for update using (public.is_active_staff());

-- invoices: staff can read and create. Invoice rows are only ever inserted
-- by the completeOrder server action with server-computed values, never
-- directly from client input, so a plain staff insert policy is safe.
create policy invoices_select_staff on public.invoices
  for select using (public.is_active_staff());

create policy invoices_insert_staff on public.invoices
  for insert with check (public.is_active_staff());

-- payments: staff can read and create (see invoices policy comment above)
create policy payments_select_staff on public.payments
  for select using (public.is_active_staff());

create policy payments_insert_staff on public.payments
  for insert with check (public.is_active_staff());

-- expenses: owner only (sensitive finance data)
create policy expenses_select_owner on public.expenses
  for select using (public.is_owner());

create policy expenses_insert_owner on public.expenses
  for insert with check (public.is_owner());

create policy expenses_update_owner on public.expenses
  for update using (public.is_owner());

create policy expenses_delete_owner on public.expenses
  for delete using (public.is_owner());

-- notifications: staff can read (for debugging/visibility)
create policy notifications_select_staff on public.notifications
  for select using (public.is_active_staff());
