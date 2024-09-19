import React from 'react'
import Link from 'next/link';
import { supabaseServer } from '@/utilities/supabase-server';
import { Button } from 'flowbite-react';
import TopAlert from '../alert/TopAlert';
import BreadcrumbLite from '../breadcrumb-lite/BreadcrumbLite';
import DrawerNav from '../drawer-nav/DrawerNav';
import NavbarInputNew from './NavbarInputNew';

export default async function NavBar() {
  let { data } = await supabaseServer().auth.getUser();
  let component = !data.user?.email ? (
    <Link href={'/login'} passHref className='flex gap-2'>
      <Button color='gray'>Login</Button>
    </Link>
    
  ) : (
    <div className='flex gap-2'>
      <DrawerNav/>
    </div>
  )

  return (
    <div className='sticky top-0 z-[999]'>
      <nav className='w-full p-4 pb-0 flex bg-[#0D1636] text-white d-flex justify-between gap-3'>
        <NavbarInputNew/>
        {component}
      </nav>
      <TopAlert/>
      <BreadcrumbLite/>
    </div>
  )
}
