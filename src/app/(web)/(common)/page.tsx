import React from 'react'
import { supabaseServer } from '@/utilities/supabase-server';
import { Metadata } from 'next';
import HomeMasonry from '@/components/app/dashboard/masonry/HomeMasonry';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Home - Me When Reaction",
    robots: "noindex, nofollow"
  }
}

export default async function HomePage() {
  const supabase = (await supabaseServer().auth.getUser())?.data?.user;

  return (
    <>
      <div className="h-32 w-full text-center align-middle">
        <div className='h-full flex justify-center items-center text-4xl max-md:text-2xl font-bold'>Welcome and feel free to steal</div>
      </div>
      <div className="image">
        <HomeMasonry isLogin={!!supabase}/>
      </div>
    </>
  )
}
