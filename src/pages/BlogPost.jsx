import {useParams,Link} from 'react-router-dom'
import {useQuery,useSettings,Seo} from '../lib/useData'
export default function BlogPost(){
  const {slug}=useParams(),s=useSettings()
  const {data:p,loading,error}=useQuery(z=>z.from('blog_posts').select('*,category:blog_categories(name),tags:blog_post_tags(tag:blog_tags(name))').eq('slug',slug).eq('status','published').maybeSingle(),[slug])
  if(loading)return<div className="pt-40 px-10">Loading…</div>
  if(error)return<p role="alert" className="pt-40 px-10">Couldn’t load this article: {error}</p>
  if(!p)return<p className="pt-40 px-10">Article not found. <Link className="underline" to="/blog">Back to journal</Link></p>
  const url=p.canonical_url||`${location.origin}/blog/${p.slug}`,img=p.og_image||p.featured_image
  const ld={'@context':'https://schema.org','@type':'Article',headline:p.seo_title||p.title,description:p.seo_description||p.excerpt,image:img?[img]:undefined,author:{'@type':'Person',name:p.author_name||'Darius Nyambu'},datePublished:p.publish_at||p.created_at,dateModified:p.updated_at,mainEntityOfPage:url,publisher:{'@type':'Person',name:s.name||'Darius Nyambu'}}
  return<article className="px-5 md:px-10 pt-24 pb-12 max-w-3xl mx-auto"><Seo type="article" title={p.seo_title||`${p.title} — Darius Nyambu`} description={p.seo_description||p.excerpt} keywords={p.seo_keywords} canonical={url} image={img} jsonLd={ld}/>
    <header><p className="opacity-70">{p.category?.name}</p><h1 className="text-3xl md:text-5xl font-extrabold">{p.title}</h1>
      <p className="mt-3 text-sm opacity-70">By {p.author_name} · <time dateTime={p.publish_at||p.created_at}>{new Date(p.publish_at||p.created_at).toLocaleDateString()}</time></p></header>
    {p.featured_image&&<img src={p.featured_image} alt={p.featured_alt||''} className="w-full my-8"/>}
    <div className="rich" dangerouslySetInnerHTML={{__html:p.content}}/>
    {p.tags?.length>0&&<ul className="flex gap-2 mt-8 text-sm">{p.tags.map(t=><li key={t.tag.name} className="border border-bone/30 px-3 py-1">{t.tag.name}</li>)}</ul>}</article>}
