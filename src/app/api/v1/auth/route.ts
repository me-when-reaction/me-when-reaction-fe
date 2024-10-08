import { AuthRequestSchema } from "@/models/request/auth";
import { dataResponse, handleDataValidation, unauthorizedResponse } from "@/utilities/api";
import { supabaseServer } from "@/utilities/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import StatusCode from "status-code-enum";

export async function POST(request: NextRequest){
  return await handleDataValidation(request, AuthRequestSchema, async (data) => {
    const client = supabaseServer();
    const { data: tokenData, error } = await client.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    if (error) return unauthorizedResponse("Invalid email or password");
    return dataResponse({
      data: tokenData.session?.access_token
    });
  });
}