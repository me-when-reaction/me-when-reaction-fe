'use client'

import { Button, FileInput, Label, Textarea, TextInput } from 'flowbite-react'
import { produce } from 'immer';
import Image from 'next/image'
import React, { useState } from 'react'
import TagInput from '../tag-input/TagInput';
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface InsertImageState {
  imagePreview: string,
  tags: string[]
}

const insertImageSchema = yup.object({
  image: yup.mixed<FileList>().required().test('fileSize', 'File too large', (value) => {
    return value && value[0] && value[0].size <= 1024 * 504
  }),
  name: yup.string().required(),
  description: yup.string().required(),
  tags: yup.array().of(yup.string().required()).required().min(2, e => `Must be more than ${e} tags`)
})

export default function InsertImage() {

  const { register, handleSubmit, formState, control } = useForm({ resolver: yupResolver(insertImageSchema) });

  // const mutate = useMutation({
  //   mutationKey: ["image"],
  //   mutationFn: () => {
  //     let form = new FormData();
  //   }
  // })

  const [state, setState] = useState<InsertImageState>({
    imagePreview: "",
    tags: []
  });

  function handleOnInsertImage(e : React.ChangeEvent<HTMLInputElement>){
    let file = e.target.files?.item(0);
    if (!file || !['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type ?? '')) return;
    setState(produce(state, draft => {
      draft.imagePreview = URL.createObjectURL(file)
    }));
  }

  return (
    <div className='w-full'>
      <form action="" className='p-2 w-2/3 bg-slate-700 flex flex-col gap-4'>
        <div className='p-1 text-center flex justify-center border-2 border-slate-500/30 bg-slate-800/50'>
          {(state.imagePreview && state.imagePreview.length > 0) && <Image src={state.imagePreview} width="0" height="0" sizes='100%' className='w-auto h-auto max-h-[300px]' alt=""/>}
        </div>
        <div>
          <Label htmlFor='image' value='Image' className='font'/>
          <FileInput id='image' accept='image/*' {...register('image', {
            onChange: (e) => handleOnInsertImage(e)
          })}/>
        </div>
        <div>
          <Label htmlFor='name' value='Image Name'/>
          <TextInput id='name' {...register('name')}/>
        </div>
        <div>
          <Label htmlFor='description' value='Description'/>
          <Textarea id='description' rows={5} {...register('description')}/>
        </div>
        <div>
          <Label value='Tags'/>
          <Controller
            name='tags'
            control={control}
            render={({field}) => (
              <TagInput {...field} />
            )}
          >
          { formState.errors.tags && <p>{formState.errors.tags.message}</p> }

          </Controller>
        </div>
        <div>
          <Button color='success'>Submit</Button>
        </div>
      </form>
    </div>
  )
}
