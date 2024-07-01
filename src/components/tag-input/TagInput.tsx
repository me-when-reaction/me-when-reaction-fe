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
  let [focus, setFocus] = useState<boolean>(false);

  function handleOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
    // Tag baru
    // Space bakal diconvert ke _
    if ((e.key === Key.Enter || e.key === " ") && e.currentTarget.value.length > 0){
      e.preventDefault();
      let newValue = structuredClone(tag);
      if (!newValue.includes(e.currentTarget.value.trim())) {
        newValue.push(e.currentTarget.value.trim().replace(' ', '_'));
        e.currentTarget.value = "";
        props.onChange(newValue);
      }
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
    let paste = e.clipboardData.getData('Text').split(' ').filter(x => x.length > 0);
    setTag(_.union(tag, paste))
    props.onChange(_.union(tag, paste));
  }

  function handleOnRemoveTag(name: string){
    setTag(tag.filter(a => a !== name));
    props.onChange(tag.filter(a => a !== name));
  }

  return (
    <div className={classNames(
      'bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white',
      'inline-flex gap-2 h-auto flex-wrap w-full',
      {'border-gray-300 dark:border-gray-600' : !focus},
      {'ring-cyan-500 border-cyan-500 dark:ring-cyan-500 dark:border-cyan-500' : focus},
      {'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500': props.color === 'failure'}
    )}>
      {/* Naruh tag */}
      {
        tag.map(x => 
          <div className='bg-slate-600 p-1 text-sm rounded-sm flex' key={x}>
            <span className='whitespace-nowrap'>{x}</span>
            <div className='w-full h-full flex justify-center items-center cursor-pointer hover:text-white/50' onClick={_ => handleOnRemoveTag(x)}><BsX className='text-xl'/></div>
          </div>
        )
      }

      {/* Naruh textfield */}
      <input type="text"
        className={classNames(
          'border-none focus:border-none focus:outline-none rounded-none focus:ring-0 outline-none text-sm block bg-transparent float-none p-1 flex-grow',
          { 'dark:placeholder-gray-400 dark:text-white text-gray-900' : props.color !== 'failure' },
          {'placeholder-red-700 text-red-900 dark:placeholder-red-700 dark:text-red-900 dark:caret-black': props.color === 'failure'}
        )}
        onFocus={_ => {setFocus(true)}}
        onBlur={_ => {setFocus(false)}}
        onPaste={handleOnPasteTag}
        onKeyDown={handleOnKeyDown}
        placeholder='Use enter key to add tag. You can also paste space-separated tags'
      />
    </div>
  ) as ReactElement
}