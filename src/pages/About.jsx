import {useEffect} from 'react'
import {Link,useLocation} from 'react-router-dom'
import {ArrowRight} from 'lucide-react'
import {useSettings,Seo} from '../lib/useData'
import {Magnetic} from '../lib/fx'
import Socials from '../lib/Socials'
import {Experience,Skills,Tools} from '../lib/Experience'
import {intro,whatIDo,sections} from '../content/about'
const list=v=>(v||'').split(',').map(x=>x.trim()).filter(Boolean)
export default function About(){
  const s=useSettings(),{hash}=useLocation()
  useEffect(()=>{if(hash)setTimeout(()=>document.querySelector(hash)?.scrollIntoView({behavior:'smooth'}),150)},[hash])
  return<div className="px-5 md:px-10 pt-24 pb-12 max-w-6xl mx-auto space-y-12"><Seo title="About Darius Nyambu — Web Developer, Graphic Designer, Video Editor & Social Media Manager" description="Self-taught Kenyan digital creative with experience in web development, graphic design, video editing, social media management and digital content creation." keywords="Darius Nyambu, Social Media Manager, Graphic Designer, Web Developer, Video Editor, Digital Content Creator, Digital Marketing"/>
    <section className="grid md:grid-cols-12 gap-6 md:gap-10 items-start">
      <img src={s.profile_image||'/darius.jpg'} alt={`Portrait of ${s.name}`} className="md:col-span-4 w-full max-w-xs md:max-w-none mx-auto max-h-[45vh] md:max-h-[520px] object-cover object-top rounded-3xl border border-gold/40"/>
      <div className="md:col-span-8"><p className="text-gold text-xs tracking-widest font-semibold">ABOUT ME</p>
        <h1 className="text-3xl md:text-5xl font-bold mt-2 leading-tight">I’m Darius — a <span className="grad-text">designer, developer, and creative problem-solver.</span></h1>
        <div className="mt-4 space-y-3 opacity-85 leading-relaxed">{intro.map(t=><p key={t}>{t}</p>)}</div><div className="mt-4"><Socials social={s.social}/></div></div></section>
    <section><h2 className="text-2xl md:text-3xl font-bold">What I <span className="grad-text">Do</span></h2><p className="opacity-80 mt-2">I work across several areas of digital creativity, including:</p>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">{whatIDo.map(([t,d])=><li key={t} className="card p-4"><h3 className="font-semibold text-gold">{t}</h3><p className="text-sm opacity-80 mt-1">{d}</p></li>)}</ul></section>
    <Skills/><Tools extra={list(s.tools)}/><Experience/>
    <div className="grid md:grid-cols-2 gap-3">{sections.map(([t,ps])=><section key={t} className="card p-5"><h2 className="text-xl font-bold mb-2">{t}</h2><div className="space-y-2 text-sm opacity-85 leading-relaxed">{ps.map(p=><p key={p}>{p}</p>)}</div></section>)}</div>
    <section className="text-center card p-8 bg-[radial-gradient(ellipse_at_bottom,#2a1260_0%,transparent_70%)]"><h2 className="text-2xl md:text-4xl font-bold">Let’s Build <span className="grad-text">Something</span></h2>
      <p className="opacity-80 mt-3 max-w-xl mx-auto">Have an idea, a brand that needs direction, a campaign that needs attention, or a digital product you want to bring to life?</p>
      <p className="opacity-80 mt-2 max-w-xl mx-auto">Let’s turn the idea into something people can see, experience, and remember.</p>
      <div className="mt-5"><Magnetic><Link to="/contact" className="btn px-8 py-3">Start a project <ArrowRight size={16}/></Link></Magnetic></div></section></div>}
