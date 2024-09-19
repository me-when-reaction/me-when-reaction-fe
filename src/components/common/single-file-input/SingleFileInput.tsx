import { FileInput, FileInputProps } from 'flowbite-react'
import React from 'react'

export type SingleFileInputProps =  Omit<FileInputProps, 'onChange'> & {
  onChange: (file?: File) => void
};

export default function SingleFileInput(props: SingleFileInputProps) {
  return (
    <FileInput {...props} onChange={e => {
      const file = e.currentTarget.files?.[0];
      props.onChange(file);
    }}/>
  )
}
