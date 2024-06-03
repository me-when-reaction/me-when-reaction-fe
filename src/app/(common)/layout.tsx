import NavBar from '@/components/navbar/NavBar';
import React from 'react'
import Submenu from './submenu';
import { dehydrate, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default async function PageLayout({children}: {children: React.ReactNode}) {
  const queryClient = new QueryClient();

  return (
    <>
      <NavBar/>
      <Submenu>
        {children}
      </Submenu>
    </>
  )
}
