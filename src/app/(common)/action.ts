"use server"

import { supabaseServer } from "@/utilities/supabase-server";
import { redirect } from "next/navigation";

export async function Logout(){
  const supabase = supabaseServer();

  await supabase.auth.signOut();
  redirect('/login');
}

export async function Insert(){
  redirect('/insert');
}