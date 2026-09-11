-- ============================================================
-- MULTIBIZ · Esquema Supabase con Roles Finos
-- Base de datos multi-negocio con RLS por negocio + rol
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLAS PRINCIPALES
-- ============================================================

create table if not exists businesses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique,
  address text,
  phone text,
  currency text not null default 'PEN',
  color text not null default '#10B981',
  plan text not null default 'trial',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists business_members (
  user_id uuid references app_users(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (user_id, business_id)
);

-- ============================================================
-- SISTEMA DE ROLLES Y PERMISOS
-- ============================================================

create table if not exists roles (
  id text primary key,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

insert into roles (id, name, description) values
  ('owner', 'Propietario', 'Acceso completo a todos los módulos y configuración'),
  ('staff', 'Staff', 'Puede registrar ventas, productos y clientes, sin configuración'),
  ('viewer', 'Viewer', 'Solo lectura en todos los módulos');

create table if not exists permissions (
  id text primary key,
  module text not null,
  action text not null,
  description text
);

insert into permissions (id, module, action, description) values
  ('dashboard:read', 'dashboard', 'read', 'Ver dashboard'),
  ('sales:read', 'sales', 'read', 'Ver ventas'),
  ('sales:write', 'sales', 'write', 'Crear/actualizar ventas'),
  ('products:read', 'products', 'read', 'Ver productos'),
  ('products:write', 'products', 'write', 'Crear/actualizar productos'),
  ('inventory:read', 'inventory', 'read', 'Ver inventario'),
  ('inventory:write', 'inventory', 'write', 'Ajustar stock'),
  ('customers:read', 'customers', 'read', 'Ver clientes'),
  ('customers:write', 'customers', 'write', 'Crear/actualizar clientes'),
  ('reports:read', 'reports', 'read', 'Ver reportes'),
  ('settings:read', 'settings', 'read', 'Ver configuración'),
  ('settings:write', 'settings', 'write', 'Modificar configuración');

create table if not exists role_permissions (
  role_id text references roles(id) on delete cascade,
  permission_id text references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

-- owner: todos los permisos
insert into role_permissions (role_id, permission_id)
  select 'owner', id from permissions;

-- staff: todos excepto settings:write
insert into role_permissions (role_id, permission_id)
  select 'staff', id from permissions where id != 'settings:write';

-- viewer: solo read en todos los módulos
insert into role_permissions (role_id, permission_id)
  select 'viewer', id from permissions where action = 'read';

-- ============================================================
-- INDICES
-- ============================================================

create index if not exists products_business_idx on products(business_id);
create index if not exists customers_business_idx on customers(business_id);
create index if not exists sales_business_idx on sales(business_id);
create index if not exists sales_business_created_idx on sales(business_id, created_at desc);
create index if not exists sale_items_sale_idx on sale_items(sale_id);
create index if not exists business_members_user_idx on business_members(user_id);
create index if not exists business_members_business_idx on business_members(business_id);
create index if not exists role_permissions_role_idx on role_permissions(role_id);

-- ============================================================
-- TRIGGER updated_at
-- ============================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger businesses_updated_at before update on businesses
for each row execute function set_updated_at();

create trigger app_users_updated_at before update on app_users
for each row execute function set_updated_at();

create trigger products_updated_at before update on products
for each row execute function set_updated_at();

create trigger customers_updated_at before update on customers
for each row execute function set_updated_at();

create trigger sales_updated_at before update on sales
for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table businesses enable row level security;
alter table app_users enable row level security;
alter table business_members enable row level security;
alter table products enable row level security;
alter table customers enable row level security;
alter table sales enable row level security;
alter table sale_items enable row level security;
alter table role_permissions enable row level security;

-- Helper: ¿el usuario pertenece al negocio y tiene el rol mínimo?
create or replace function can_access_business(target_business_id uuid, required_permission text default null)
returns boolean
language sql
security definer
stable
as $$
declare
  user_role text;
  has_perm boolean;
begin
  select bm.role into user_role
  from business_members bm
  where bm.business_id = target_business_id and bm.user_id = auth.uid();

  if user_role is null then return false; end if;

  if required_permission is null then return true; end if;

  select exists (
    select 1 from role_permissions rp
    join permissions p on p.id = rp.permission_id
    where rp.role_id = user_role and p.id = required_permission
  ) into has_perm;

  return has_perm;
end;
$$;

-- Policies para businesses
create policy "Usuarios leen negocios propios"
on businesses for select
using (can_access_business(id));

create policy "Usuarios crean negocios propios"
on businesses for insert
with check (
  exists (select 1 from business_members bm where bm.business_id = id and bm.user_id = auth.uid())
);

create policy "Usuarios actualizan negocios propios"
on businesses for update
using (can_access_business(id, 'settings:write'));

-- Policies para business_members
create policy "Usuarios leen miembros propios"
on business_members for select
using (user_id = auth.uid());

create policy "Usuarios insertan miembros propios"
on business_members for insert
with check (user_id = auth.uid());

-- Policies para products
create policy "Productos: lectura por negocio"
on products for select
using (can_access_business(business_id, 'products:read'));

create policy "Productos: escritura por negocio"
on products for insert
with check (can_access_business(business_id, 'products:write'));

create policy "Productos: actualización por negocio"
on products for update
using (can_access_business(business_id, 'products:write'));

create policy "Productos: eliminación por negocio"
on products for delete
using (can_access_business(business_id, 'products:write'));

-- Policies para customers
create policy "Clientes: lectura por negocio"
on customers for select
using (can_access_business(business_id, 'customers:read'));

create policy "Clientes: escritura por negocio"
on customers for insert
with check (can_access_business(business_id, 'customers:write'));

create policy "Clientes: actualización por negocio"
on customers for update
using (can_access_business(business_id, 'customers:write'));

create policy "Clientes: eliminación por negocio"
on customers for delete
using (can_access_business(business_id, 'customers:write'));

-- Policies para sales
create policy "Ventas: lectura por negocio"
on sales for select
using (can_access_business(business_id, 'sales:read'));

create policy "Ventas: escritura por negocio"
on sales for insert
with check (can_access_business(business_id, 'sales:write'));

create policy "Ventas: actualización por negocio"
on sales for update
using (can_access_business(business_id, 'sales:write'));

-- Policies para sale_items
create policy "Items de ventas: lectura"
on sale_items for select
using (
  exists (select 1 from sales s where s.id = sale_items.sale_id and can_access_business(s.business_id, 'sales:read'))
);

create policy "Items de ventas: escritura"
on sale_items for insert
with check (
  exists (select 1 from sales s where s.id = sale_items.sale_id and can_access_business(s.business_id, 'sales:write'))
);

-- Policies para role_permissions (lectura pública para carga de permisos)
create policy "Roles y permisos visibles"
on role_permissions for select
using (true);

create policy "Permisos visibles"
on permissions for select
using (true);

create policy "Roles visibles"
on roles for select
using (true);
