'use client'

import { useGlobalState } from '@/utilities/store'
import React from 'react'

export interface ChipProps {
  text: string
}

export default function Chip(props: ChipProps) {

  const appendQuery = useGlobalState(x => x.search.appendQuery);

  function handleOnClick() { 
    appendQuery(props.text);
  }

  return (
    <div className='text-2xs p-1 rounded bg-slate-600 hover:bg-slate-700 hover:text-slate-300 transition-all text-white overflow-hidden cursor-pointer' onClick={handleOnClick}>
      {props.text}
    </div>
  )
}
