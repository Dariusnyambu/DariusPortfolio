import {useRef} from 'react'
import {ExternalLink} from 'lucide-react'
import {useParams,Link} from 'react-router-dom'
import {motion,useScroll,useTransform} from 'framer-motion'
import {useQuery,Seo} from '../lib/useData'
const isFile=u=>/\.(mp4|webm)(\?|$)/i.test(u)
const embed=u=>u.replace('watch?v=','embed/').replace('youtu.be/','www.youtube.com/embed/').replace('vimeo.com/','player.vimeo.com/video/')
function Hero({p}){const r=useRef(),{scrollYProgress}=useScroll({target:r,offset:['start start','end start']}),y=useTransform(scrollYProgress,[0,1],['0%','18%'])
  if(!p.cover_url)return null
  return<div ref={r} className="h-[45vh] md:h-[60vh] overflow-hidden">{isFile(p.cover_url)?<video src={p.cover_url} autoPlay muted loop playsInline className="w-full h-full object-cover"/>:<motion.img style={{y,scale:1.15}} src={p.cover_url} alt={p.cover_alt||p.title} className="w-full h-full object-cover"/>}</div>}
function Next({p}){const none='00000000-0000-0000-0000-000000000000',cols='slug,title'
  const q=useQuery(async s=>{let r=await s.from('projects').select(cols).eq('published',true).eq('category_id',p.category_id||none).neq('id',p.id).limit(1);if(!r.data?.length)r=await s.from('projects').select(cols).eq('published',true).neq('id',p.id).limit(1);return r},[p.id]),n=q.data?.[0]
  if(!n)return null
  return<Link to={`/project/${n.slug}`} className="group block px-5 md:px-10 py-10 border-t border-bone/20"><p className="opacity-70">Next project</p><h2 className="text-3xl md:text-5xl font-extrabold group-hover:text-gold transition">{n.title}</h2></Link>}
export default function Project(){
  const {slug}=useParams()
  const {data:p,loading,error}=useQuery(s=>s.from('projects').select('*,category:categories!projects_category_id_fkey(name),sub:categories!projects_subcategory_id_fkey(name),media:project_media(*),sections:project_case_study_sections(*)').eq('slug',slug).eq('published',true).maybeSingle(),[slug])
  if(loading)return<div className="pt-40 px-10">Loading…</div>
  if(error)return<p role="alert" className="pt-40 px-10">Couldn’t load this project: {error}</p>
  if(!p)return<p className="pt-40 px-10">Project not found. <Link className="underline" to="/work">Back to work</Link></p>
  const secs=[...p.sections].filter(s=>s.enabled).sort((a,b)=>a.position-b.position),media=[...p.media].sort((a,b)=>a.position-b.position)
  return<article><Seo title={p.seo_title||`${p.title} — Darius Nyambu`} description={p.seo_description||p.short_description} image={p.seo_image||p.cover_url} canonical={`${location.origin}/project/${p.slug}`}/>
    <Hero p={p}/>
    <div className="px-5 md:px-10 py-8 grid md:grid-cols-12 gap-8"><div className="md:col-span-8"><p className="opacity-70">{[p.category?.name,p.sub?.name].filter(Boolean).join(' / ')}</p><h1 className="text-3xl md:text-5xl font-extrabold">{p.title}</h1><p className="text-lg mt-3">{p.short_description}</p>{p.live_url&&<a href={p.live_url} target="_blank" rel="noopener noreferrer" className="btn px-6 py-3 mt-5">Visit live website <ExternalLink size={16}/></a>}</div>
      <dl className="md:col-span-4 text-sm space-y-2">{[['Client',p.client],['Date',p.project_date],['Location',p.location],['Services',p.services?.join(', ')],['Tools',p.tools?.join(', ')]].filter(r=>r[1]).map(([k,v])=><div key={k}><dt className="opacity-60">{k}</dt><dd>{v}</dd></div>)}</dl></div>
    {p.description&&<div className="px-5 md:px-10 max-w-3xl rich" dangerouslySetInnerHTML={{__html:p.description}}/>}
    {p.video_url&&<div className="px-5 md:px-10 py-8">{isFile(p.video_url)?<video controls src={p.video_url} className="w-full"/>:<iframe title={`${p.title} video`} src={embed(p.video_url)} allowFullScreen className="w-full aspect-video"/>}</div>}
    {secs.map(s=><section key={s.id} className="px-5 md:px-10 py-8 max-w-3xl"><h2 className="text-3xl mb-3">{s.title}</h2><div className="rich" dangerouslySetInnerHTML={{__html:s.body}}/></section>)}
    <div className="px-5 md:px-10 grid gap-6 py-10">{media.map(m=><figure key={m.id}>{m.kind==='video'?<video controls src={m.url} className="w-full"/>:<img loading="lazy" src={m.url} alt={m.alt||''} className="w-full"/>}{m.caption&&<figcaption className="text-sm opacity-70 mt-2">{m.caption}</figcaption>}</figure>)}</div>
    <Next p={p}/></article>}
