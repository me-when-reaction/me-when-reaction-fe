"use server"

import { supabaseServer } from "@/utilities/supabase-server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from 'yup'
import { FormError } from "@/models/errors/FormError";

interface LoginData {
  email: string,
  password: string
}

const LoginDataSchema = yup.object<LoginData>().shape({
  email: yup.string().required("Please fill the email").email("Invalid email"),
  password: yup.string().required("Password field is required")
});

export async function login(_: FormError, formData: FormData) {
  const supabase = supabaseServer();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  try { await LoginDataSchema.validate(data); }
  catch(e)
  {
    if (e instanceof yup.ValidationError) return { message: e.errors[0] } as FormError;
  }

  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) return { message : "Email invalid or invalid password 😔" } as FormError

  revalidatePath('/(common)');
  redirect('/');
} 