import {useRef,useState} from 'react'
import {useEditor,EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import {upload} from '../lib/supabase'
export default function RichEditor({value,onChange,folder='content'}){
  const file=useRef(),[err,setErr]=useState('')
  const ed=useEditor({extensions:[StarterKit,Underline,Link.configure({openOnClick:false}),Image,Youtube.configure({width:640,height:360}),Table,TableRow,TableHeader,TableCell],content:value||'',onUpdate:({editor})=>onChange(editor.getHTML()),editorProps:{attributes:{class:'rich min-h-[200px] p-4 outline-none','aria-label':'Content editor'}}})
  if(!ed)return null
  const c=()=>ed.chain().focus()
  const pick=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;setErr('')
    try{const src=await upload(f,folder),alt=prompt('Image description (alt text)')||'',cap=prompt('Caption (optional)')||''
      c().insertContent([{type:'image',attrs:{src,alt}},...(cap?[{type:'paragraph',content:[{type:'text',text:cap,marks:[{type:'italic'}]}]}]:[])]).run()}catch(x){setErr('Upload failed: '+x.message)}}
  const link=()=>{const u=prompt('Link URL (empty to remove)',ed.getAttributes('link').href||'');if(u===null)return;u?c().extendMarkRange('link').setLink({href:u}).run():c().unsetLink().run()}
  const vid=()=>{const u=prompt('YouTube URL');if(u)ed.commands.setYoutubeVideo({src:u})}
  const items=[['H1',()=>c().toggleHeading({level:1}).run(),ed.isActive('heading',{level:1})],['H2',()=>c().toggleHeading({level:2}).run(),ed.isActive('heading',{level:2})],['H3',()=>c().toggleHeading({level:3}).run(),ed.isActive('heading',{level:3})],
    ['B',()=>c().toggleBold().run(),ed.isActive('bold')],['I',()=>c().toggleItalic().run(),ed.isActive('italic')],['U',()=>c().toggleUnderline().run(),ed.isActive('underline')],['Link',link,ed.isActive('link')],
    ['• List',()=>c().toggleBulletList().run(),ed.isActive('bulletList')],['1. List',()=>c().toggleOrderedList().run(),ed.isActive('orderedList')],['Quote',()=>c().toggleBlockquote().run(),ed.isActive('blockquote')],['Code',()=>c().toggleCodeBlock().run(),ed.isActive('codeBlock')],
    ['Image',()=>file.current.click()],['Video',vid],['Table',()=>c().insertTable({rows:3,cols:3,withHeaderRow:true}).run()],['Divider',()=>c().setHorizontalRule().run()]]
  return<div className="border border-bone/30"><div className="flex flex-wrap gap-1 p-2 border-b border-bone/30 sticky top-0 bg-ink z-10" role="toolbar" aria-label="Formatting">
    {items.map(([l,fn,on])=><button type="button" key={l} onClick={fn} aria-pressed={on===undefined?undefined:!!on} className={`px-2 py-1 text-sm border ${on?'btn border-gold':'border-bone/30'}`}>{l}</button>)}</div>
    <input ref={file} type="file" accept="image/*" hidden onChange={pick}/>{err&&<p role="alert" className="p-2 text-gold">{err}</p>}<EditorContent editor={ed}/></div>}
