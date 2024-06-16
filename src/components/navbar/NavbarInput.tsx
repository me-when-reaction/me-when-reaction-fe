"use client"

import React, { useState } from 'react'
import Input from '../input/Input'
import { useGlobalState } from '@/utilities/store'
import { Key } from 'ts-key-enum'
import { TextInput } from 'flowbite-react'

export default function NavbarInputClient() {
  
  const [text, setText, setQuery] = useGlobalState(s => [s.search.text, s.search.setText, s.search.setQuery])

  return (
    <TextInput
      className='w-full'
      value={text}
      onChange={e => setText(e.target.value)}
      placeholder='Put your tags here'
      onKeyUp={e => {
        if (e.key === Key.Enter) setQuery(text);
      }}
    />
  )
}
