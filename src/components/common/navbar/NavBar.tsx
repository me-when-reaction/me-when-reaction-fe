import React from 'react'
import { supabaseServer } from '@/utilities/supabase-server';
import TopAlert from '../alert/TopAlert';
import BreadcrumbLite from '../breadcrumb-lite/BreadcrumbLite';
import DrawerNav from '../drawer-nav/DrawerNav';
import NavbarInput from './NavbarInput';

export default async function NavBar() {
  let { data } = await supabaseServer().auth.getUser();
  return (
    <div className='sticky top-0 z-[999]'>
      <nav className='w-full p-4 pb-0 flex bg-[#0D1636] text-white d-flex justify-between gap-3'>
        <NavbarInput/>
        <DrawerNav isLogin={!!data.user?.email}/>
      </nav>
      <TopAlert/>
      <BreadcrumbLite/>
    </div>
  )
}
