'use client'

import { Button, Label, Select, Textarea, TextInput } from 'flowbite-react'
import { produce } from 'immer';
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { HTTPRequestClient } from '@/utilities/api-client';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '@/utilities/store';
import { QUERY_KEYS } from '@/constants/query-key';
import ErrorHelperText from '@/components/common/error-helper/ErrorHelperText';
import TagInput from '@/components/common/tag-input/TagInput';
import { InsertImageRequest, InsertImageRequestSchema } from '@/models/request/image';
import HTTPMethod from 'http-method-enum';
import { API_DETAIL } from '@/configuration/api';
import ImageResizer from './ImageResizer';

interface InsertImageState {
  imagePreview: string,
  tags: string[]
}

enum AgeRating {
  GENERAL,
  MATURE,
  EXPLICIT
}

export default function InsertImage() {
  const { register, handleSubmit, formState, control, trigger } = useForm<InsertImageRequest>({ resolver: zodResolver(InsertImageRequestSchema), mode: 'onChange' });
  const router = useRouter();
  const [state, setState] = useState<InsertImageState>({
    imagePreview: "",
    tags: []
  });
  const [setAlert, queryClient] = useGlobalState(s => [s.alert.setAlert, s.query.queryClient]);

  const mutation = useMutation({
    mutationFn: async (data: InsertImageRequest) => {
      await HTTPRequestClient({
        url: API_DETAIL.IMAGE.route,
        method: HTTPMethod.POST,
        data: data
      });
    },
    onSuccess: () => {
      setAlert('Thanks for adding new reaction :D', 'success');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_IMAGES] });
      router.push('/');
    },
    onError: (e) => {
      setAlert(e.message, 'failure');
    }
  });

  // Agar jalan dulu validasinya pas pertama kali masuk
  useEffect(() => {
    trigger();
  }, [trigger]);

  function handleOnInsertImage(file?: File) {
    setState(produce(state, draft => {
      draft.imagePreview = file ? URL.createObjectURL(file) : "";
    }));
  }

  const onSubmits: SubmitHandler<InsertImageRequest> = (data, e) => {
    e?.preventDefault();
    mutation.mutate(data);
  }

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <form className='p-12 bg-slate-700 flex flex-col gap-4 w-full' onSubmit={handleSubmit(onSubmits)} encType='multipart/form-data'>
        <h1 className='text-2xl font-bold'>Insert Image</h1>
        <div>
          <Controller
            name='image'
            control={control}
            render={({ field }) => (<ImageResizer value={field.value} onChange={f => {
              handleOnInsertImage(f);
              field.onChange(f);
            }}/>)}
          />
          <ErrorHelperText message={formState.errors.image?.message} />
        </div>
        <div>
          <Label htmlFor='name' value='Image Name' />
          <TextInput id='name' {...register('name')} placeholder='Give a meaningful name' color={formState.errors.name && 'failure'} />
          <ErrorHelperText message={formState.errors.name?.message} />
        </div>
        <div>
          <Label htmlFor='source' value='Image Source' />
          <TextInput id='source' {...register('source')} placeholder='Sauce please' color={formState.errors.source && 'failure'} />
          <ErrorHelperText message={formState.errors.source?.message} />
        </div>
        <div>
          <Label htmlFor='ageRating' value='Age Rating' />
          <Select {...register('ageRating')}>
            {Object.keys(AgeRating).filter(k => !isNaN(Number(k))).map(k => (<option value={k} key={k}>{AgeRating[k as keyof typeof AgeRating]}</option>))}
          </Select>
          <ErrorHelperText message={formState.errors.ageRating?.message} />
        </div>
        <div>
          <Label htmlFor='description' value='Description' />
          <Textarea id='description' rows={5} {...register('description')} placeholder='Translate pls if not ENG' color={formState.errors.description && 'failure'} />
          <ErrorHelperText message={formState.errors.description?.message} />
        </div>
        <div>
          <Label value='Tags' />
          <Controller
            name="tags"
            defaultValue={[]}
            control={control}
            render={({ field }) => (<TagInput value={field.value} onChange={field.onChange} color={formState.errors.tags && 'failure'} />)}
          />
          <ErrorHelperText message={formState.errors.tags?.message} />
        </div>
        <div>
          <Button color='success' type='submit' disabled={mutation.isPending || mutation.isSuccess}>Submit</Button>
        </div>
      </form>
    </div>
  )
}
