"use client"

import React, { useState } from 'react'
import { login } from './action';
import Input from '@/components/input/Input';
import Button from '@/components/button/Button';
import { useFormStatus } from 'react-dom';

interface LoginDetail {
  email: string, 
  password: string,
  isLoading: boolean,
}

export default function LoginFormPage() {
  const [detail, setDetail] = useState<LoginDetail>({ email: "doctorexpecia1718@gmail.com", password: "doctorexpecia1718", isLoading: false });
  const { pending } = useFormStatus()

  return (
    <div className='flex absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'>
      <form className='bg-indigo-800/40 p-5 flex flex-col gap-5 rounded-lg w-[70vw]'>
        <p className='text-3xl font-bold'>Login</p>
        <div className='flex flex-col'>
          <label htmlFor="email" className='mb-2 text-lg font-bold'>Email</label>
          <Input type="email" name="email" id="email" value={detail.email} onChange={e => setDetail({ ...detail, email: e.target.value })} />
        </div>
        <div className='flex flex-col'>
          <label htmlFor="password" className='mb-2 text-lg font-bold'>Password</label>
          <Input type="password" name="password" id="password" value={detail.password} onChange={e => setDetail({ ...detail, password: e.target.value })} />
        </div>
        <SubmitButton/>
      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return <Button buttonType='success' formAction={login} disabled={pending}>Login</Button>
}