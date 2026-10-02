import {useEffect,useState} from 'react'
import {supabase,configured} from './supabase'
import {DEFAULTS} from './price'
export function useQuery(fn,deps=[]){
  const [s,set]=useState({data:null,loading:true,error:configured?null:'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.'})
  useEffect(()=>{if(!configured)return;let ok=true;set(x=>({...x,loading:true}))
    fn(supabase).then(({data,error})=>ok&&set({data,loading:false,error:error?.message||null}))
    return()=>{ok=false}},deps)
  return s}
let sp
export function useSettings(){const [v,setV]=useState(DEFAULTS)
  useEffect(()=>{if(!configured)return;sp??=supabase.from('site_settings').select('value').eq('key','site').maybeSingle().then(r=>r.data?.value||{});sp.then(x=>{const c=Object.fromEntries(Object.entries(x).filter(([,y])=>y&&(typeof y!=='object'||Object.keys(y).length)));setV({...DEFAULTS,...c,social:{...DEFAULTS.social,...Object.fromEntries(Object.entries(x.social||{}).filter(([,y])=>y))}})})},[]);return v}
export function Seo({title,description,image,canonical,keywords,jsonLd,type='website'}){
  useEffect(()=>{document.title=title
    const img=image||location.origin+'/darius.jpg',url=canonical||location.origin+location.pathname
    const m=(n,c,a='name')=>{if(!c)return;let e=document.querySelector(`meta[${a}="${n}"]`);if(!e){e=document.createElement('meta');e.setAttribute(a,n);document.head.appendChild(e)}e.content=c}
    m('description',description);m('keywords',keywords);m('og:title',title,'property');m('og:description',description,'property');m('og:image',img,'property');m('og:type',type,'property');m('og:url',url,'property');m('og:site_name','Darius Nyambu','property')
    m('twitter:card','summary_large_image');m('twitter:title',title);m('twitter:description',description);m('twitter:image',img)
    let l=document.querySelector('link[rel=canonical]');if(!l){l=document.createElement('link');l.rel='canonical';document.head.appendChild(l)}l.href=url
    document.getElementById('ld')?.remove();if(jsonLd){const s=document.createElement('script');s.id='ld';s.type='application/ld+json';s.text=JSON.stringify(jsonLd);document.head.appendChild(s)}
  },[title,description,image,canonical,keywords,JSON.stringify(jsonLd)])
  return null}
