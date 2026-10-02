import {useState} from 'react';import {useNavigate} from 'react-router-dom';import {supabase} from '../lib/supabase'
export default function Login(){const nav=useNavigate(),[err,setErr]=useState('')
  const go=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const {error}=await supabase.auth.signInWithPassword(f);error?setErr(error.message):nav('/admin')}
  return<form onSubmit={go} className="max-w-sm mx-auto pt-32 px-5 space-y-4"><h1 className="text-4xl">Admin sign in</h1>
    <input name="email" type="email" required placeholder="Email" aria-label="Email" className="w-full p-3 bg-bone/10"/><input name="password" type="password" required placeholder="Password" aria-label="Password" className="w-full p-3 bg-bone/10"/>
    {err&&<p role="alert" className="text-gold">{err}</p>}<button className="btn px-6 py-3 font-semibold">Sign in</button></form>}
