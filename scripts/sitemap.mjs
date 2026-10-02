import fs from 'fs'
const env={...process.env}
try{for(const l of fs.readFileSync('.env','utf8').split('\n')){const m=l.match(/^\s*(\w+)\s*=\s*(.*?)\s*$/);if(m&&!(m[1] in env))env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch{}
const base=(env.SITE_URL||'https://dariusnyambu.co.ke').replace(/\/$/,''),url=env.VITE_SUPABASE_URL,key=env.VITE_SUPABASE_ANON_KEY
const get=async p=>{if(!url||!key)return[];try{const r=await fetch(`${url}/rest/v1/${p}`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});return r.ok?await r.json():[]}catch{return[]}}
const [pr,po,ca]=await Promise.all([get('projects?select=slug,updated_at&published=eq.true'),get('blog_posts?select=slug,updated_at&status=eq.published'),get('categories?select=slug&parent_id=is.null&hidden=eq.false')])
const u=(p,d)=>`<url><loc>${base}${p}</loc>${d?`<lastmod>${d.slice(0,10)}</lastmod>`:''}</url>`
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...['/','/work','/about','/services','/blog','/contact'].map(p=>u(p)),...ca.map(c=>u('/work/'+c.slug)),...pr.map(x=>u('/project/'+x.slug,x.updated_at)),...po.map(x=>u('/blog/'+x.slug,x.updated_at))].join('\n')}\n</urlset>\n`
fs.writeFileSync('public/sitemap.xml',xml);console.log('sitemap:',pr.length,'projects,',po.length,'posts')
