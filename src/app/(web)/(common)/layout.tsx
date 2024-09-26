import NavBar from '@/components/common/navbar/NavBar';
import QueryWrapper from '@/components/common/query-wrapper/query-client-component';
import React from 'react'

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
