import React, { useState } from 'react'
import { login } from './action'
import { supabaseServer } from '@/utilities/supabase-server';
import { redirect } from 'next/navigation';
import LoginFormPage from './login-page';

async function checkLogin(){
  const supabase = supabaseServer();
  
  const { data } = await supabase.auth.getUser();
  if (data?.user) redirect('/');
}

export default function LoginPage() {

  checkLogin();

  return <LoginFormPage/>
}
