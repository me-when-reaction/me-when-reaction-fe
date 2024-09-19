"use client"

import React, { useRef } from 'react'
import { login } from '../../../app/(web)/login/action';
import { useFormState, useFormStatus } from 'react-dom';
import { Alert, Button, TextInput } from 'flowbite-react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import ErrorHelperText from '@/components/common/error-helper/ErrorHelperText';
import { toFormData } from '@/utilities/form';

export interface LoginForm {
  email: string,
  password: string,
}

const LoginFormSchema = yup.object<LoginForm>().shape({
  email: yup.string().required("Please fill the email").email("Invalid email"),
  password: yup.string().required("Password field is required")
});

export default function LoginFormPage() {
  const { register, handleSubmit, formState } = useForm<LoginForm>({ resolver: yupResolver<LoginForm>(LoginFormSchema), mode: 'onChange' });
  const [state, formAction] = useFormState(login, { message: "" });
  const ref = useRef<HTMLFormElement>(null);

  const handleOnSubmit: SubmitHandler<LoginForm> = (data) => {
    formAction(toFormData(data));
  }

  return (
    <div className='flex absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'>
      <form className='bg-indigo-800/40 p-5 flex flex-col gap-5 rounded-lg w-[70vw]' ref={ref} action={formAction} onSubmit={handleSubmit(handleOnSubmit)}>
        { state?.message &&
          <Alert color="failure">
            <span>{state?.message}</span>
          </Alert>
        }
        <p className='text-3xl font-bold'>Login</p>
        <div className='flex flex-col'>
          <label htmlFor="email" className='mb-2 text-lg font-bold'>Email</label>
          <TextInput type="email" {...register('email')} />
          <ErrorHelperText message={formState.errors.email?.message}/>
        </div>
        <div className='flex flex-col'>
          <label htmlFor="password" className='mb-2 text-lg font-bold'>Password</label>
          <TextInput type="password" {...register('password')} />
          <ErrorHelperText message={formState.errors.password?.message}/>
        </div>
        <SubmitButton />
      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button color={'success'} disabled={pending} type='submit'>Login</Button>
}