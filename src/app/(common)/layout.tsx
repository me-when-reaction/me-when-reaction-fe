import NavBar from '@/components/navbar/NavBar';
import React from 'react'
import Submenu from './submenu';
import { dehydrate, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default async function PageLayout({children}: {children: React.ReactNode}) {
  const queryClient = new QueryClient();

  return (
    <div className="flex flex-col min-h-[100svh]">
      <NavBar/>
      <div className='flex-grow h-full min-h-full'>
        <Submenu>
          {children}
        </Submenu>
      </div>
    </div>
  )
}
