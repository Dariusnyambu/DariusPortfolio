import {useEffect,useState} from 'react'
import {supabase,upload} from '../lib/supabase'
import {useQuery} from '../lib/useData'
import {Link} from 'react-router-dom'
import {inp,Field,gold} from './ui'
export function Overview(){
  const q=useQuery(async s=>{const c=(t,fn)=>{let r=s.from(t).select('id',{count:'exact',head:true});return(fn?fn(r):r).then(x=>x.count??0)}
    const [a,b,d,e,g,h]=await Promise.all([c('projects'),c('projects',r=>r.eq('published',true)),c('blog_posts'),c('blog_posts',r=>r.eq('status','published')),c('categories',r=>r.is('parent_id',null)),c('contact_messages',r=>r.eq('status','new'))])
    return{data:{Projects:a,'Published projects':b,'Draft projects':a-b,'Blog posts':d,'Published posts':e,Categories:g,'New messages':h}}})
  const rp=useQuery(s=>s.from('projects').select('id,title').order('created_at',{ascending:false}).limit(5)),rb=useQuery(s=>s.from('blog_posts').select('id,title').order('created_at',{ascending:false}).limit(5))
  return<div><h1 className="text-3xl mb-6">Overview</h1>{q.error&&<p role="alert">{q.error}</p>}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Object.entries(q.data||{}).map(([k,v])=><div key={k} className="border border-bone/20 p-4"><p className="text-4xl font-display font-extrabold">{v}</p><p className="text-sm opacity-70">{k}</p></div>)}</div>
    <div className="grid md:grid-cols-2 gap-8 mt-10"><div><h2 className="text-xl mb-2">Recent projects</h2>{rp.data?.map(p=><Link key={p.id} className="block hover:text-gold" to={`/admin/projects/${p.id}`}>{p.title}</Link>)}</div>
      <div><h2 className="text-xl mb-2">Recent posts</h2>{rb.data?.map(p=><Link key={p.id} className="block hover:text-gold" to={`/admin/blog/${p.id}`}>{p.title}</Link>)}</div></div></div>}
const sEmpty={title:'',icon:'Sparkles',short_description:'',details:'',category_id:'',position:0,hidden:false}
export function ServicesAdmin(){
  const [n,setN]=useState(0),[e,setE]=useState(null),[err,setErr]=useState(''),q=useQuery(s=>s.from('services').select('*').order('position'),[n]),cats=useQuery(s=>s.from('categories').select('id,name').is('parent_id',null))
  const save=async ev=>{ev.preventDefault();const {id,...row}=e;row.category_id=row.category_id||null;row.position=+row.position||0
    const r=id?await supabase.from('services').update(row).eq('id',id):await supabase.from('services').insert(row);r.error?setErr(r.error.message):(setE(null),setErr(''),setN(n+1))}
  const del=async s=>{if(confirm(`Delete “${s.title}”?`)){await supabase.from('services').delete().eq('id',s.id);setN(n+1)}}
  const set=(k,v)=>setE(x=>({...x,[k]:v}))
  return<div className="max-w-3xl"><h1 className="text-3xl mb-4">Services</h1>
    {e?<form onSubmit={save} className="space-y-3"><Field l="Title"><input required className={inp} value={e.title} onChange={x=>set('title',x.target.value)}/></Field>
      <Field l="Icon (Palette, Megaphone, Film, Globe, Code, Sparkles, PenTool, Camera, Layers, Box)"><input className={inp} value={e.icon||''} onChange={x=>set('icon',x.target.value)}/></Field>
      <Field l="Short description"><input className={inp} value={e.short_description||''} onChange={x=>set('short_description',x.target.value)}/></Field>
      <Field l="Details (HTML allowed, optional)"><textarea rows="4" className={inp} value={e.details||''} onChange={x=>set('details',x.target.value)}/></Field>
      <Field l="Related category"><select className={inp} value={e.category_id||''} onChange={x=>set('category_id',x.target.value)}><option value="">None</option>{cats.data?.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
      <Field l="Order"><input type="number" className={inp} value={e.position} onChange={x=>set('position',x.target.value)}/></Field><label><input type="checkbox" checked={e.hidden} onChange={x=>set('hidden',x.target.checked)}/> Hidden</label>
      {err&&<p role="alert" className="text-gold">{err}</p>}<div className="flex gap-3"><button className={gold}>Save service</button><button type="button" onClick={()=>setE(null)}>Cancel</button></div></form>
    :<><button className={gold} onClick={()=>setE({...sEmpty})}>Add service</button>{q.data?.length===0&&<p className="mt-4 opacity-70">No services yet.</p>}
      <ul className="mt-4">{q.data?.map(s=><li key={s.id} className="py-2 border-b border-bone/20 flex gap-4"><span className="flex-1">{s.title}{s.hidden&&' (hidden)'}</span><button onClick={()=>setE({...s})}>Edit</button><button className="text-gold" onClick={()=>del(s)}>Delete</button></li>)}</ul></>}</div>}
const text=[['name','Name'],['role','Role line under your name'],['hero_text','Hero text'],['cta_primary','Primary CTA label'],['cta_secondary','Secondary CTA label'],['email','Email'],['phone','Phone'],['footer_text','Footer text'],['seo_title','Default SEO title'],['seo_description','Default SEO description']]
const long=[['bio','Bio'],['skills','Skills (comma separated)'],['tools','Tools and software (comma separated)'],['experience','Experience'],['philosophy','Creative philosophy']]
const imgs=[['profile_image','Profile image'],['logo','Logo'],['favicon','Favicon']]
const socials=['instagram','facebook','linkedin','behance','dribbble','youtube','tiktok','x']
export function SettingsAdmin(){
  const [f,setF]=useState({social:{}}),[msg,setMsg]=useState('')
  useEffect(()=>{supabase.from('site_settings').select('value').eq('key','site').maybeSingle().then(({data})=>data&&setF({social:{},...data.value}))},[])
  const set=(k,v)=>setF(x=>({...x,[k]:v}))
  const save=async e=>{e.preventDefault();const {error}=await supabase.from('site_settings').upsert({key:'site',value:f,updated_at:new Date().toISOString()});setMsg(error?'Save failed: '+error.message:'Saved. Reload the site to see changes.')}
  const up=async(e,k)=>{const file=e.target.files[0];if(!file)return;try{set(k,await upload(file,'site'))}catch(x){setMsg('Upload failed: '+x.message)}}
  return<form onSubmit={save} className="space-y-4 max-w-2xl"><h1 className="text-3xl">Site settings</h1>
    {text.map(([k,l])=><Field key={k} l={l}><input className={inp} value={f[k]||''} onChange={e=>set(k,e.target.value)}/></Field>)}
    {long.map(([k,l])=><Field key={k} l={l}><textarea rows="3" className={inp} value={f[k]||''} onChange={e=>set(k,e.target.value)}/></Field>)}
    {imgs.map(([k,l])=><Field key={k} l={l}><input type="file" accept="image/*" onChange={e=>up(e,k)}/>{f[k]&&<img src={f[k]} alt="" className="h-16 mt-1"/>}</Field>)}
    <fieldset className="border border-bone/20 p-3 grid gap-2"><legend>Social links (only filled ones are shown)</legend>{socials.map(k=><Field key={k} l={k}><input type="url" className={inp} value={f.social?.[k]||''} onChange={e=>set('social',{...f.social,[k]:e.target.value})}/></Field>)}</fieldset>
    {msg&&<p role="status">{msg}</p>}<button className={gold}>Save settings</button></form>}
export function MediaAdmin(){
  const [folder,setFolder]=useState('projects'),[n,setN]=useState(0),[msg,setMsg]=useState(''),[items,setItems]=useState([])
  useEffect(()=>{supabase.storage.from('media').list(folder,{limit:200,sortBy:{column:'created_at',order:'desc'}}).then(({data,error})=>{error?setMsg(error.message):setItems((data||[]).filter(x=>x.id))})},[folder,n])
  const url=name=>supabase.storage.from('media').getPublicUrl(`${folder}/${name}`).data.publicUrl
  const add=async e=>{try{for(const f of e.target.files)await upload(f,folder);setN(n+1)}catch(x){setMsg('Upload failed: '+x.message)}e.target.value=''}
  const del=async it=>{if(confirm(`Delete ${it.name}? Pages using it will show a broken image.`)){await supabase.storage.from('media').remove([`${folder}/${it.name}`]);setN(n+1)}}
  return<div><h1 className="text-3xl mb-4">Media</h1><div className="flex gap-3 items-center mb-4"><select aria-label="Folder" value={folder} onChange={e=>setFolder(e.target.value)} className={inp+' !w-auto'}>{['projects','blog','content','site'].map(x=><option key={x}>{x}</option>)}</select><input type="file" multiple accept="image/*,video/mp4,video/webm" onChange={add}/></div>
    {msg&&<p role="alert" className="text-gold">{msg}</p>}{items.length===0&&<p className="opacity-70">No files in this folder.</p>}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{items.map(it=><div key={it.name} className="border border-bone/20 p-2">{/\.(mp4|webm)$/i.test(it.name)?<video src={url(it.name)} className="w-full aspect-square object-cover"/>:<img loading="lazy" src={url(it.name)} alt="" className="w-full aspect-square object-cover"/>}
      <p className="text-xs truncate mt-1">{it.name}</p><div className="flex gap-3 text-sm"><button onClick={()=>navigator.clipboard.writeText(url(it.name))}>Copy URL</button><button className="text-gold" onClick={()=>del(it)}>Delete</button></div></div>)}</div></div>}

const pEmpty={name:'',kind:'service',price_prefix:'',price_amount:'',billing:'',description:'',features:'',bookable:true,featured:false,hidden:false,position:0}
export function PricingAdmin(){
  const [n,setN]=useState(0),[e,setE]=useState(null),[err,setErr]=useState(''),q=useQuery(s=>s.from('pricing_packages').select('*').order('position'),[n])
  const set=(k,v)=>setE(x=>({...x,[k]:v}))
  const save=async ev=>{ev.preventDefault();const {id,created_at,...row}=e;row.features=(row.features||'').split('\n').map(x=>x.trim()).filter(Boolean);row.price_amount=row.price_amount===''||row.price_amount==null?null:+row.price_amount;row.position=+row.position||0;row.price_prefix=row.price_prefix||null
    const r=id?await supabase.from('pricing_packages').update(row).eq('id',id):await supabase.from('pricing_packages').insert(row);r.error?setErr(r.error.message):(setE(null),setErr(''),setN(n+1))}
  const del=async p=>{if(confirm(`Delete “${p.name}”? It will also disappear from the booking dropdown.`)){await supabase.from('pricing_packages').delete().eq('id',p.id);setN(n+1)}}
  const T=(k,l,p={})=><Field l={l}><input className={inp} value={e[k]??''} onChange={x=>set(k,x.target.value)} {...p}/></Field>
  return<div className="max-w-2xl"><h1 className="text-3xl mb-4">Pricing and packages</h1>
    {e?<form onSubmit={save} className="space-y-3">{T('name','Name',{required:true})}
      <Field l="Type"><select className={inp} value={e.kind} onChange={x=>set('kind',x.target.value)}><option value="service">Service (one-off)</option><option value="package">Monthly package</option></select></Field>
      <div className="grid grid-cols-3 gap-3">{T('price_prefix','Prefix (e.g. From)')}{T('price_amount','Amount (KSh)',{type:'number',min:0})}{T('billing','Billing (e.g. per art, per month)')}</div>
      <Field l="Description"><textarea rows="2" className={inp} value={e.description||''} onChange={x=>set('description',x.target.value)}/></Field>
      <Field l="What is included (one per line)"><textarea rows="4" className={inp} value={e.features||''} onChange={x=>set('features',x.target.value)}/></Field>{T('position','Order',{type:'number'})}
      <div className="flex gap-5 flex-wrap"><label><input type="checkbox" checked={e.bookable} onChange={x=>set('bookable',x.target.checked)}/> In booking dropdown</label><label><input type="checkbox" checked={e.featured} onChange={x=>set('featured',x.target.checked)}/> Highlight</label><label><input type="checkbox" checked={e.hidden} onChange={x=>set('hidden',x.target.checked)}/> Hidden</label></div>
      {err&&<p role="alert" className="text-gold">{err}</p>}<div className="flex gap-3"><button className={gold}>Save</button><button type="button" onClick={()=>setE(null)}>Cancel</button></div></form>
    :<><button className={gold} onClick={()=>setE({...pEmpty})}>Add service or package</button>{q.data?.length===0&&<p className="mt-4 opacity-70">Nothing yet.</p>}{q.error&&<p role="alert" className="text-gold">{q.error}</p>}
      <ul className="mt-4">{q.data?.map(p=><li key={p.id} className="py-2 border-b border-bone/20 flex gap-4"><span className="flex-1">{p.name} · {p.price_prefix||''} {p.price_amount!=null&&`KSh ${Number(p.price_amount).toLocaleString()}`} {p.billing} <em className="opacity-60">({p.kind}{p.hidden?', hidden':''})</em></span><button onClick={()=>setE({...p,features:(p.features||[]).join('\n'),price_prefix:p.price_prefix||''})}>Edit</button><button className="text-gold" onClick={()=>del(p)}>Delete</button></li>)}</ul></>}</div>}
