"use server"

import { supabaseServer } from "@/utilities/supabase-server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormError } from "@/models/errors/FormError";
import { ZodError } from "zod";
import { AuthRequestSchema } from "@/models/request/auth";

export async function login(_: FormError, formData: FormData) {
  const supabase = supabaseServer();
  try {
    const data = await AuthRequestSchema.parseAsync({
      email: formData.get("email"),
      password: formData.get("password")
    });
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) return { message : "Email invalid or invalid password 😔" } as FormError
  }
  catch(e)
  {
    if (e instanceof ZodError) return { message: e.issues[0].message } as FormError;
  }

  revalidatePath('/(common)');
  redirect('/');
} 