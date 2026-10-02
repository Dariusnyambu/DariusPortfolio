-- Run in Supabase SQL editor. Then sign up, and: update profiles set role='admin' where id='<your-auth-uid>';
create extension if not exists pgcrypto;
create table profiles(id uuid primary key references auth.users on delete cascade, role text not null default 'user', full_name text, created_at timestamptz default now());
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into profiles(id) values(new.id); return new; end $$;
create trigger on_auth_user after insert on auth.users for each row execute function handle_new_user();
create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from profiles where id=auth.uid() and role='admin') $$;
-- Categories + subcategories in ONE self-referencing table: add any discipline without code changes
create table categories(id uuid primary key default gen_random_uuid(), parent_id uuid references categories on delete cascade, name text not null, slug text not null, description text, image_url text, position int default 0, hidden boolean default false, created_at timestamptz default now(), unique(parent_id,slug));
create table projects(id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null, short_description text, description text, category_id uuid references categories on delete set null, subcategory_id uuid references categories on delete set null, client text, project_date date, location text, services text[] default '{}', tools text[] default '{}', status text default 'completed', featured boolean default false, published boolean default false, cover_url text, cover_alt text, video_url text, seo_title text, seo_description text, seo_image text, created_at timestamptz default now(), updated_at timestamptz default now());
create table project_media(id uuid primary key default gen_random_uuid(), project_id uuid not null references projects on delete cascade, url text not null, kind text default 'image', file_name text, file_size bigint, alt text, caption text, position int default 0, created_at timestamptz default now());
-- Flexible case study: any number of admin-chosen sections (free title, rich HTML body, toggle per section)
create table project_case_study_sections(id uuid primary key default gen_random_uuid(), project_id uuid not null references projects on delete cascade, title text not null, body text, position int default 0, enabled boolean default true);
create table blog_categories(id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null);
create table blog_tags(id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null);
create table blog_posts(id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null, excerpt text, content text, featured_image text, featured_alt text, category_id uuid references blog_categories on delete set null, author_name text default 'Darius Nyambu', status text default 'draft', publish_at timestamptz, featured boolean default false, seo_title text, seo_description text, seo_keywords text, canonical_url text, og_title text, og_description text, og_image text, created_at timestamptz default now(), updated_at timestamptz default now());
create table blog_post_tags(post_id uuid references blog_posts on delete cascade, tag_id uuid references blog_tags on delete cascade, primary key(post_id,tag_id));
create table services(id uuid primary key default gen_random_uuid(), title text not null, icon text, short_description text, details text, category_id uuid references categories on delete set null, position int default 0, hidden boolean default false);
create table contact_messages(id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text, project_type text, budget text, message text not null, status text default 'new' check(status in('new','read','contacted','closed')), created_at timestamptz default now());
create table site_settings(key text primary key, value jsonb, updated_at timestamptz default now());
create index on projects(published,featured); create index on projects(category_id); create index on projects(subcategory_id);
create index on project_media(project_id,position); create index on project_case_study_sections(project_id,position);
create index on blog_posts(status,publish_at); create index on contact_messages(status,created_at);
create function touch() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create trigger t1 before update on projects for each row execute function touch();
create trigger t2 before update on blog_posts for each row execute function touch();
-- RLS: public reads published content only; admin does everything; public may only INSERT contact messages
do $$ declare t text; begin
 foreach t in array array['profiles','categories','projects','project_media','project_case_study_sections','blog_categories','blog_tags','blog_posts','blog_post_tags','services','contact_messages','site_settings'] loop
  execute format('alter table %I enable row level security',t);
  if t<>'profiles' then execute format('create policy "admin all" on %I for all to authenticated using(is_admin()) with check(is_admin())',t); end if;
 end loop; end $$;
create policy "own profile" on profiles for select to authenticated using(id=auth.uid() or is_admin());
create policy "read cats" on categories for select using(not hidden);
create policy "read projects" on projects for select using(published);
create policy "read media" on project_media for select using(exists(select 1 from projects p where p.id=project_id and p.published));
create policy "read sections" on project_case_study_sections for select using(enabled and exists(select 1 from projects p where p.id=project_id and p.published));
create policy "read blogcats" on blog_categories for select using(true);
create policy "read tags" on blog_tags for select using(true);
create policy "read posts" on blog_posts for select using(status='published' and (publish_at is null or publish_at<=now()));
create policy "read posttags" on blog_post_tags for select using(exists(select 1 from blog_posts b where b.id=post_id and b.status='published'));
create policy "read services" on services for select using(not hidden);
create policy "read settings" on site_settings for select using(true);
create policy "send message" on contact_messages for insert to anon,authenticated with check(status='new' and length(message)<5000);
insert into storage.buckets(id,name,public) values('media','media',true) on conflict do nothing;
create policy "media read" on storage.objects for select using(bucket_id='media');
create policy "media admin write" on storage.objects for all to authenticated using(bucket_id='media' and is_admin()) with check(bucket_id='media' and is_admin());
