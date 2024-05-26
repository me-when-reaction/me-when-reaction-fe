import { supabaseServer } from '@/utilities/supabase-server'
import React from 'react'
import { Logout } from './action';

export default async function HomePage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser()
  return (
    <form>
      <div>Ello, {data.user?.email ?? "?"}</div>
      <button formAction={Logout}>Logout</button>
    </form>
  )
}
