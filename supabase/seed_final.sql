-- ============================================================
-- MULTIBIZ · Seed de datos demo para Supabase (CORREGIDO)
-- ============================================================
-- Nota: este script no usa UUIDs inventados. Los IDs nuevos
-- los genera PostgreSQL con gen_random_uuid().

create extension if not exists "pgcrypto";

-- ============================================================
-- 1) NEGOCIOS
-- ============================================================
insert into businesses (id, name, slug, address, phone, currency, color, plan)
values
  ('00000000-0000-0000-0000-000000000001', 'Urbano Moda & Calzado', 'urbano', 'Av. Larco 1240, Miraflores, Lima', '+51 987 654 321', 'PEN', '#10B981', 'pro'),
  ('00000000-0000-0000-0000-000000000002', 'Café Andino', 'cafe-andino', 'Jr. de la Unión 456, Cercado de Lima', '+51 912 345 678', 'PEN', '#D97706', 'basic')
on conflict (id) do nothing;

-- ============================================================
-- 2) USUARIOS (UUIDs reales de auth.users)
-- ============================================================
insert into app_users (id, name, role)
select id, 'Sofía Reyes', 'owner'
from auth.users
where email = 'admin@multibiz.pe'
on conflict (id) do nothing;

insert into app_users (id, name, role)
select id, 'María Ríos', 'owner'
from auth.users
where email = 'maria@urbano.pe'
on conflict (id) do nothing;

insert into app_users (id, name, role)
select id, 'Carlos Vargas', 'owner'
from auth.users
where email = 'carlos@cafe.pe'
on conflict (id) do nothing;

-- ============================================================
-- 3) BUSINESS_MEMBERS
-- ============================================================
insert into business_members (user_id, business_id, role)
select u.id, b.id, 'owner'
from auth.users u
join businesses b
  on b.id = '00000000-0000-0000-0000-000000000001'
where u.email = 'admin@multibiz.pe'
on conflict do nothing;

insert into business_members (user_id, business_id, role)
select u.id, b.id, 'owner'
from auth.users u
join businesses b
  on b.id = '00000000-0000-0000-0000-000000000002'
where u.email = 'admin@multibiz.pe'
on conflict do nothing;

insert into business_members (user_id, business_id, role)
select u.id, b.id, 'owner'
from auth.users u
join businesses b
  on b.id = '00000000-0000-0000-0000-000000000001'
where u.email = 'maria@urbano.pe'
on conflict do nothing;

insert into business_members (user_id, business_id, role)
select u.id, b.id, 'owner'
from auth.users u
join businesses b
  on b.id = '00000000-0000-0000-0000-000000000002'
where u.email = 'carlos@cafe.pe'
on conflict do nothing;

-- ============================================================
-- 4) PRODUCTOS
-- ============================================================
insert into products (id, business_id, name, sku, category, price, cost, stock, min_stock, color)
values
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Cartera Crossbody Mini', 'CAR-014', 'Accesorios', 189, 95, 3, 5, '#F59E0B'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Zapatillas Urban Low', 'ZAP-088', 'Calzado', 249, 130, 4, 5, '#EF4444'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Polo Oversize Negro', 'POL-102', 'Ropa', 89, 42, 18, 5, '#0F172A'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Jeans Mom Fit', 'JEA-045', 'Ropa', 159, 78, 12, 5, '#3B82F6'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Canguro Beige', 'CAN-019', 'Ropa', 199, 98, 8, 5, '#A16207'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Gafas Retro', 'GAF-007', 'Accesorios', 129, 55, 22, 5, '#7C3AED'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Café de especialidad 250g', 'CAF-250', 'Café', 42, 18, 40, 10, '#78350F'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Prensa francesa', 'PRE-001', 'Equipos', 120, 68, 6, 3, '#0EA5E9'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Taza cerámica artesanal', 'TAZ-005', 'Merch', 55, 22, 2, 5, '#DC2626')
on conflict do nothing;

-- ============================================================
-- 5) CLIENTES
-- ============================================================
insert into customers (id, business_id, name, phone, email)
values
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'María González', '+51 987 654 321', 'maria.g@mail.com'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Carlos Ruiz', '+51 912 345 678', 'carlos.r@mail.com'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Ana Torres', '+51 998 112 233', 'ana.t@mail.com'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Luis Mendoza', '+51 945 667 889', 'luis.m@mail.com'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Rosa Quispe', '+51 933 221 100', 'rosa.q@mail.com'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Pedro Salas', '+51 977 334 220', 'pedro.s@mail.com')
on conflict do nothing;

-- ============================================================
-- 6) VENTAS
-- ============================================================
insert into sales (id, business_id, order_id, customer_id, customer_name, channel, items, total, status, created_at)
select
  gen_random_uuid(),
  c.business_id,
  'ORD-001',
  c.id,
  c.name,
  'wa',
  jsonb_build_array(jsonb_build_object('productId', p.id, 'name', 'Cartera Crossbody Mini', 'qty', 1, 'price', 189)),
  189,
  'ok',
  now() - interval '1 day'
from customers c
join products p on p.sku = 'CAR-014'
where c.email = 'maria.g@mail.com'
on conflict do nothing;

insert into sales (id, business_id, order_id, customer_id, customer_name, channel, items, total, status, created_at)
select
  gen_random_uuid(),
  c.business_id,
  'ORD-002',
  c.id,
  c.name,
  'pos',
  jsonb_build_array(jsonb_build_object('productId', p.id, 'name', 'Polo Oversize Negro', 'qty', 2, 'price', 89)),
  178,
  'ok',
  now() - interval '2 days'
from customers c
join products p on p.sku = 'POL-102'
where c.email = 'carlos.r@mail.com'
on conflict do nothing;

insert into sales (id, business_id, order_id, customer_id, customer_name, channel, items, total, status, created_at)
select
  gen_random_uuid(),
  c.business_id,
  'ORD-003',
  c.id,
  c.name,
  'web',
  jsonb_build_array(jsonb_build_object('productId', p.id, 'name', 'Café de especialidad 250g', 'qty', 3, 'price', 42)),
  126,
  'ok',
  now() - interval '3 days'
from customers c
join products p on p.sku = 'CAF-250'
where c.email = 'rosa.q@mail.com'
on conflict do nothing;

-- ============================================================
-- 7) ITEMS DE VENTA
-- ============================================================
insert into sale_items (id, sale_id, product_id, name, quantity, price)
select
  gen_random_uuid(),
  s.id,
  p.id,
  'Cartera Crossbody Mini',
  1,
  189
from sales s
join products p on p.sku = 'CAR-014'
where s.order_id = 'ORD-001'
on conflict do nothing;

insert into sale_items (id, sale_id, product_id, name, quantity, price)
select
  gen_random_uuid(),
  s.id,
  p.id,
  'Polo Oversize Negro',
  2,
  89
from sales s
join products p on p.sku = 'POL-102'
where s.order_id = 'ORD-002'
on conflict do nothing;

insert into sale_items (id, sale_id, product_id, name, quantity, price)
select
  gen_random_uuid(),
  s.id,
  p.id,
  'Café de especialidad 250g',
  3,
  42
from sales s
join products p on p.sku = 'CAF-250'
where s.order_id = 'ORD-003'
on conflict do nothing;
