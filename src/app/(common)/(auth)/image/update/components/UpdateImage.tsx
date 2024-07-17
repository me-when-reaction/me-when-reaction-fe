'use client'

import { Button, Label, Select, Spinner, Textarea, TextInput } from 'flowbite-react'
import Image from 'next/image'
import React from 'react'
import * as yup from 'yup'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { HTTPRequestClient } from '@/apis/api-client';
import { API_ROUTE } from '@/apis/api-routes';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGlobalState } from '@/utilities/store';
import ErrorHelperText from '@/components/error-helper/ErrorHelperText';
import TagInput from '@/components/tag-input/TagInput';
import { GetImageResponse } from '@/models/response/image';
import { QUERY_KEYS } from '@/constants/query-key';

enum AgeRating {
  GENERAL,
  MATURE,
  EXPLICIT
}

interface UpdateImageForm {
  tags: string[],
  id: string,
  name: string,
  description: string,
  source: string,
  ageRating: AgeRating
}

const UpdateImageSchema = yup.object<UpdateImageForm>().shape({
  id: yup.string().required().uuid(),
  name: yup.string().required('Please gimme name 🥺'),
  description: yup.string().required('Context please'),
  tags: yup.array().of(yup.string().required())
    .required()
    .min(2, e => `Must be more than ${e.min} tags`),
  source: yup.string().required("Respect the creator, please :("),
  ageRating: yup.number().required().oneOf([AgeRating.GENERAL, AgeRating.MATURE, AgeRating.EXPLICIT])
});

export default function InsertImage() {
  const { register, handleSubmit, formState, control } = useForm<UpdateImageForm>({ resolver: yupResolver<UpdateImageForm>(UpdateImageSchema), mode: 'onChange' });
  const router = useRouter();
  const param = useSearchParams().get('id');
  const [setAlert, queryClient] = useGlobalState(s => [s.alert.setAlert, s.query.queryClient]);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: [param],
    queryFn: async() => {
      let d = await HTTPRequestClient<GetImageResponse, never>({
        url: API_ROUTE.IMAGE + `/${param}`,
        method: 'GET'
      });
      return d.data!;
    }
  });
  

  const {mutate, isPending, isSuccess: isMutationSuccess} = useMutation({
    mutationFn: async (data: UpdateImageForm) => {
      await HTTPRequestClient({
        url: API_ROUTE.IMAGE,
        method: 'PATCH',
        data: {...data, id: param}
      });
    },
    onSuccess: () => {
      setAlert('Thanks for correcting more info. Glad you can help tehe', 'success');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_IMAGES] });
      router.push('/');
    },
    onError: (e) => {
      setAlert(e.message, 'failure');
    }
  });

  const onSubmits: SubmitHandler<UpdateImageForm> = (data, e) => {
    e?.preventDefault();
    mutate(data);
  }

  if (isError) {
    setAlert("ID not found", 'failure');
    router.push('/');
    return (<></>);
  }

  if (isSuccess) return (
    <div className='w-full h-full flex justify-center items-center'>
      
      <form className='p-12 bg-slate-700 flex flex-col gap-4 w-full' onSubmit={handleSubmit(onSubmits)} encType='multipart/form-data'>
        <h1 className='text-2xl font-bold'>Update Image</h1>
        { !isLoading &&
          (
            <>
              <input type="hidden" {...register('id', { value: param ?? "" })} />
              <ErrorHelperText message={formState.errors.id?.message} />
              <div className='p-1 text-center flex justify-center border-2 border-slate-500/30 bg-slate-800/50'>
                <Image src={data.image} width="0" height="0" sizes='100%' className='w-auto h-auto max-h-[300px]' alt=""/>
              </div>
              <div>
                <Label htmlFor='name' value='Image Name'/>
                <TextInput id='name' {...register('name', { value: data.name })} placeholder='Give a meaningful name' color={formState.errors.name && 'failure'}/>
                <ErrorHelperText message={formState.errors.name?.message} />
              </div>
              <div>
                <Label htmlFor='source' value='Image Source'/>
                <TextInput id='source' {...register('source', { value: data.source })} placeholder='Sauce please' color={formState.errors.source && 'failure'}/>
                <ErrorHelperText message={formState.errors.source?.message} />
              </div>
              <div>
                <Label htmlFor='ageRating' value='Age Rating'/>
                <Select {...register('ageRating', { value: AgeRating[data.ageRating] })}>
                  {Object.keys(AgeRating).filter(k => !isNaN(Number(k))).map(k => (<option value={k} key={k}>{AgeRating[k as keyof typeof AgeRating]}</option>))}
                </Select>
                <ErrorHelperText message={formState.errors.ageRating?.message} />
              </div>
              <div>
                <Label htmlFor='description' value='Description'/>
                <Textarea id='description' rows={5} {...register('description', { value: data.description })} placeholder='Give your sauce here tehe' color={formState.errors.description && 'failure'} />
                <ErrorHelperText message={formState.errors.description?.message} />
              </div>
              <div>
                <Label value='Tags'/>
                <Controller
                  name="tags"
                  defaultValue={data.tags}
                  control={control}
                  render={({field}) => (<TagInput value={field.value} onChange={field.onChange} color={formState.errors.tags && 'failure'} />)}
                />
                <ErrorHelperText message={formState.errors.tags?.message} />
              </div>
              <div>
                <Button color={isPending ? 'gray': 'success'} type='submit' disabled={isPending || isMutationSuccess}>Submit</Button>
              </div>
            </>
          )
        }
        {
          isLoading &&
          (
            <>
              <Spinner size='xl'></Spinner>
            </>
          )
        }
      </form>
    </div>
  )
}
