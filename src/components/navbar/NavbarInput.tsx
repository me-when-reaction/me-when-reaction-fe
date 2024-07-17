"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useGlobalState } from '@/utilities/store'
import { Key } from 'ts-key-enum'
import { Button, TextInput } from 'flowbite-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BsSearch } from 'react-icons/bs'
import { current, produce } from 'immer'
import classNames from 'classnames'
import QueryWrapper from '@/app/(common)/components/query-wrapper/query-client-component'
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

export default function NavbarInputClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [suggest, setSuggest] = useState<Suggestion>(initSuggestion);
  const [text, setText, setQuery] = useGlobalState(s => [s.search.text, s.search.setText, s.search.setQuery])
  const textRef = useRef<HTMLInputElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  useOutsideClick(inputAreaRef, () => {
    setSuggest(produce(x => {
      x.filtered = [];
      x.index = 0;
    }));
  });

  useEffect(() => {
    let q = searchParams.get('query');
    if (q !== null && q.length > 0) {
      setQuery(q);
      setText(q);
    }
  }, [setQuery, setText, searchParams]);

  const appendSuggestion = (sug: string) => {
    // Ambil suggestion yang sekarang (minus yang paling belakang karena hasil ketik)
    let inp = text.split(' ').slice(0, -1);

    // Append dan focus ke textbox lagi
    inp.push(sug);
    setText(inp.join(" ") + " ");
    setSuggest(initSuggestion);
    textRef.current?.focus();
  }

  // Apply query dan lakukan search
  const applyQuery = () => {
    setQuery(text.trim())
    let q = new URLSearchParams({ query: text.trim() });
    router.push('/?' + q);
  }

  const onInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    let lastInput = input.split(' ').at(-1) ?? "";
    let currentTags = text.split(' ');
    if (lastInput.length >= 3) {
      HTTPRequestClient<GetTagSuggestionResponse[], { query: string }>({
        method: "GET",
        url: `${API_ROUTE.TAG}/search`,
        data: {
          query: lastInput
        }
      }).then(res => {
        setSuggest(produce(x => {
          x.input = lastInput;
          x.filtered = res.data.filter(x => !currentTags.includes(x.name)).map(x => ({ label: x.nameCount, value: x.name }));
          x.index = 0;
        }));
      });
    }
    else {
      setSuggest(produce(x => {
        x.input = lastInput;
        x.filtered = []
        x.index = 0;
      }));
    }
    setText(input);
  }

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === Key.Enter && suggest.filtered.length <= 0) applyQuery();
    else if (e.key === Key.Enter && suggest.filtered.length > 0) {
      appendSuggestion(suggest.filtered[suggest.index].value);
    }
    else if (e.key === Key.ArrowUp) {
      setSuggest(produce(x => {
        x.index = mod(x.index - 1, x.filtered.length);
      }));
    }
    else if (e.key === Key.ArrowDown) {
      setSuggest(produce(x => {
        x.index = mod(x.index + 1, x.filtered.length);
      }));
    }
  }

  return (
    <div className='flex w-full' ref={inputAreaRef}>
      <div className='relative w-full flex-1'>
        <TextInput
          ref={textRef}
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
        { (suggest.input.length > 0 && suggest.filtered.length > 0) &&
          <div className='absolute left-0 bg-gray-700 w-full rounded-md'>
            <ul className='p-1'>
              {suggest.filtered.map((x, idx) => (
                <li key={x.value} className={classNames('hover:bg-gray-600 p-1 rounded-md cursor-pointer', {
                  'bg-gray-500 hover:bg-gray-500': idx === suggest.index
                })} onClick={() => appendSuggestion(x.value)}>{x.label}</li>
              ))}
            </ul>
          </div>
        }
      </div>
      <Button className='flex items-center flex-grow-0 rounded-tl-none rounded-bl-none' onClick={applyQuery}><BsSearch/></Button>
    </div>
  )
}
