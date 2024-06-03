import { supabaseServer } from '@/utilities/supabase-server';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function AuthLayout({children}: {children: React.ReactNode}) {
  const supabase = supabaseServer();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) redirect('/login');
  
  return (
    <div>{children}</div>
  );
}
