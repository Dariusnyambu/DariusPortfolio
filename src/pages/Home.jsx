import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'
import {ArrowRight} from 'lucide-react'
import {ProjectGrid} from './Work'
import {useQuery,useSettings,Seo} from '../lib/useData'
import {Magnetic} from '../lib/fx'
import {Pricing} from '../lib/Pricing'
import Socials from '../lib/Socials'
const list=v=>(v||'').split(',').map(x=>x.trim()).filter(Boolean)
export default function Home(){
  const s=useSettings(),[first,...rest]=s.name.split(' ')
  const feat=useQuery(z=>z.from('projects').select('id,title,slug,cover_url,cover_alt,live_url,category:categories!projects_category_id_fkey(name),sub:categories!projects_subcategory_id_fkey(name)').eq('published',true).eq('featured',true).limit(8))
  const posts=useQuery(z=>z.from('blog_posts').select('id,title,slug,excerpt').eq('status','published').order('publish_at',{ascending:false,nullsFirst:false}).limit(3))
  const base=location.origin,addr={'@type':'PostalAddress',addressLocality:'Nairobi',addressCountry:'KE'}
  const ld={'@context':'https://schema.org','@graph':[{'@type':'WebSite',name:s.name,url:base},{'@type':'Person',name:s.name,jobTitle:'Graphic Designer, Motion Artist and Web Developer',url:base,image:base+'/darius.jpg',email:s.email,telephone:s.phone,address:addr,sameAs:Object.values(s.social||{}).filter(Boolean)},{'@type':'ProfessionalService',name:`${s.name} — Design & Web`,url:base,telephone:s.phone,email:s.email,address:addr,areaServed:['Kenya','Worldwide']}]}
  const skills=list(s.skills).length?list(s.skills):['Graphic Design','Creative Ads','Motion Graphics','Web Design','Web Development']
  return<>
  <Seo title={s.seo_title||`${s.name} — Graphic Designer, Motion Artist & Web Developer in Nairobi`} description={s.seo_description||'Logos, brand identity, ads, animation, websites and e-commerce stores by Darius Nyambu, a multidisciplinary creative in Nairobi, Kenya.'} jsonLd={ld}/>
  <section className="relative px-5 md:px-10 pt-20 md:pt-28 pb-8 md:pb-14 grid md:grid-cols-2 gap-6 md:gap-10 items-center overflow-hidden bg-[radial-gradient(circle_at_80%_20%,#2a1260_0%,transparent_55%)]">
    <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} transition={{duration:.8,delay:1.1}} className="order-first md:order-last relative mx-auto w-full max-w-sm md:max-w-md">
      <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-violet-600/50 to-transparent blur-2xl" aria-hidden="true"/>
      <div className="relative overflow-hidden rounded-3xl border border-gold/50 bg-gradient-to-br from-violet-900/60 to-ink h-[42vh] sm:h-[48vh] md:h-[540px]"><img src={s.profile_image||'/darius.jpg'} alt={`Portrait of ${s.name}`} className="w-full h-full object-cover object-top"/></div>
      <div className="absolute top-3 right-3 card !rounded-xl px-3 py-1.5 text-xs flex items-center gap-2 backdrop-blur"><span className="w-2 h-2 rounded-full bg-emerald-400"/>Available for new projects</div></motion.div>
    <div>
      <p className="text-gold text-lg font-semibold">Hello, I’m</p>
      <motion.h1 initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.8,delay:1.2}} className="font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05]">{first} <span className="grad-text">{rest.join(' ')}</span></motion.h1>
      <p className="mt-3 text-lg md:text-2xl font-semibold">{s.role||<>I’m a <span className="text-gold">Graphic Designer</span>, <span className="text-gold">Motion Artist</span> & <span className="text-gold">Web Developer</span></>}</p>
      <p className="mt-3 opacity-80 max-w-md text-sm md:text-base">{s.hero_text||'I design brands, ads and animations, and build modern websites and online stores that help businesses grow.'}</p>
      <div className="mt-5 flex flex-wrap gap-3"><Magnetic><Link to="/work" className="btn px-6 py-3 text-sm">{s.cta_primary||'View My Work'} <ArrowRight size={16}/></Link></Magnetic><Magnetic><Link to="/contact" className="btn-o px-6 py-3 text-sm">{s.cta_secondary||'Let’s Talk'}</Link></Magnetic></div>
      <div className="mt-5"><Socials social={s.social}/></div></div></section>
  <section className="px-5 md:px-10 py-8 md:py-12 grid md:grid-cols-2 gap-6 border-t border-bone/10"><div><p className="text-gold text-xs tracking-widest font-semibold">ABOUT ME</p><h2 className="text-2xl md:text-4xl font-bold mt-2">Turning ideas into <span className="grad-text">beautiful experiences</span></h2></div>
    <div><p className="opacity-80 text-sm md:text-base">{s.bio?s.bio.slice(0,300):'A multidisciplinary creative working across graphic design, creative advertising, motion, web design and web development.'}</p><ul className="flex flex-wrap gap-2 mt-3">{skills.map(k=><li key={k} className="card !rounded-full px-3 py-1 text-xs">{k}</li>)}</ul><Link to="/about" className="inline-block mt-3 text-gold text-sm underline">More about me</Link></div></section>
  <section className="px-5 md:px-10 py-8 md:py-12 border-t border-bone/10"><div className="flex items-end justify-between mb-4"><h2 className="text-2xl md:text-4xl font-bold">Selected <span className="grad-text">work</span></h2><Link to="/work" className="text-gold text-sm underline">View all</Link></div>
    <ProjectGrid q={feat} empty="Featured projects appear here once you mark them as featured in the admin."/></section>
  <section className="px-5 md:px-10 py-8 md:py-12 border-t border-bone/10"><Pricing/></section>
  {posts.data?.length>0&&<section className="px-5 md:px-10 py-8 md:py-12 border-t border-bone/10"><h2 className="text-2xl md:text-4xl font-bold mb-4">Journal</h2><div className="grid md:grid-cols-3 gap-3">{posts.data.map(p=><Link key={p.id} to={`/blog/${p.slug}`} className="card p-4 hover:border-gold"><h3 className="font-semibold">{p.title}</h3><p className="text-sm opacity-70 mt-1 line-clamp-2">{p.excerpt}</p></Link>)}</div></section>}
  <section className="px-5 md:px-10 py-12 text-center border-t border-bone/10 bg-[radial-gradient(ellipse_at_bottom,#2a1260_0%,transparent_65%)]"><p className="text-gold text-xs tracking-widest font-semibold">LET’S WORK TOGETHER</p><h2 className="text-3xl md:text-5xl font-bold mt-2">Have a project in mind?</h2><p className="opacity-75 mt-2 max-w-md mx-auto text-sm">Let’s bring your vision to life with clean, modern and user-focused design.</p><div className="mt-5"><Magnetic><Link to="/contact" className="btn px-8 py-3">Hire me <ArrowRight size={16}/></Link></Magnetic></div></section></>}
