-- Run after schema.sql. Adds live links, pricing/packages, and a service field on bookings.
alter table projects add column if not exists live_url text;
alter table contact_messages add column if not exists service text;
create table if not exists pricing_packages(id uuid primary key default gen_random_uuid(), name text not null, kind text not null default 'service' check(kind in('service','package')), price_prefix text, price_amount numeric, billing text, description text, features text[] default '{}', bookable boolean default true, featured boolean default false, hidden boolean default false, position int default 0, created_at timestamptz default now());
alter table pricing_packages enable row level security;
create policy "read pricing" on pricing_packages for select using(not hidden);
create policy "admin all" on pricing_packages for all to authenticated using(is_admin()) with check(is_admin());
create index if not exists pricing_pos on pricing_packages(position);
-- Starting prices (edit or delete any of these in Admin > Pricing). Monthly packages: add yours in the admin.
insert into pricing_packages(name,kind,price_prefix,price_amount,billing,description,features,position)
select * from (values
('Logo design','service',null::text,3000,'one-time','A custom logo for your brand.',array[]::text[],1),
('Full brand identity','service',null::text,7000,'one-time','Logo plus a complete visual identity.',array[]::text[],2),
('Ads & animation','service',null::text,2000,'per art','Creative ads and motion pieces, priced per art.',array[]::text[],3),
('Business website','service','From',20000,'one-time','A modern, responsive website.',array[]::text[],4),
('E-commerce website','service',null::text,40000,'one-time','Online store with admin dashboard and inventory.',array['Admin dashboard','Inventory management'],5)
) as v(name,kind,price_prefix,price_amount,billing,description,features,position)
where not exists(select 1 from pricing_packages);
