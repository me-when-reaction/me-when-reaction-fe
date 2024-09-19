"use server"

import React from 'react'
import { supabaseServer } from '@/utilities/supabase-server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import LoginFormPage from '@/components/app/login/LoginForm';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login- Me When Reaction",
    robots: "noindex, nofollow"
  }
}

async function checkLogin() {
  const supabase = supabaseServer();

  const { data } = await supabase.auth.getUser();
  if (data?.user) redirect('/');
}

export default async function LoginPage() {
  await checkLogin();
  return <LoginFormPage />
}
