'use client'

import { Button, FileInput, Label, Select, Textarea, TextInput } from 'flowbite-react'
import { produce } from 'immer';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { HTTPRequestClient } from '@/apis/api-client';
import { API_ROUTE } from '@/apis/api-routes';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '@/utilities/store';
import { QUERY_KEYS } from '@/constants/query-key';
import ErrorHelperText from '@/components/common/error-helper/ErrorHelperText';
import TagInput from '@/components/common/tag-input/TagInput';

interface InsertImageState {
  imagePreview: string,
  tags: string[]
}

enum AgeRating {
  GENERAL,
  MATURE,
  EXPLICIT
}

interface InsertImageForm {
  tags: string[],
  image: FileList | File,
  name: string,
  description: string,
  source: string,
  ageRating: AgeRating
}

const insertImageSchema = yup.object<InsertImageForm>().shape({
  image: yup.mixed<FileList>()
    .required("File is required")
    .test('image', 'Image is required, duh', (v) => {
      return !!v &&
        !!v[0] &&
        ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(v[0].type ?? '')
    })
    .test('fileSize', 'File too large. Must be 20KB or smaller', (value) => {
      return value && value[0] && value[0].size <= 1024 * 20
    }),
  name: yup.string().required('Please gimme name 🥺'),
  description: yup.string().required('Context please'),
  tags: yup.array().of(yup.string().required())
    .required()
    .min(2, e => `Must be more than ${e.min} tags`),
  source: yup.string().required("Respect the creator, please :("),
  ageRating: yup.number().required().oneOf([AgeRating.GENERAL, AgeRating.MATURE, AgeRating.EXPLICIT])
});

export default function InsertImage() {
  const { register, handleSubmit, formState, control, trigger } = useForm<InsertImageForm>({ resolver: yupResolver<InsertImageForm>(insertImageSchema), mode: 'onChange' });
  const router = useRouter();
  const [state, setState] = useState<InsertImageState>({
    imagePreview: "",
    tags: []
  });
  const [setAlert, queryClient] = useGlobalState(s => [s.alert.setAlert, s.query.queryClient]);

  const mutation = useMutation({
    mutationFn: async (data: InsertImageForm) => {
      await HTTPRequestClient({
        url: API_ROUTE.IMAGE,
        method: 'POST',
        data: { ...data, image: (data.image as FileList)[0] }
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

  function handleOnInsertImage(e: React.ChangeEvent<HTMLInputElement>) {
    let file = e.target.files?.item(0);
    if (!file || !['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type ?? '')) {
      setState(produce(state, draft => {
        draft.imagePreview = ""
      }));
      return;
    }
    setState(produce(state, draft => {
      draft.imagePreview = URL.createObjectURL(file)
    }));
  }

  const onSubmits: SubmitHandler<InsertImageForm> = (data, e) => {
    e?.preventDefault();
    mutation.mutate(data);
  }

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <form className='p-12 bg-slate-700 flex flex-col gap-4 w-full' onSubmit={handleSubmit(onSubmits)} encType='multipart/form-data'>
        <h1 className='text-2xl font-bold'>Insert Image</h1>
        {(state.imagePreview && state.imagePreview.length > 0) &&
          <div className='p-1 text-center flex justify-center border-2 border-slate-500/30 bg-slate-800/50'>
            <Image src={state.imagePreview} width="0" height="0" sizes='100%' className='w-auto h-auto max-h-[300px]' alt="" />
          </div>
        }
        <div>
          <Label htmlFor='image' value='Image' className='font' />
          <FileInput id='image' accept='image/*' {...register('image', {
            onChange: handleOnInsertImage
          })} color={formState.errors.image && 'failure'} />
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
