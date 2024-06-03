"use client"

import { BaseRequest } from "@/models/request/base";
import { BaseResponse } from "@/models/response/base";
import { supabaseClient } from "@/utilities/supabase-client";

export async function FetchClient<TResponse, TRequest extends Record<string, any> | never>(request: BaseRequest<TRequest>) : Promise<BaseResponse<TResponse>>{
  let supabase = await supabaseClient().auth.getSession();
  let token = supabase.data.session?.access_token
  const response = await(await fetch(
    request.url + (request.method === "GET" || request.method === "DELETE" ? new URLSearchParams(request.data ?? {}) : ""),
    {
    method: request.method,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: request.method !== "GET" && request.method !== "DELETE" ? JSON.stringify(request.data ?? {}) : null
  })).json() as BaseResponse<TResponse>;

  return response;
}