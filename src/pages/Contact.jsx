import {useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import {Phone,Mail,MessageCircle} from 'lucide-react'
import {supabase,configured} from '../lib/supabase'
import {useQuery,useSettings,Seo} from '../lib/useData'
import {priceText,tel,wa} from '../lib/price'
import Socials from '../lib/Socials'
export default function Contact(){
  const s=useSettings(),[sp]=useSearchParams(),[sel,setSel]=useState(sp.get('service')||''),[st,setSt]=useState({s:'idle'})
  const pk=useQuery(z=>z.from('pricing_packages').select('id,name,price_prefix,price_amount,billing,kind').eq('bookable',true).order('position'))
  const items=pk.data||[],chosen=items.find(x=>x.id===sel)
  const submit=async e=>{e.preventDefault();if(!configured)return setSt({s:'err',m:'Supabase is not configured.'});setSt({s:'busy'})
    const {service,...rest}=Object.fromEntries(new FormData(e.target))
    const {error}=await supabase.from('contact_messages').insert({...rest,service:chosen?`${chosen.name} — ${priceText(chosen)} ${chosen.billing||''}`.trim():'Other / not sure',project_type:chosen?.name||'Other'})
    error?setSt({s:'err',m:'Message not sent: '+error.message}):(setSt({s:'ok'}),e.target.reset(),setSel(''))}
  const I=(n,l,p={})=><label className="block"><span className="text-sm opacity-70">{l}</span><input name={n} {...p} className="mt-1 w-full bg-bone/5 border border-bone/20 rounded-xl px-3 py-2 focus:border-gold outline-none"/></label>
  const cl="flex items-center gap-3 card p-3 hover:border-gold"
  return<section className="px-5 md:px-10 pt-24 pb-12"><Seo title="Contact & Booking — Darius Nyambu" description="Book logo design, brand identity, ads, animation and website work with Darius Nyambu in Nairobi."/>
    <h1 className="text-3xl md:text-5xl font-bold mb-6">Start a <span className="grad-text">project</span></h1>
    <div className="grid md:grid-cols-5 gap-6"><div className="md:col-span-2 space-y-3"><a className={cl} href={tel(s.phone)}><Phone className="text-gold" size={20}/>{s.phone}</a><a className={cl} href={`mailto:${s.email}`}><Mail className="text-gold" size={20}/>{s.email}</a><a className={cl} href={wa(s.phone)} target="_blank" rel="noopener noreferrer"><MessageCircle className="text-gold" size={20}/>WhatsApp</a><Socials social={s.social}/></div>
      <form onSubmit={submit} className="md:col-span-3 card p-4 md:p-6 grid sm:grid-cols-2 gap-4">
        {I('name','Name',{required:true})}{I('email','Email',{type:'email',required:true})}{I('phone','Phone')}
        <label className="block"><span className="text-sm opacity-70">Service</span><select name="service" value={sel} onChange={e=>setSel(e.target.value)} className="mt-1 w-full bg-ink border border-bone/20 rounded-xl px-3 py-2 focus:border-gold outline-none"><option value="">Other / not sure</option>
          {['service','package'].map(k=>items.some(i=>i.kind===k)&&<optgroup key={k} label={k==='package'?'Monthly packages':'Services'}>{items.filter(i=>i.kind===k).map(i=><option key={i.id} value={i.id}>{i.name} — {priceText(i)} {i.billing}</option>)}</optgroup>)}</select></label>
        {chosen&&<p className="sm:col-span-2 text-sm text-gold" role="status">{chosen.name}: {priceText(chosen)} {chosen.billing}</p>}
        <div className="sm:col-span-2">{I('budget','Budget (optional)')}</div>
        <label className="block sm:col-span-2"><span className="text-sm opacity-70">Tell me about your project</span><textarea name="message" required rows="4" className="mt-1 w-full bg-bone/5 border border-bone/20 rounded-xl p-3 focus:border-gold outline-none"/></label>
        <div className="sm:col-span-2"><button disabled={st.s==='busy'} className="btn px-8 py-3">{st.s==='busy'?'Sending…':'Send request'}</button></div>
        {st.s==='ok'&&<p role="status" className="sm:col-span-2">Request sent. I’ll reply soon.</p>}{st.s==='err'&&<p role="alert" className="sm:col-span-2 text-gold">{st.m}</p>}</form></div></section>}
