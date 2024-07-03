import React from 'react'
import Link from 'next/link';
import { Logout } from '@/app/(common)/action';
import { supabaseServer } from '@/utilities/supabase-server';
import NavbarInputClient from './NavbarInput';
import { Button } from 'flowbite-react';
import TopAlert from '../alert/TopAlert';
import BreadcrumbLite from '../breadcrumb-lite/BreadcrumbLite';

export default async function NavBar() {
  let { data } = await supabaseServer().auth.getUser();

  let component = !data.user?.email ? (
    <Button color='primary'>
      <Link href={'/login'}>Login</Link>
    </Button>
  ) : (
    <div className='flex gap-2'>
      <Link href='/insert' passHref>
        <Button color='success' className='h-full'>Insert</Button>
      </Link>
      <form>
        <Button color='failure' className='h-full' type='submit' formAction={Logout}>Logout</Button>
      </form>
    </div>
  )

  return (
    <div className='sticky top-0 z-[999]'>
      <nav className='w-full p-4 pb-0 flex bg-[#0D1636] text-white d-flex justify-between gap-3'>
        <NavbarInputClient/>
        <TopAlert/>
        {component}
      </nav>
      <BreadcrumbLite/>
    </div>
  )
}
