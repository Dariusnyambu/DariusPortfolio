import {Link} from 'react-router-dom'
import {Briefcase,Code2,Palette,Film,Share2,Megaphone,Sparkles} from 'lucide-react'
import {useQuery} from './useData'
import {experience,skillCategories,smmSkills,tools} from '../content/experience'
const icons=[Code2,Palette,Film,Share2,Megaphone,Sparkles]
export function ExperiencePreview(){
  return<section className="px-5 md:px-10 py-8 md:py-12 border-t border-bone/10"><div className="flex items-end justify-between mb-4"><h2 className="text-2xl md:text-4xl font-bold">Work <span className="grad-text">experience</span></h2><Link to="/about#experience" className="text-gold text-sm underline">Full details</Link></div>
    <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{experience.map(e=><li key={e.org}><Link to="/about#experience" className="card p-4 block h-full hover:border-gold"><Briefcase size={18} className="text-gold" aria-hidden="true"/><h3 className="font-semibold mt-2">{e.org}</h3><p className="text-sm opacity-75">{e.role}</p></Link></li>)}</ul></section>}
export function Experience(){
  const q=useQuery(s=>s.from('projects').select('id,title,slug,cover_url,cover_alt,client').eq('published',true).not('client','is',null).limit(200))
  const related=o=>(q.data||[]).filter(p=>p.cover_url&&p.client.toLowerCase().includes(o.toLowerCase())).slice(0,4)
  return<section id="experience" className="scroll-mt-20"><h2 className="text-2xl md:text-3xl font-bold">Work <span className="grad-text">Experience</span></h2>
    <ol className="relative border-l border-gold/40 ml-2 mt-4 space-y-4">{experience.map(e=>{const r=related(e.org);return<li key={e.org} className="pl-5 relative"><span aria-hidden="true" className="absolute -left-[6.5px] top-5 w-3 h-3 rounded-full bg-gold"/>
      <article className="card p-4 md:p-5"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="text-xl font-bold">{e.org}</h3><p className="text-gold font-medium">{e.role}</p></div>{e.industry&&<span className="card !rounded-full px-3 py-1 text-xs">{e.industry}</span>}</div>
        <ul className="mt-3 space-y-1 text-sm opacity-85 list-disc pl-5">{e.points.map(p=><li key={p}>{p}</li>)}</ul>
        {r.length>0&&<div className="mt-4"><p className="text-xs opacity-60 mb-2">Related projects</p><div className="grid grid-cols-4 gap-2">{r.map(p=><Link key={p.id} to={`/project/${p.slug}`} title={p.title}><img loading="lazy" src={p.cover_url} alt={p.cover_alt||p.title} className="w-full aspect-square object-cover rounded-lg border border-bone/10"/></Link>)}</div></div>}</article></li>})}</ol></section>}
export function Skills(){
  return<section><h2 className="text-2xl md:text-3xl font-bold">Professional <span className="grad-text">Skills</span></h2>
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">{skillCategories.map((c,i)=>{const Ic=icons[i];return<li key={c} className={`card p-4 flex items-center gap-3 ${c==='Social Media Management'?'!border-gold':''}`}><Ic className="text-gold shrink-0" size={20} aria-hidden="true"/><span className="font-semibold text-sm">{c}</span></li>})}</ul>
    <div className="card p-5 mt-3"><h3 className="font-bold text-lg">Social Media <span className="text-gold">Management</span></h3><ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-3 text-sm opacity-85 list-disc pl-5">{smmSkills.map(x=><li key={x}>{x}</li>)}</ul></div></section>}
export function Tools({extra=[]}){
  const all=[...tools,...extra.filter(x=>!tools.some(t=>t.name.toLowerCase()===x.toLowerCase())).map(n=>({name:n,desc:'Tool',badge:n.slice(0,2),color:'#A855F7'}))]
  return<section><h2 className="text-2xl md:text-3xl font-bold">Software &amp; <span className="grad-text">Tools</span></h2>
    <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">{all.map(t=><li key={t.name} className="card p-3 flex items-center gap-3"><span aria-hidden="true" style={{background:t.color+'22',color:t.color,borderColor:t.color+'66'}} className="grid place-items-center w-10 h-10 shrink-0 rounded-lg border font-bold text-sm">{t.badge}</span><div className="min-w-0"><p className="font-semibold text-sm leading-tight">{t.name}</p><p className="text-xs opacity-65 leading-tight mt-0.5">{t.desc}</p></div></li>)}</ul></section>}
