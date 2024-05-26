"use client"

import React, { useState } from 'react'
import { login } from './action';

interface LoginDetail {
  email: string, 
  password: string,
  isLoading: boolean,
}

export default function LoginFormPage() {
  const [detail, setDetail] = useState<LoginDetail>({ email: "", password: "", isLoading: false });

  return (
    <form className='bg-yellow-800'>
      <div className='flex'>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" value={detail.email} onChange={e => setDetail({ ...detail, email: e.target.value })} className='text-black' />
      </div>
      <div className='flex'>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" value={detail.password} onChange={e => setDetail({ ...detail, password: e.target.value })} className='text-black' />
      </div>
      <button formAction={login} disabled={detail.isLoading}>Login</button>
    </form>
  )
}
