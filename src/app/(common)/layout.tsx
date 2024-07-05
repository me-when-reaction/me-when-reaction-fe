import NavBar from '@/components/navbar/NavBar';
import React from 'react'
import QueryWrapper from './components/query-wrapper/query-client-component';

export default async function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[100svh]">
      <NavBar />
      <div className='flex-grow h-full min-h-full'>
        <QueryWrapper>
          {children}
        </QueryWrapper>
      </div>
    </div>
  )
}
