"use server"

import React from 'react'
import { supabaseServer } from '@/utilities/supabase-server';
import { redirect } from 'next/navigation';
import LoginFormPage from './login-page';

async function checkLogin(){
  const supabase = supabaseServer();
  
  const { data } = await supabase.auth.getUser();
  if (data?.user) redirect('/');
}

export default async function LoginPage() {
  await checkLogin();
  return <LoginFormPage/>
}
