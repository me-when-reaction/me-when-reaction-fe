import { Spinner } from 'flowbite-react'
import React from 'react'

export default function LoadingPage() {
  return (
    <div className='w-full h-[100svh] flex flex-col justify-center items-center gap-4'>
      <Spinner size='xl'/>
      <p>Loading...</p>
    </div>
  )
}
