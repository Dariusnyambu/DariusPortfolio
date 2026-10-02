export const DEFAULTS={name:'Darius Nyambu',email:'hello@dariusnyambu.co.ke',phone:'0708 039 015',social:{}}
export const priceText=p=>p.price_amount==null?'Custom quote':`${p.price_prefix?p.price_prefix+' ':''}KSh ${Number(p.price_amount).toLocaleString()}`
export const tel=p=>'tel:'+p.replace(/[^\d+]/g,'')
export const wa=p=>{let d=p.replace(/\D/g,'');if(d.startsWith('0'))d='254'+d.slice(1);return'https://wa.me/'+d}
