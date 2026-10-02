import {Instagram,Facebook,Linkedin,Youtube,Dribbble,Twitter} from 'lucide-react'
const I={instagram:Instagram,facebook:Facebook,linkedin:Linkedin,youtube:Youtube,dribbble:Dribbble,x:Twitter}
export default function Socials({social={}}){
  const ks=Object.keys(social).filter(k=>social[k]);if(!ks.length)return null
  return<ul className="flex gap-3">{ks.map(k=>{const Ic=I[k];return<li key={k}><a href={social[k]} target="_blank" rel="noopener noreferrer" aria-label={k} className="grid place-items-center w-9 h-9 rounded-full border border-bone/30 hover:border-gold hover:text-gold text-xs font-semibold capitalize">{Ic?<Ic size={16}/>:k.slice(0,2)}</a></li>})}</ul>}
