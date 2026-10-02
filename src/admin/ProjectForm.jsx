import {useEffect,useState} from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import {supabase,slugify,upload} from '../lib/supabase'
import {useQuery} from '../lib/useData'
import RichEditor from './RichEditor'
import {inp,Field,gold} from './ui'
const empty={title:'',slug:'',short_description:'',description:'',category_id:'',subcategory_id:'',client:'',project_date:'',location:'',services:'',tools:'',status:'completed',featured:false,published:false,cover_url:'',cover_alt:'',video_url:'',live_url:'',seo_title:'',seo_description:'',seo_image:''}
const presets=['Overview','Challenge','Objective','Creative direction','Concept','Design process','Strategy','My role','Typography','Color palette','Execution','Results','Final outcome','Lessons learned']
const key=()=>crypto.randomUUID()
export default function ProjectForm(){
  const {id}=useParams(),nav=useNavigate()
  const [f,setF]=useState(empty),[secs,setSecs]=useState([]),[removed,setRemoved]=useState([]),[media,setMedia]=useState([]),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false),[ready,setReady]=useState(!id)
  const cats=useQuery(s=>s.from('categories').select('*').order('position')),c=cats.data||[]
  const set=(k,v)=>setF(x=>({...x,[k]:v}))
  const load=async()=>{if(!id)return;const {data,error}=await supabase.from('projects').select('*,media:project_media(*),sections:project_case_study_sections(*)').eq('id',id).single();if(error)return setMsg(error.message)
    const {media:m,sections:s,...row}=data;const n={};for(const k of Object.keys(empty))n[k]=row[k]??empty[k]
    setF({...n,services:(row.services||[]).join(', '),tools:(row.tools||[]).join(', ')});setMedia(m.sort((a,b)=>a.position-b.position));setSecs(s.sort((a,b)=>a.position-b.position).map(x=>({...x,k:key()})));setReady(true)}
  useEffect(()=>{load()},[id])
  const save=async e=>{e.preventDefault();setBusy(true);setMsg('')
    try{const row={};for(const k of Object.keys(empty))row[k]=f[k]
      row.slug=slugify(f.slug||f.title);for(const k of ['services','tools'])row[k]=f[k]?f[k].split(',').map(x=>x.trim()).filter(Boolean):[]
      for(const k of ['category_id','subcategory_id','project_date'])row[k]=f[k]||null
      let pid=id
      if(id){const {error}=await supabase.from('projects').update(row).eq('id',id);if(error)throw error}
      else{const {data,error}=await supabase.from('projects').insert(row).select('id').single();if(error)throw error;pid=data.id}
      if(removed.length)await supabase.from('project_case_study_sections').delete().in('id',removed)
      const rows=secs.map((s,i)=>({...(s.id?{id:s.id}:{}),project_id:pid,title:s.title||'Untitled',body:s.body||'',enabled:s.enabled!==false,position:i})),T='project_case_study_sections'
      const olds=rows.filter(r=>r.id),news=rows.filter(r=>!r.id)
      if(olds.length){const {error}=await supabase.from(T).upsert(olds);if(error)throw error}
      if(news.length){const {error}=await supabase.from(T).insert(news);if(error)throw error}
      if(!id)nav(`/admin/projects/${pid}`,{replace:true});else{setMsg('Saved.');setRemoved([]);load()}
    }catch(x){setMsg('Save failed: '+x.message)}finally{setBusy(false)}}
  const cover=async e=>{const file=e.target.files[0];if(!file)return;try{set('cover_url',await upload(file,'projects'))}catch(x){setMsg('Upload failed: '+x.message)}}
  const addMedia=async e=>{const files=[...e.target.files];e.target.value='';try{let pos=media.length
    for(const file of files){const url=await upload(file,'projects');const {error}=await supabase.from('project_media').insert({project_id:id,url,kind:file.type.startsWith('video')?'video':'image',file_name:file.name,file_size:file.size,position:pos++});if(error)throw error}
    load()}catch(x){setMsg('Upload failed: '+x.message)}}
  const move=async(i,d)=>{const a=media[i],b=media[i+d];if(!b)return;await supabase.from('project_media').update({position:b.position}).eq('id',a.id);await supabase.from('project_media').update({position:a.position}).eq('id',b.id);load()}
  const delMedia=async m=>{if(confirm('Remove this media item from the project?')){await supabase.from('project_media').delete().eq('id',m.id);load()}}
  const upd=(m,k,v)=>supabase.from('project_media').update({[k]:v}).eq('id',m.id)
  const T=(k,l,p={})=><Field l={l}><input className={inp} value={f[k]} onChange={e=>set(k,e.target.value)} {...p}/></Field>
  const mv=(i,d)=>{const a=[...secs],j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];setSecs(a)}
  const ps=(i,patch)=>setSecs(secs.map((s,j)=>j===i?{...s,...patch}:s))
  return<form onSubmit={save} className="space-y-5 max-w-3xl"><h1 className="text-3xl">{id?'Edit project':'Add project'}</h1>
    {T('title','Title',{required:true})}{T('slug','Slug (auto from title if empty)')}{T('short_description','Short description')}
    <Field l="Full description">{ready&&<RichEditor value={f.description} onChange={v=>set('description',v)} folder="projects"/>}</Field>
    <div className="grid md:grid-cols-2 gap-4"><Field l="Category"><select className={inp} value={f.category_id} onChange={e=>setF(x=>({...x,category_id:e.target.value,subcategory_id:''}))}><option value="">—</option>{c.filter(x=>!x.parent_id).map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></Field>
      <Field l="Subcategory"><select className={inp} value={f.subcategory_id} onChange={e=>set('subcategory_id',e.target.value)}><option value="">—</option>{c.filter(x=>x.parent_id&&x.parent_id===f.category_id).map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></Field>
      {T('client','Client')}{T('project_date','Project date',{type:'date'})}{T('location','Location')}{T('status','Status')}{T('services','Services (comma separated)')}{T('tools','Tools (comma separated)')}</div>
    <Field l="Cover image or video"><input type="file" accept="image/*,video/mp4,video/webm" onChange={cover}/></Field>{f.cover_url&&<p className="text-xs break-all opacity-70">{f.cover_url}</p>}{T('cover_alt','Cover alt text')}{T('video_url','Video URL (YouTube, Vimeo or file)')}{T('live_url','Live website link (for web projects)',{type:'url'})}
    <fieldset className="border border-bone/20 p-3 grid gap-3"><legend>SEO</legend>{T('seo_title','SEO title')}{T('seo_description','SEO description')}{T('seo_image','SEO / Open Graph image URL')}</fieldset>
    <div className="flex gap-6"><label><input type="checkbox" checked={f.featured} onChange={e=>set('featured',e.target.checked)}/> Featured</label><label><input type="checkbox" checked={f.published} onChange={e=>set('published',e.target.checked)}/> Published</label></div>
    <fieldset className="border border-bone/20 p-3"><legend>Case study sections</legend>
      <p className="text-sm opacity-70 mb-3">Add only the sections this project needs. Names are free text.</p>
      <div className="flex flex-wrap gap-1 mb-4">{presets.map(p=><button type="button" key={p} className="text-xs border border-bone/30 px-2 py-1 hover:border-gold" onClick={()=>setSecs([...secs,{k:key(),title:p,body:'',enabled:true}])}>+ {p}</button>)}<button type="button" className="text-xs border border-gold px-2 py-1" onClick={()=>setSecs([...secs,{k:key(),title:'',body:'',enabled:true}])}>+ Custom</button></div>
      {secs.map((s,i)=><div key={s.k} className="border border-bone/20 p-3 mb-4 space-y-2"><div className="flex gap-2 items-center"><input aria-label="Section title" className={inp} value={s.title} onChange={e=>ps(i,{title:e.target.value})} placeholder="Section title"/>
        <label className="text-sm whitespace-nowrap"><input type="checkbox" checked={s.enabled!==false} onChange={e=>ps(i,{enabled:e.target.checked})}/> Show</label>
        <button type="button" aria-label="Move up" onClick={()=>mv(i,-1)}>↑</button><button type="button" aria-label="Move down" onClick={()=>mv(i,1)}>↓</button>
        <button type="button" className="text-gold" onClick={()=>{if(confirm('Remove this section?')){if(s.id)setRemoved([...removed,s.id]);setSecs(secs.filter((_,j)=>j!==i))}}}>Remove</button></div>
        <RichEditor value={s.body} onChange={v=>ps(i,{body:v})} folder="projects"/></div>)}</fieldset>
    {id?<fieldset className="border border-bone/20 p-3"><legend>Gallery, mockups, before/after</legend><input type="file" multiple accept="image/*,video/mp4,video/webm" onChange={addMedia}/>
      <ul className="mt-4 space-y-3">{media.map((m,i)=><li key={m.id} className="flex gap-3 items-start">{m.kind==='video'?<video src={m.url} className="w-24 h-24 object-cover"/>:<img src={m.url} alt={m.alt||''} className="w-24 h-24 object-cover"/>}
        <div className="flex-1 grid gap-1"><input aria-label="Alt text" placeholder="Alt text" defaultValue={m.alt||''} onBlur={e=>upd(m,'alt',e.target.value)} className={inp}/><input aria-label="Caption" placeholder="Caption" defaultValue={m.caption||''} onBlur={e=>upd(m,'caption',e.target.value)} className={inp}/></div>
        <div className="flex flex-col"><button type="button" aria-label="Move up" onClick={()=>move(i,-1)}>↑</button><button type="button" aria-label="Move down" onClick={()=>move(i,1)}>↓</button><button type="button" className="text-gold" onClick={()=>delMedia(m)}>Delete</button></div></li>)}</ul></fieldset>
      :<p className="text-sm opacity-70">Save the project once to add gallery media.</p>}
    {msg&&<p role="status" className={msg.startsWith('Save failed')||msg.startsWith('Upload')?'text-gold':''}>{msg}</p>}
    <div className="flex gap-3 items-center"><button disabled={busy} className={gold}>{busy?'Saving…':'Save project'}</button>{id&&f.slug&&<a href={`/project/${f.slug}`} target="_blank" rel="noopener noreferrer" className="underline">Preview{f.published?'':' (publish first to view)'}</a>}</div></form>}
