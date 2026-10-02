export const inp='w-full p-2 bg-bone/10 border border-bone/20 text-bone'
export const Field=({l,children})=><label className="block"><span className="text-sm opacity-70">{l}</span>{children}</label>
export const gold='btn px-5 py-2 font-semibold disabled:opacity-50'
export const toLocal=iso=>{if(!iso)return'';const d=new Date(iso);return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,16)}
