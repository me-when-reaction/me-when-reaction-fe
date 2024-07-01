import React from 'react'
import Link from 'next/link';
import { Logout } from '@/app/(common)/action';
import { supabaseServer } from '@/utilities/supabase-server';
import NavbarInputClient from './NavbarInput';
import { Button } from 'flowbite-react';
import TopAlert from '../alert/TopAlert';

export default async function NavBar() {
  let { data } = await supabaseServer().auth.getUser();

  let component = !data.user?.email ? (
    <Button color='primary'>
      <Link href={'/login'}>Login</Link>
    </Button>
  ) : (
    <div className='flex gap-2'>
      <Button color='success' className='h-full'>
        <Link href='/insert'>Insert</Link>
      </Button>
      <form>
        <Button color='failure' className='h-full' type='submit' formAction={Logout}>Logout</Button>
      </form>
    </div>
  )

  return (
    <nav className='w-full p-4 flex bg-[#0D1636] text-white sticky top-0 d-flex justify-between gap-3 z-[999]'>
      <NavbarInputClient/>
      <TopAlert/>
      {component}
    </nav>
  )
}
