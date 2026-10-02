import {Link} from 'react-router-dom'
import {useQuery,Seo} from '../lib/useData'
export default function Blog(){
  const q=useQuery(s=>s.from('blog_posts').select('id,title,slug,excerpt,featured_image,featured_alt,publish_at,category:blog_categories(name)').eq('status','published').order('publish_at',{ascending:false,nullsFirst:false}))
  return<section className="px-5 md:px-10 pt-24 pb-12"><Seo title="Journal — Darius Nyambu" description="Articles on design, motion and web development."/>
    <h1 className="text-4xl md:text-6xl font-extrabold mb-10">Journal</h1>
    {q.loading&&<div className="grid md:grid-cols-3 gap-5">{[0,1,2].map(i=><div key={i} className="aspect-video bg-bone/10 animate-pulse"/>)}</div>}
    {q.error&&<p role="alert" className="text-gold">Couldn’t load posts: {q.error}</p>}
    {q.data?.length===0&&<p className="opacity-70">No articles published yet.</p>}
    <div className="grid md:grid-cols-3 gap-8">{q.data?.map(p=><article key={p.id}><Link to={`/blog/${p.slug}`} className="group block">
      {p.featured_image&&<div className="overflow-hidden aspect-video"><img loading="lazy" src={p.featured_image} alt={p.featured_alt||''} className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/></div>}
      <p className="text-sm opacity-70 mt-3">{p.category?.name}{p.publish_at&&<> · <time dateTime={p.publish_at}>{new Date(p.publish_at).toLocaleDateString()}</time></>}</p>
      <h2 className="text-2xl group-hover:text-gold">{p.title}</h2><p className="text-sm opacity-80 mt-1">{p.excerpt}</p></Link></article>)}</div></section>}
