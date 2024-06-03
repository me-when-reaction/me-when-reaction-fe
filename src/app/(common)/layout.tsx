import NavBar from '@/components/navbar/NavBar';
import React from 'react'
import Submenu from './submenu';

export default async function PageLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <NavBar/>
      <Submenu>
        {children}
      </Submenu>
    </>
  )
}
