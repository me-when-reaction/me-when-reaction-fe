import { FileInput, FileInputProps } from 'flowbite-react'
import React from 'react'

export type SingleFileInputProps =  Omit<FileInputProps, 'onChange'> & {
  onChange: (file?: File) => void,
  plain?: boolean
};

export default function SingleFileInput(props: SingleFileInputProps) {
  if (!props.plain) return (
    <FileInput {...props} onChange={e => {
      const file = e.currentTarget.files?.[0];
      props.onChange(file);
    }}/>
  )

  return (
    <input type='file' className={props.className} onChange={e => {
      const file = e.currentTarget.files?.[0];
      props.onChange(file);
    }}/>
  )
}
