import { Combobox, ComboboxInput } from '@headlessui/react';
import classNames from 'classnames';
import _ from 'lodash';
import React, { ReactElement, useState } from 'react'
import { BsX } from 'react-icons/bs';
import { Key } from 'ts-key-enum';

export interface TagInputState {
  tag: string[],
  input: string,
  suggestions: () => string[],
}

export interface TagInputProps{
  value?: string[],
  onChange: (value: string[]) => void,
  color?: "info" | "failure" 
}

export default function TagInput(props: TagInputProps) {

  let [tag, setTag] = useState<string[]>(props.value ?? []);

  function handleOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
    // Tag baru
    // Space bakal diconvert ke _
    if ((e.key === Key.Enter || e.key === " ") && e.currentTarget.value.length > 0){
      e.preventDefault();
      let newValue = structuredClone(tag);
      if (!newValue.includes(e.currentTarget.value.trim().toLowerCase())) {
        newValue.push(e.currentTarget.value.trim().replace(' ', '_').toLowerCase());
        props.onChange(newValue);
      }
      e.currentTarget.value = "";
      setTag(newValue);
    }

    // Hapus tag terdepan
    else if (e.key === Key.Backspace && e.currentTarget.value.length === 0){
      setTag(tag.filter(a => a !== tag[tag.length - 1]))
      props.onChange(tag.filter(a => a !== tag[tag.length - 1]))
    }
  };

  function handleOnPasteTag(e : React.ClipboardEvent<HTMLInputElement>){
    e.stopPropagation();
    e.preventDefault();
    let paste = e.clipboardData.getData('Text').toLowerCase().split(' ').filter(x => x.length > 0);
    setTag(_.union(tag, paste))
    props.onChange(_.union(tag, paste));
  }

  function handleOnRemoveTag(name: string){
    setTag(tag.filter(a => a !== name));
    props.onChange(tag.filter(a => a !== name));
  }

  return (
    <div className={classNames('flex w-full items-center rounded-md border bg-gray-200 px-3 text-sm text-white dark:border-gray-600 dark:bg-gray-700 border-cyan-500 placeholder-cyan-700 focus-within:border-cyan-500 focus-within:ring-cyan-500 dark:focus-within:border-cyan-500 dark:focus-within:ring-cyan-500', {
      'border-red-500 bg-red-50 dark:text-red-900 dark:placeholder-red-700 dark:border-red-400 dark:bg-red-100 dark:focus-within:border-red-500 dark:focus-within:ring-red-500': props.color === 'failure'
    })}>
    <Combobox multiple value={tag}>
      <div className='flex gap-2 w-full p-1 overflow-x-scroll scrollbar-none'>
        {
          tag.map(q => (
            <TagInputChip key={q} label={q} onClick={() => handleOnRemoveTag(q)} color={props.color}/>
          ))
        }
        <ComboboxInput
          className="text-sm border-none bg-transparent p-1 outline-none focus:ring-0 flex-1 min-w-[40%]"
            onPaste={handleOnPasteTag}
            onKeyDown={handleOnKeyDown}
        />
      </div>
    </Combobox>
  </div>
  )
}

interface TagInputChipProps {
  label: string,
  color?: 'info' | 'failure'
  onClick: () => void
}

function TagInputChip(props : TagInputChipProps) {
  return (
    <div className={classNames('bg-slate-600 p-1 text-sm rounded-sm flex', {
      'dark:text-red-900 dark:bg-red-400': props.color === 'failure'
    })}>
      <span className={classNames('whitespace-nowrap')}>{props.label}</span>
      <div className='w-full h-full flex justify-center items-center cursor-pointer hover:text-white/50' onClick={_ => props.onClick()}><BsX className='text-xl'/></div>
    </div>
  )
}