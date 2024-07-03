import NavBar from '@/components/navbar/NavBar';
import React from 'react'
import QueryClientComponent from './query-client-component';
import { QueryClient } from '@tanstack/react-query';
import BreadcrumbLite from '@/components/breadcrumb-lite/BreadcrumbLite';

export default async function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[100svh]">
      <NavBar />
      <div className='flex-grow h-full min-h-full'>
        <QueryClientComponent>
          {children}
        </QueryClientComponent>
      </div>
    </div>
  )
}
