'use client'

import React, { useState } from 'react'
import { Combobox, ComboboxInput } from '@headlessui/react'
import { BsX } from 'react-icons/bs'
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useGlobalState } from '@/utilities/store';
import { produce } from 'immer';
import { Key } from 'ts-key-enum';

export default function NavbarInputNew() {
  const [text, setText] = useState("");
  const [query, appendQuery, popQuery, removeQuery, queryClient] = useGlobalState(s => [s.newSearch.query, s.newSearch.appendQuery, s.newSearch.popQuery, s.newSearch.removeQuery, s.query.queryClient]);

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === Key.Enter || e.key === " ") && e.currentTarget.value.length > 0) {
      e.preventDefault();
      appendQuery(e.currentTarget.value.trim().toLowerCase());
      e.currentTarget.value = "";
    }

    // Hapus tag terdepan
    else if (e.key === Key.Backspace && e.currentTarget.value.length === 0) popQuery();
  }

  return (
    <div className='flex w-full items-center rounded-md border bg-gray-200 px-3 text-sm text-white dark:border-gray-600 dark:bg-gray-700 border-cyan-500 placeholder-cyan-700 focus-within:border-cyan-500 focus-within:ring-cyan-500 dark:focus-within:border-cyan-500 dark:focus-within:ring-cyan-500'>
      <Combobox multiple value={query}>
        <div className='flex gap-2 w-full p-1 overflow-x-scroll scrollbar-none'>
          {
            query.map(q => (
              <NavbarInputNewChip key={q} label={q} onClick={() => removeQuery(q)}/>
            ))
          }
          <ComboboxInput
            className="text-sm border-none bg-transparent p-1 outline-none focus:ring-0 flex-1 min-w-[40%]"
            onKeyDown={onKeyPress}
          />
        </div>
      </Combobox>
    </div>
  )
}

interface NavbarInputNewChipProps {
  label: string,
  onClick: () => void
}

function NavbarInputNewChip(props : NavbarInputNewChipProps) {
  return (
    <div className='bg-slate-600 p-1 text-sm rounded-sm flex'>
      <span className='whitespace-nowrap'>{props.label}</span>
      <div className='w-full h-full flex justify-center items-center cursor-pointer hover:text-white/50' onClick={_ => props.onClick()}><BsX className='text-xl'/></div>
    </div>
  )
}