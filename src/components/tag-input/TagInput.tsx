import classNames from 'classnames';
import { produce } from 'immer';
import React, { ReactElement, useState } from 'react'
import { RefCallBack, UseControllerProps } from 'react-hook-form';
import { BsX } from 'react-icons/bs';
import { Key } from 'ts-key-enum';

export interface TagInputState {
  tag: string[],
  input: string,
  suggestions: () => string[],
}

export interface TagInputProps extends UseControllerProps<string[]> {

}

export default function TagInput(props: TagInputProps) {

  let [tag, setTag] = useState<string[]>(props.value);
  let [focus, setFocus] = useState<boolean>(false);

  function handleOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
    // Tag baru
    if (e.key === Key.Enter && e.currentTarget.value.length > 0){
      console.log(e.currentTarget.value);
      setTag(produce(tag, d => { 
        if (!d.includes(e.currentTarget.value.trim())) {
          d.push(e.currentTarget.value.trim());
          e.currentTarget.value = "";
        }})
      )
    }

    // Hapus tag terdepan
    else if (e.key === Key.Backspace && e.currentTarget.value.length === 0){
      setTag(produce(tag, d => { d.pop(); }))
    }
  };

  function handleOnRemoveTag(name: string){
    console.log(name);
    setTag(produce(tag, dr => dr.filter(a => a !== name)))
  }

  return (
    <div className={classNames(
      'bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white',
      'inline-flex gap-2 h-auto flex-wrap w-full',
      {'border-gray-300 dark:border-gray-600' : !focus},
      {'ring-cyan-500 border-cyan-500 dark:ring-cyan-500 dark:border-cyan-500' : focus}
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
        className='border-none focus:border-none focus:outline-none rounded-none focus:ring-0 outline-none text-gray-900 text-sm block bg-transparent dark:placeholder-gray-400 dark:text-white float-none p-1 flex-grow'
        onFocus={_ => {setFocus(true)}}
        onBlur={_ => {setFocus(false)}}
        onKeyDown={handleOnKeyDown}
        placeholder='Use enter key to add tag'
      />
    </div>
  ) as ReactElement
}