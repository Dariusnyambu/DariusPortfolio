import {useMemo} from 'react'
import {Link,useParams,useNavigate} from 'react-router-dom'
import {motion} from 'framer-motion'
import {ExternalLink} from 'lucide-react'
import {useQuery,Seo} from '../lib/useData'
const isVid=u=>/\.(mp4|webm)(\?|$)/i.test(u||'')
export function ProjectGrid({q,empty}){
  const cols='columns-2 md:columns-3 lg:columns-4 gap-3'
  if(q.loading)return<div className={cols}>{[40,56,48,64,44,52].map((h,i)=><div key={i} style={{height:h*4}} className="mb-3 rounded-2xl card animate-pulse break-inside-avoid"/>)}</div>
  if(q.error)return<p role="alert" className="text-gold">Couldn’t load projects: {q.error}</p>
  if(!q.data?.length)return<p className="opacity-70">{empty||'No projects yet.'}</p>
  return<div className={cols}>{q.data.map(p=><motion.div key={p.id} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-40px'}} className="relative break-inside-avoid mb-3 group">
    <Link to={`/project/${p.slug}`} className="relative block overflow-hidden rounded-2xl bg-cobalt border border-bone/10">
      {p.cover_url?(isVid(p.cover_url)?<video src={p.cover_url} muted loop autoPlay playsInline className="w-full h-auto"/>:<img loading="lazy" src={p.cover_url} alt={p.cover_alt||p.title} className="w-full h-auto min-h-[7rem] transition duration-700 group-hover:scale-105"/>):<div className="aspect-[4/3] grid place-items-center text-sm opacity-40">No cover</div>}
      <div className="absolute inset-x-0 bottom-0 p-3 pt-10 bg-gradient-to-t from-black/85 to-transparent"><p className="text-[11px] text-gold">{[p.category?.name,p.sub?.name].filter(Boolean).join(' / ')}</p><h3 className="text-sm md:text-base font-semibold leading-tight">{p.title}</h3></div></Link>
    {p.live_url&&<a href={p.live_url} target="_blank" rel="noopener noreferrer" aria-label={`Visit live site: ${p.title}`} className="absolute top-2 right-2 btn text-xs px-3 py-1">Live <ExternalLink size={12}/></a>}</motion.div>)}</div>}
export default function Work(){
  const {cat,sub}=useParams(),nav=useNavigate()
  const cats=useQuery(s=>s.from('categories').select('*').order('position'))
  const projects=useQuery(s=>s.from('projects').select('id,title,slug,cover_url,cover_alt,live_url,category:categories!projects_category_id_fkey(name,slug),sub:categories!projects_subcategory_id_fkey(name,slug)').eq('published',true).order('created_at',{ascending:false}))
  const tops=(cats.data||[]).filter(c=>!c.parent_id),active=tops.find(c=>c.slug===cat),subs=(cats.data||[]).filter(c=>active&&c.parent_id===active.id)
  const shown=useMemo(()=>({...projects,data:projects.data?.filter(p=>(!cat||p.category?.slug===cat)&&(!sub||p.sub?.slug===sub))}),[projects,cat,sub])
  const chip=(on,label,to)=><button key={label} onClick={()=>nav(to)} aria-pressed={on} className={`px-4 py-1.5 text-sm rounded-full border whitespace-nowrap transition ${on?'btn border-transparent':'border-bone/25 hover:border-gold'}`}>{label}</button>
  const row='flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap'
  return<section className="px-5 md:px-10 pt-24 pb-12"><Seo title="Work — Darius Nyambu" description="Graphic design, creative ads, motion and website projects by Darius Nyambu."/>
    <h1 className="text-3xl md:text-5xl font-bold mb-4">My <span className="grad-text">Work</span></h1>
    <div className={row+' mb-2'} role="group" aria-label="Categories">{chip(!cat,'All','/work')}{tops.map(c=>chip(cat===c.slug,c.name,`/work/${c.slug}`))}</div>
    {subs.length>0&&<div className={row+' mb-4'} role="group" aria-label="Subcategories">{chip(!sub,`All ${active.name}`,`/work/${cat}`)}{subs.map(c=>chip(sub===c.slug,c.name,`/work/${cat}/${c.slug}`))}</div>}
    <div className="mt-4"><ProjectGrid q={shown} empty="Nothing here yet."/></div></section>}
