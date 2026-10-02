import {useEffect,useState} from 'react'
import {Routes,Route,NavLink,Navigate,Link} from 'react-router-dom'
import ProjectForm from './ProjectForm'
import {BlogList,BlogEdit,Taxonomy} from './BlogAdmin'
import {PricingAdmin,Overview,ServicesAdmin,SettingsAdmin,MediaAdmin} from './MiscAdmin'
import {supabase,slugify,upload} from '../lib/supabase'
import {useQuery} from '../lib/useData'
function Projects(){
  const [n,setN]=useState(0),q=useQuery(s=>s.from('projects').select('id,title,published,featured,created_at').order('created_at',{ascending:false}),[n])
  const toggle=async(p,k)=>{await supabase.from('projects').update({[k]:!p[k]}).eq('id',p.id);setN(n+1)}
  const del=async p=>{if(confirm(`Delete “${p.title}” and all its media records? This can’t be undone.`)){await supabase.from('projects').delete().eq('id',p.id);setN(n+1)}}
  return<div><Link to="/admin/projects/new" className="btn px-4 py-2 font-semibold">Add project</Link>
    {q.error&&<p role="alert" className="mt-4">{q.error}</p>}{q.data?.length===0&&<p className="mt-6 opacity-70">No projects yet. Add your first one.</p>}
    <table className="w-full mt-6 text-left"><tbody>{q.data?.map(p=><tr key={p.id} className="border-b border-bone/20"><td className="py-3"><Link className="hover:text-gold" to={`/admin/projects/${p.id}`}>{p.title}</Link></td>
      <td><button onClick={()=>toggle(p,'published')}>{p.published?'Unpublish':'Publish'}</button></td><td><button onClick={()=>toggle(p,'featured')}>{p.featured?'Unfeature':'Feature'}</button></td><td><button className="text-gold" onClick={()=>del(p)}>Delete</button></td></tr>)}</tbody></table></div>}
function Categories(){
  const [n,setN]=useState(0),q=useQuery(s=>s.from('categories').select('*').order('position'),[n]),[err,setErr]=useState('')
  const add=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const {error}=await supabase.from('categories').insert({name:f.name,slug:slugify(f.name),parent_id:f.parent_id||null});error?setErr(error.message):(e.target.reset(),setN(n+1))}
  const del=async c=>{if(confirm(`Delete “${c.name}” and its subcategories?`)){await supabase.from('categories').delete().eq('id',c.id);setN(n+1)}}
  const all=q.data||[]
  return<div><form onSubmit={add} className="flex gap-2 flex-wrap"><input name="name" required placeholder="Name" aria-label="Name" className="p-2 bg-bone/10"/>
    <select name="parent_id" aria-label="Parent" className="p-2 bg-ink border border-bone/30"><option value="">Top-level category</option>{all.filter(c=>!c.parent_id).map(c=><option key={c.id} value={c.id}>Subcategory of {c.name}</option>)}</select><button className="btn px-4 font-semibold">Add</button></form>{err&&<p role="alert">{err}</p>}
    <ul className="mt-6 space-y-1">{all.filter(c=>!c.parent_id).map(c=><li key={c.id}><b>{c.name}</b> <button className="text-gold ml-2" onClick={()=>del(c)}>Delete</button><ul className="ml-5">{all.filter(s=>s.parent_id===c.id).map(s=><li key={s.id}>{s.name} <button className="text-gold ml-2" onClick={()=>del(s)}>Delete</button></li>)}</ul></li>)}</ul></div>}
function Messages(){
  const [n,setN]=useState(0),q=useQuery(s=>s.from('contact_messages').select('*').order('created_at',{ascending:false}),[n])
  const del=async m=>{if(confirm(`Delete the message from ${m.name}? This can’t be undone.`)){await supabase.from('contact_messages').delete().eq('id',m.id);setN(n+1)}}
  const set=async(m,status)=>{await supabase.from('contact_messages').update({status}).eq('id',m.id);setN(n+1)}
  return<div className="space-y-4">{q.data?.length===0&&<p className="opacity-70">No messages yet.</p>}{q.data?.map(m=><div key={m.id} className="border border-bone/20 p-4"><b>{m.name}</b> · {m.email} {m.phone&&`· ${m.phone}`}{m.service&&<p className="text-gold text-sm">Service: {m.service}</p>}<p className="my-2">{m.message}</p>
    <select value={m.status} onChange={e=>set(m,e.target.value)} aria-label="Status" className="bg-ink border border-bone/30 p-1">{['new','read','contacted','closed'].map(s=><option key={s}>{s}</option>)}</select><button className="text-gold ml-4 text-sm" onClick={()=>del(m)}>Delete</button></div>)}</div>}
export default function Admin(){
  const [state,setState]=useState('checking')
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return setState('out')
    const {data}=await supabase.from('profiles').select('role').eq('id',user.id).maybeSingle();setState(data?.role==='admin'?'ok':'denied')})()},[])
  if(state==='checking')return<p className="p-10">Checking access…</p>
  if(state==='out')return<Navigate to="/admin/login"/>
  if(state==='denied')return<p className="p-10">This account isn’t an admin. Set its role to admin in Supabase.</p>
  const L=({to,children,end})=><NavLink to={to} end={end} className={({isActive})=>`block py-1.5 hover:text-gold ${isActive?'text-gold':''}`}>{children}</NavLink>
  return<div className="md:flex min-h-screen"><aside className="md:w-56 shrink-0 p-5 border-b md:border-b-0 md:border-r border-bone/20"><b className="font-display text-xl">Admin</b>
    <nav aria-label="Admin" className="flex flex-wrap gap-x-4 md:block mt-2"><L to="/admin" end>Overview</L><L to="/admin/projects" end>Projects</L><L to="/admin/projects/new">Add project</L><L to="/admin/categories">Categories</L><L to="/admin/media">Media</L>
      <L to="/admin/blog" end>Blog posts</L><L to="/admin/blog/new">New post</L><L to="/admin/taxonomy">Blog categories and tags</L><L to="/admin/services">Services</L><L to="/admin/pricing">Pricing and packages</L><L to="/admin/messages">Messages</L><L to="/admin/settings">Settings</L>
      <a href="/" className="block py-1.5 hover:text-gold">View site</a><button className="mt-3 text-sm opacity-70" onClick={async()=>{await supabase.auth.signOut();location.href='/admin/login'}}>Sign out</button></nav></aside>
    <main className="flex-1 min-w-0 p-5 md:p-10"><Routes><Route index element={<Overview/>}/><Route path="projects" element={<Projects/>}/><Route path="projects/new" element={<ProjectForm/>}/><Route path="projects/:id" element={<ProjectForm/>}/><Route path="categories" element={<Categories/>}/><Route path="media" element={<MediaAdmin/>}/>
      <Route path="blog" element={<BlogList/>}/><Route path="blog/new" element={<BlogEdit/>}/><Route path="blog/:id" element={<BlogEdit/>}/><Route path="taxonomy" element={<Taxonomy/>}/><Route path="pricing" element={<PricingAdmin/>}/><Route path="services" element={<ServicesAdmin/>}/><Route path="messages" element={<Messages/>}/><Route path="settings" element={<SettingsAdmin/>}/></Routes></main></div>}
