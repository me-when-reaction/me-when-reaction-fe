import React from 'react'
import Link from 'next/link';
import { Logout } from '@/app/(common)/action';
import { supabaseServer } from '@/utilities/supabase-server';
import Input from '../input/Input';

export default async function NavBar() {
  let { data } = await supabaseServer().auth.getUser();

  let component = !data.user?.email ? (
    <Link href={'/login'}>Login</Link>
  ) : (
    <form>
      <button formAction={Logout}>Logout</button>
    </form>
  )

  return (
    <nav className='w-full p-4 flex bg-[#0D1636] text-white'>
      <Input type="text"/>
      {component}
    </nav>
  )
}
