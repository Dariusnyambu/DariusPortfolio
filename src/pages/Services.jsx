import {Link} from 'react-router-dom'
import {Palette,Megaphone,Film,Globe,Code,Sparkles,PenTool,Camera,Layers,Box} from 'lucide-react'
import {Pricing} from '../lib/Pricing'
import {useQuery,Seo} from '../lib/useData'
const I={Palette,Megaphone,Film,Globe,Code,Sparkles,PenTool,Camera,Layers,Box}
export default function Services(){
  const q=useQuery(s=>s.from('services').select('*,category:categories(slug)').order('position'))
  return<section className="px-5 md:px-10 pt-24 pb-12"><Seo title="Services — Darius Nyambu" description="Design, motion and web services."/>
    <h1 className="text-4xl md:text-6xl font-extrabold mb-10">Services</h1>
    {q.loading&&<p>Loading…</p>}{q.error&&<p role="alert" className="text-gold">{q.error}</p>}{q.data?.length===0&&<p className="opacity-70">Services will appear here once added in the admin.</p>}
    <ul>{q.data?.map(s=>{const Ic=I[s.icon]||Sparkles;return<li key={s.id} className="border-t border-bone/20 py-5 grid md:grid-cols-12 gap-4"><Ic className="text-gold" aria-hidden="true"/><div className="md:col-span-5"><h2 className="text-3xl">{s.title}</h2><p className="mt-2 opacity-80">{s.short_description}</p></div>
      <div className="md:col-span-6 rich" dangerouslySetInnerHTML={{__html:s.details||''}}/>{s.category?.slug&&<Link to={`/work/${s.category.slug}`} className="underline hover:text-gold md:col-start-2 md:col-span-11">See related work</Link>}</li>})}</ul><div className="mt-10"><Pricing/></div></section>}
