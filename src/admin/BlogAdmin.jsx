import {useEffect,useState} from 'react'
import {Link,useParams,useNavigate} from 'react-router-dom'
import {supabase,slugify,upload} from '../lib/supabase'
import {useQuery} from '../lib/useData'
import RichEditor from './RichEditor'
import {inp,Field,gold,toLocal} from './ui'
export function BlogList(){
  const [n,setN]=useState(0),q=useQuery(s=>s.from('blog_posts').select('id,title,status,featured,publish_at,created_at').order('created_at',{ascending:false}),[n])
  const tog=async(p,patch)=>{await supabase.from('blog_posts').update(patch).eq('id',p.id);setN(n+1)}
  const del=async p=>{if(confirm(`Delete “${p.title}”? This can’t be undone.`)){await supabase.from('blog_posts').delete().eq('id',p.id);setN(n+1)}}
  return<div><Link to="/admin/blog/new" className={gold}>New post</Link>{q.error&&<p role="alert" className="mt-4">{q.error}</p>}{q.data?.length===0&&<p className="mt-6 opacity-70">No posts yet.</p>}
    <table className="w-full mt-6 text-left"><tbody>{q.data?.map(p=><tr key={p.id} className="border-b border-bone/20"><td className="py-3"><Link className="hover:text-gold" to={`/admin/blog/${p.id}`}>{p.title}</Link></td>
      <td>{p.status==='published'&&p.publish_at&&new Date(p.publish_at)>new Date()?'scheduled':p.status}</td>
      <td><button onClick={()=>tog(p,{status:p.status==='published'?'draft':'published',...(p.status!=='published'&&!p.publish_at?{publish_at:new Date().toISOString()}:{})})}>{p.status==='published'?'Unpublish':'Publish'}</button></td>
      <td><button onClick={()=>tog(p,{featured:!p.featured})}>{p.featured?'Unfeature':'Feature'}</button></td><td><button className="text-gold" onClick={()=>del(p)}>Delete</button></td></tr>)}</tbody></table></div>}
const empty={title:'',slug:'',excerpt:'',content:'',featured_image:'',featured_alt:'',category_id:'',author_name:'Darius Nyambu',status:'draft',publish_at:'',featured:false,seo_title:'',seo_description:'',seo_keywords:'',canonical_url:'',og_title:'',og_description:'',og_image:'',tags:''}
export function BlogEdit(){
  const {id}=useParams(),nav=useNavigate(),[f,setF]=useState(empty),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false),[ready,setReady]=useState(!id)
  const cats=useQuery(s=>s.from('blog_categories').select('*').order('name')),set=(k,v)=>setF(x=>({...x,[k]:v}))
  useEffect(()=>{if(!id)return;supabase.from('blog_posts').select('*,tags:blog_post_tags(tag:blog_tags(name))').eq('id',id).single().then(({data,error})=>{if(error)return setMsg(error.message);const n={};for(const k of Object.keys(empty))n[k]=data[k]??empty[k];n.publish_at=toLocal(data.publish_at);n.tags=data.tags.map(t=>t.tag.name).join(', ');setF(n);setReady(true)})},[id])
  const save=async e=>{e.preventDefault();setBusy(true);setMsg('')
    try{const row={};for(const k of Object.keys(empty))if(k!=='tags')row[k]=f[k]
      row.slug=slugify(f.slug||f.title);row.category_id=f.category_id||null
      row.publish_at=f.publish_at?new Date(f.publish_at).toISOString():(f.status==='published'?new Date().toISOString():null)
      let pid=id
      if(id){const {error}=await supabase.from('blog_posts').update(row).eq('id',id);if(error)throw error}else{const {data,error}=await supabase.from('blog_posts').insert(row).select('id').single();if(error)throw error;pid=data.id}
      const trows=f.tags.split(',').map(x=>x.trim()).filter(Boolean).map(n=>({name:n,slug:slugify(n)}));let tids=[]
      if(trows.length){const {data,error}=await supabase.from('blog_tags').upsert(trows,{onConflict:'slug'}).select('id');if(error)throw error;tids=data.map(d=>d.id)}
      await supabase.from('blog_post_tags').delete().eq('post_id',pid)
      if(tids.length){const {error}=await supabase.from('blog_post_tags').insert(tids.map(t=>({post_id:pid,tag_id:t})));if(error)throw error}
      if(!id)nav(`/admin/blog/${pid}`,{replace:true});else setMsg('Saved.')
    }catch(x){setMsg('Save failed: '+x.message)}finally{setBusy(false)}}
  const img=async(e,k)=>{const file=e.target.files[0];if(!file)return;try{set(k,await upload(file,'blog'))}catch(x){setMsg('Upload failed: '+x.message)}}
  const T=(k,l,p={})=><Field l={l}><input className={inp} value={f[k]} onChange={e=>set(k,e.target.value)} {...p}/></Field>
  if(!ready)return<p>{msg||'Loading…'}</p>
  return<form onSubmit={save} className="space-y-5 max-w-3xl"><h1 className="text-3xl">{id?'Edit post':'New post'}</h1>
    {T('title','Title',{required:true})}{T('slug','Slug (auto if empty)')}<Field l="Excerpt"><textarea rows="2" className={inp} value={f.excerpt} onChange={e=>set('excerpt',e.target.value)}/></Field>
    <Field l="Featured image"><input type="file" accept="image/*" onChange={e=>img(e,'featured_image')}/></Field>{f.featured_image&&<img src={f.featured_image} alt="" className="h-24"/>}{T('featured_alt','Featured image alt text')}
    <Field l="Content"><RichEditor value={f.content} onChange={v=>set('content',v)} folder="blog"/></Field>
    <div className="grid md:grid-cols-2 gap-4"><Field l="Category"><select className={inp} value={f.category_id} onChange={e=>set('category_id',e.target.value)}><option value="">—</option>{cats.data?.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
      {T('tags','Tags (comma separated)')}{T('author_name','Author')}<Field l="Status"><select className={inp} value={f.status} onChange={e=>set('status',e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></Field>
      {T('publish_at','Publish date (future date schedules it)',{type:'datetime-local'})}</div>
    <label><input type="checkbox" checked={f.featured} onChange={e=>set('featured',e.target.checked)}/> Featured post</label>
    <fieldset className="border border-bone/20 p-3 grid gap-3"><legend>SEO</legend>{T('seo_title','SEO title')}{T('seo_description','SEO description')}{T('seo_keywords','Keywords')}{T('canonical_url','Canonical URL')}{T('og_title','Open Graph title')}{T('og_description','Open Graph description')}
      <Field l="Open Graph image"><input type="file" accept="image/*" onChange={e=>img(e,'og_image')}/></Field>{f.og_image&&<p className="text-xs break-all opacity-70">{f.og_image}</p>}</fieldset>
    {msg&&<p role="status" className={msg.includes('failed')?'text-gold':''}>{msg}</p>}<button disabled={busy} className={gold}>{busy?'Saving…':'Save post'}</button></form>}
function Simple({table,title}){
  const [n,setN]=useState(0),[err,setErr]=useState(''),q=useQuery(s=>s.from(table).select('*').order('name'),[n])
  const add=async e=>{e.preventDefault();const name=new FormData(e.target).get('name');const {error}=await supabase.from(table).insert({name,slug:slugify(name)});error?setErr(error.message):(e.target.reset(),setErr(''),setN(n+1))}
  const del=async r=>{if(confirm(`Delete “${r.name}”?`)){await supabase.from(table).delete().eq('id',r.id);setN(n+1)}}
  return<section><h2 className="text-2xl mb-3">{title}</h2><form onSubmit={add} className="flex gap-2"><input name="name" required aria-label={`New ${title}`} className={inp}/><button className={gold}>Add</button></form>{err&&<p role="alert" className="text-gold">{err}</p>}
    <ul className="mt-3">{q.data?.map(r=><li key={r.id} className="py-1">{r.name} <button className="text-gold ml-2" onClick={()=>del(r)}>Delete</button></li>)}</ul></section>}
export const Taxonomy=()=><div className="grid md:grid-cols-2 gap-10 max-w-3xl"><Simple table="blog_categories" title="Blog categories"/><Simple table="blog_tags" title="Tags"/></div>
