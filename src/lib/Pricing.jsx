import {Link} from 'react-router-dom'
import {Check} from 'lucide-react'
import {useQuery} from './useData'
import {priceText} from './price'
function Card({p}){return<div className={`card p-4 flex flex-col ${p.featured?'!border-gold':''}`}>
  <h3 className="font-semibold">{p.name}</h3><p className="mt-1"><span className="text-2xl font-bold grad-text">{priceText(p)}</span> {p.billing&&<span className="text-xs opacity-70">{p.billing}</span>}</p>
  {p.description&&<p className="text-sm opacity-75 mt-2">{p.description}</p>}
  {p.features?.length>0&&<ul className="mt-2 space-y-1 text-sm">{p.features.map(f=><li key={f} className="flex gap-2"><Check size={16} className="text-gold shrink-0 mt-0.5"/>{f}</li>)}</ul>}
  {p.bookable&&<Link to={`/contact?service=${p.id}`} className="btn-o px-4 py-1.5 text-sm mt-auto self-start mt-3">Book this</Link>}</div>}
export function Pricing(){
  const q=useQuery(s=>s.from('pricing_packages').select('*').order('position')),d=q.data||[]
  if(q.loading)return<div className="grid sm:grid-cols-3 gap-3">{[0,1,2].map(i=><div key={i} className="h-32 card animate-pulse"/>)}</div>
  if(q.error||!d.length)return null
  const one=d.filter(x=>x.kind!=='package'),pk=d.filter(x=>x.kind==='package')
  return<div><h2 className="text-2xl md:text-3xl font-semibold mb-4">Pricing</h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{one.map(p=><Card key={p.id} p={p}/>)}</div>
    {pk.length>0&&<><h3 className="text-xl font-semibold mt-8 mb-3">Monthly packages</h3><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{pk.map(p=><Card key={p.id} p={p}/>)}</div></>}</div>}
