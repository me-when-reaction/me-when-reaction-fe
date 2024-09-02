"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useGlobalState } from '@/utilities/store'
import { Key } from 'ts-key-enum'
import { Button, TextInput } from 'flowbite-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BsSearch } from 'react-icons/bs'
import { current, produce } from 'immer'
import classNames from 'classnames'
import QueryWrapper from '@/components/common/query-wrapper/query-client-component'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { HTTPRequestClient } from '@/apis/api-client'
import { API_ROUTE } from '@/apis/api-routes'
import { GetTagSuggestionResponse } from '@/models/response/tag'
import { useReducedMotion } from '@react-spring/web'
import { useOutsideClick } from '@/hooks/hooks'

const TEXT: string[] = [
  "auto",
  "tridia",
  "nothing",
  "wow"
];

interface Suggestion {
  index: number,
  filtered: {label: string, value: string}[],
  input: string
}

const initSuggestion : Suggestion = {
  index: 0,
  filtered: [],
  input: ""
}

function mod(up: number, down: number) {
  return ((up % down) + down) % down
}

export default function NavbarInputPlainClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText, setQuery] = useGlobalState(s => [s.search.text, s.search.setText, s.search.setQuery])

  useEffect(() => {
    let q = searchParams.get('query');
    if (q !== null && q.length > 0) {
      setQuery(q);
      setText(q);
    }
  }, [setQuery, setText, searchParams]);

  // Apply query dan lakukan search
  const applyQuery = () => {
    setQuery(text.trim())
    let q = new URLSearchParams({ query: text.trim() });
    router.push('/?' + q);
  }

  const onInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    setText(input);
  }

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === Key.Enter) applyQuery();
  }

  return (
    <div className='flex w-full'>
      <div className='relative w-full flex-1'>
        <TextInput
          className='w-full rounded-tr-none rounded-br-none'
          value={text}
          onChange={onInputText}
          placeholder='Put your tags here'
          onKeyUp={onKeyPress}
          style={{
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
          }}

        />
      </div>
      <Button className='flex items-center flex-grow-0 rounded-tl-none rounded-bl-none' onClick={applyQuery}><BsSearch/></Button>
    </div>
  )
}
