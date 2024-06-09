"use server"

import { supabaseServer } from "@/utilities/supabase-server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = supabaseServer();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) return {
    message : "Failed :("
  }

  revalidatePath('/(common)');
  redirect('/');
} 