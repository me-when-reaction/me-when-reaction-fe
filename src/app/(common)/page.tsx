import { supabaseServer } from '@/utilities/supabase-server'
import React from 'react'
import { Logout } from './action';
import HomeMasonry from '@/components/masonry/HomeMasonry';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function HomePage() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="hero">
        This is hero
      </div>
      <div className="image">
        <HomeMasonry/>
      </div>
    </HydrationBoundary>
  )
}
