'use client'

import { useGlobalState } from '@/utilities/store'
import React from 'react'

export interface ChipProps {
  text: string
}

export default function Chip(props: ChipProps) {

  const [text, setText, setQuery] = useGlobalState(x => [x.search.text, x.search.setText, x.search.setQuery]);

  function handleOnClick() {
    let s = text.split(' ');
    s.push(props.text);
    s = s.filter((v, idx, arr) => v.length > 0 && arr.indexOf(v) === idx);
    setText(s.join(' '));
  }

  return (
    <div className='text-2xs p-1 rounded bg-orange-600 hover:bg-orange-700 transition-all text-white overflow-hidden cursor-pointer' onClick={handleOnClick}>
      {props.text}
    </div>
  )
}
