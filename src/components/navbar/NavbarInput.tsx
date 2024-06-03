"use client"

import React, { useState } from 'react'
import Input from '../input/Input'
import { useGlobalState } from '@/utilities/store'
import { Key } from 'ts-key-enum'

export default function NavbarInputClient() {
  
  const setInput = useGlobalState(s => s.setSearch)
  const [tempInput, setTempInput] = useState("");

  return (
    <Input type="text"
      className='w-full'
      value={tempInput}
      onChange={e => setTempInput(e.target.value)}
      placeholder='Put your tags here'
      onKeyUp={e => {
        if (e.key === Key.Enter) setInput(tempInput);
      }}
    />
  )
}
