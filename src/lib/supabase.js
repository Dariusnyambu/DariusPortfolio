import {createClient} from '@supabase/supabase-js'
const url=import.meta.env.VITE_SUPABASE_URL, key=import.meta.env.VITE_SUPABASE_ANON_KEY
export const configured=!!(url&&key)
export const supabase=createClient(url||'http://localhost',key||'missing')
export const slugify=s=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
export async function upload(file,folder='projects'){
  const path=`${folder}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/,''))}.${file.name.split('.').pop()}`
  const {error}=await supabase.storage.from('media').upload(path,file,{cacheControl:'31536000'})
  if(error)throw error
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}
