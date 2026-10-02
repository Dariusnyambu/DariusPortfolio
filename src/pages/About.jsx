import {Link} from 'react-router-dom'
import {useSettings,Seo} from '../lib/useData'
import {Words,Magnetic} from '../lib/fx'
const list=v=>(v||'').split(',').map(x=>x.trim()).filter(Boolean)
export default function About(){
  const s=useSettings()
  return<section className="px-5 md:px-10 pt-24 pb-12"><Seo title="About — Darius Nyambu" description={(s.bio||'Multidisciplinary creative in Nairobi.').slice(0,155)}/>
    <div className="grid md:grid-cols-12 gap-10"><img src={s.profile_image||'/darius.jpg'} alt={`Portrait of ${s.name||'Darius Nyambu'}`} className="md:col-span-4 w-full max-h-[45vh] md:max-h-[480px] object-cover object-top rounded-3xl"/>
      <div className="md:col-span-8"><Words as="h1" text="About" className="text-4xl md:text-6xl font-extrabold mb-6"/>
        <p className="text-xl leading-relaxed max-w-2xl">{s.bio||'A multidisciplinary creative working across graphic design, creative advertising, motion and video, creative arts, web design and web development.'}</p>
        {list(s.skills).length>0&&<><h2 className="text-2xl mt-10 mb-2">Skills</h2><ul className="flex flex-wrap gap-2">{list(s.skills).map(k=><li key={k} className="border border-bone/30 px-3 py-1 text-sm">{k}</li>)}</ul></>}
        {list(s.tools).length>0&&<><h2 className="text-2xl mt-8 mb-2">Tools</h2><ul className="flex flex-wrap gap-2">{list(s.tools).map(k=><li key={k} className="border border-bone/30 px-3 py-1 text-sm">{k}</li>)}</ul></>}
        {s.experience&&<><h2 className="text-2xl mt-8 mb-2">Experience</h2><p className="whitespace-pre-line opacity-90">{s.experience}</p></>}
        {s.philosophy&&<><h2 className="text-2xl mt-8 mb-2">Creative philosophy</h2><p className="text-lg max-w-xl">{s.philosophy}</p></>}
        <div className="mt-10"><Magnetic><Link to="/contact" className="inline-block btn px-6 py-3 font-semibold">Let’s work together</Link></Magnetic></div></div></div></section>}
