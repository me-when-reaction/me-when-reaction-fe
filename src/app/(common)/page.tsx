'use client'

import React from 'react'
import HomeMasonry from '@/components/masonry/HomeMasonry';
import { useSearchParams } from 'next/navigation';

export default function HomePage() {

  const params = useSearchParams().get('query') ?? "";
  return (
    <>
      <div className="h-32 w-full text-center align-middle">
        <div className='h-full flex justify-center items-center text-4xl font-bold'>Welcome and feel free to steal</div>
      </div>
      <div className="image">
        <HomeMasonry query={params}/>
      </div>
    </>
  )
}