import {lazy,Suspense,useEffect,useState} from 'react'
import {Routes,Route,Link,NavLink,useLocation} from 'react-router-dom'
import {AnimatePresence,motion} from 'framer-motion'
import {Menu,X} from 'lucide-react'
import Home from './pages/Home'
import {useSettings} from './lib/useData'
import {Cursor,Intro,Magnetic} from './lib/fx'
const L=n=>lazy(()=>import(`./pages/${n}.jsx`))
const Work=L('Work'),Project=L('Project'),Contact=L('Contact'),About=L('About'),Services=L('Services'),Blog=L('Blog'),BlogPost=L('BlogPost')
const Login=lazy(()=>import('./admin/Login')),Admin=lazy(()=>import('./admin/Admin'))
const links=[['/work','Work'],['/about','About'],['/services','Services'],['/blog','Blog'],['/contact','Contact']]
const socials=['instagram','facebook','linkedin','behance','dribbble','youtube','tiktok','x']
function Shell({children}){
  const [open,setOpen]=useState(false),s=useSettings(),loc=useLocation()
  useEffect(()=>setOpen(false),[loc.pathname])
  useEffect(()=>{if(!s.favicon)return;let l=document.querySelector('link[rel=icon]');if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l)}l.href=s.favicon},[s.favicon])
  return<>
  <Intro/><Cursor/>
  <header className="fixed top-0 inset-x-0 z-[55] flex items-center justify-between px-5 md:px-10 py-3 bg-ink/80 backdrop-blur border-b border-bone/10">
    <Link to="/" className="flex items-center gap-2 font-semibold text-lg">{s.logo?<img src={s.logo} alt={s.name} className="h-8"/>:<><span aria-hidden="true" className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-400 text-white text-sm font-bold">D</span>{s.name}</>}</Link>
    <nav aria-label="Main" className="hidden md:flex items-center gap-7 text-sm">{[['/','Home'],...links].map(([to,l])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>isActive?'text-gold':'hover:text-gold'}>{l}</NavLink>)}</nav>
    <Magnetic className="hidden md:inline-block"><Link to="/contact" className="btn-o px-5 py-2 text-sm">Let’s Talk →</Link></Magnetic>
    <button className="md:hidden" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>
  <AnimatePresence>{open&&<motion.div initial={{clipPath:'circle(0% at 90% 5%)'}} animate={{clipPath:'circle(150% at 90% 5%)'}} exit={{clipPath:'circle(0% at 90% 5%)'}} transition={{duration:.6,ease:[.7,0,.2,1]}} className="fixed inset-0 z-50 bg-ink flex flex-col justify-center px-8 gap-2">
    {[['/','Home'],...links].map(([to,l],i)=><motion.div key={to} initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.2+i*.06}}><Link to={to} className="font-display text-4xl font-semibold">{l}</Link></motion.div>)}
    <Link to="/contact" className="mt-6 btn px-6 py-3 font-semibold self-start">Start a project</Link></motion.div>}</AnimatePresence>
  {children}
  <footer className="px-5 md:px-10 py-12 text-sm grid md:grid-cols-2 gap-6 border-t border-bone/20">
    <div><p className="opacity-70">{s.footer_text||`© ${new Date().getFullYear()} Darius Nyambu · Nairobi`}</p>{s.email&&<a className="hover:text-gold" href={`mailto:${s.email}`}>{s.email}</a>}</div>
    <ul className="flex flex-wrap gap-4 md:justify-end">{socials.filter(k=>s.social?.[k]).map(k=><li key={k}><a className="capitalize hover:text-gold" href={s.social[k]} target="_blank" rel="noopener noreferrer">{k}</a></li>)}</ul></footer></>}
export default function App(){
  const loc=useLocation()
  if(loc.pathname.startsWith('/admin'))return<Suspense fallback={<p className="p-10">Loading…</p>}><Routes><Route path="/admin/login" element={<Login/>}/><Route path="/admin/*" element={<Admin/>}/></Routes></Suspense>
  return<Shell><AnimatePresence mode="wait"><motion.main key={loc.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
    <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading…</div>}>
    <Routes location={loc}><Route path="/" element={<Home/>}/><Route path="/work" element={<Work/>}/><Route path="/work/:cat" element={<Work/>}/><Route path="/work/:cat/:sub" element={<Work/>}/><Route path="/project/:slug" element={<Project/>}/>
      <Route path="/about" element={<About/>}/><Route path="/services" element={<Services/>}/><Route path="/blog" element={<Blog/>}/><Route path="/blog/:slug" element={<BlogPost/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<p className="pt-40 px-10">Page not found.</p>}/></Routes>
    </Suspense></motion.main></AnimatePresence></Shell>}
