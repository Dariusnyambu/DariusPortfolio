import {useRef,useState,useEffect} from 'react'
import {motion,useReducedMotion,AnimatePresence,useMotionValue,useSpring} from 'framer-motion'
const ease=[.2,.8,.2,1]
export function Magnetic({children,className=''}){const r=useRef(),rm=useReducedMotion(),[p,setP]=useState({x:0,y:0})
  return<motion.div ref={r} className={`inline-block ${className}`} animate={p} transition={{type:'spring',stiffness:200,damping:15}}
    onMouseMove={e=>{if(rm)return;const b=r.current.getBoundingClientRect();setP({x:(e.clientX-b.left-b.width/2)*.25,y:(e.clientY-b.top-b.height/2)*.25})}} onMouseLeave={()=>setP({x:0,y:0})}>{children}</motion.div>}
export function Words({text,as:T='h2',className=''}){const rm=useReducedMotion(),M=motion[T]
  return<M className={className} aria-label={text}>{text.split(' ').map((w,i)=><span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom mr-[.25em]"><motion.span className="inline-block" initial={rm?false:{y:'110%'}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:.7,delay:i*.06,ease}}>{w}</motion.span></span>)}</M>}
export function ImageReveal({children,className=''}){const rm=useReducedMotion()
  return<motion.div className={className} initial={rm?false:{clipPath:'inset(0 0 100% 0)'}} whileInView={{clipPath:'inset(0 0 0% 0)'}} viewport={{once:true}} transition={{duration:.9,ease}}>{children}</motion.div>}
export function Cursor(){const rm=useReducedMotion(),x=useMotionValue(-100),y=useMotionValue(-100),sx=useSpring(x,{stiffness:500,damping:40}),sy=useSpring(y,{stiffness:500,damping:40}),[big,setBig]=useState(false),[fine,setFine]=useState(false)
  useEffect(()=>{const ok=matchMedia('(pointer:fine)').matches;setFine(ok);if(!ok)return;const mv=e=>{x.set(e.clientX);y.set(e.clientY);setBig(!!e.target.closest?.('a,button,[role=button]'))};addEventListener('mousemove',mv);return()=>removeEventListener('mousemove',mv)},[])
  if(rm||!fine)return null
  return<motion.div aria-hidden="true" style={{x:sx,y:sy}} className="pointer-events-none fixed top-0 left-0 z-[60] -ml-3 -mt-3"><motion.div animate={{scale:big?2.2:1}} className="w-6 h-6 rounded-full border border-gold"/></motion.div>}
export function Intro(){const [show,setShow]=useState(()=>!sessionStorage.getItem('intro')&&!matchMedia('(prefers-reduced-motion:reduce)').matches)
  useEffect(()=>{if(!show)return;const t=setTimeout(()=>{sessionStorage.setItem('intro','1');setShow(false)},1400);return()=>clearTimeout(t)},[show])
  return<AnimatePresence>{show&&<motion.div exit={{y:'-100%'}} transition={{duration:.8,ease:[.7,0,.2,1]}} className="fixed inset-0 z-[70] bg-ink grid place-items-center"><motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="font-display text-4xl font-extrabold">Darius Nyambu</motion.p></motion.div>}</AnimatePresence>}
