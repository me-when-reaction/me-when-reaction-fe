"use client"

import React, { useEffect, useState } from 'react'
import { useGlobalState } from '@/utilities/store'
import { Key } from 'ts-key-enum'
import { TextInput } from 'flowbite-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function NavbarInputClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const [text, setText, setQuery] = useGlobalState(s => [s.search.text, s.search.setText, s.search.setQuery])

  useEffect(() => {
    let q = searchParams.get('query');
    if (q !== null && q.length > 0) setQuery(q);
  });

  const onKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === Key.Enter) {
      setQuery(text)
      let q = new URLSearchParams({ query: text });
      if (pathname !== '/') router.push('/?' + q);
    };
  }

  return (
    <TextInput
      className='w-full'
      value={text}
      onChange={e => setText(e.target.value)}
      placeholder='Put your tags here'
      onKeyUp={onKeyEnter}
    />
  )
}
