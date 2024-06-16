import React from 'react'
import Link from 'next/link';
import { Logout } from '@/app/(common)/action';
import { supabaseServer } from '@/utilities/supabase-server';
import NavbarInputClient from './NavbarInput';
import { Button } from 'flowbite-react';

export default async function NavBar() {
  let { data } = await supabaseServer().auth.getUser();

  let component = !data.user?.email ? (
    <Button color='primary'>
      <Link href={'/login'}>Login</Link>
    </Button>
  ) : (
    <form className='flex gap-2'>
      <Button color='success' className='h-full'>
        <Link href='/insert'>Insert</Link>
      </Button>
      <Button color='failure' className='h-full' formAction={Logout}>Logout</Button>
    </form>
  )

  return (
    <nav className='w-full p-4 flex bg-[#0D1636] text-white sticky top-0 d-flex justify-between gap-3 z-[999]'>
      <NavbarInputClient/>
      {component}
    </nav>
  )
}
