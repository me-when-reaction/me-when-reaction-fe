"use client"

import { RequestError } from "@/models/errors/RequestError";
import { BaseRequest } from "@/models/request/base";
import { BaseResponse } from "@/models/response/base";
import { toFormData } from "@/utilities/form";
import { supabaseClient } from "@/utilities/supabase-client";
import HTTPMethod from "http-method-enum";
import { noNullObject } from "./array";
/**
 * Bikin HTTP Request ke API
 * 
 * @param request Request yang ingin dikirim
 * @param useForm Apakah pas ngirim pakai multipart/form-data? Jika tidak, pakai JSON
 * @returns BaseResponse<TResponse>
 */
export async function HTTPRequestClient<TResponse, TRequest extends Record<string, any> | never>(request: BaseRequest<TRequest>, useForm: boolean = true): Promise<BaseResponse<TResponse>> {
  let supabase = await supabaseClient().auth.getSession();
  let token = supabase.data.session?.access_token;
  
  // Kita pecah prosesnya biar GET dan DELETE punya proses sendiri biar nga mabuk
  let url = request.url;
  if (request.method === HTTPMethod.GET || request.method === HTTPMethod.DELETE) {
    let arrayParams = Object.entries(request.data ?? {})
      .filter(([_, v]) => v !== null && v !== undefined)
      .flatMap(([k, v]) => {
        if (Array.isArray(v)) return v.map(x => ([k, x]));
        else return [[k, v]]
      });
    
    if (arrayParams.length > 0) url = url + "?" + new URLSearchParams(arrayParams);
  }

  let conf: RequestInit = {
    method: request.method,
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  }

  // Jika kita kirim data pakai form, maka kita masukkan ke formData
  if (request.method !== HTTPMethod.GET && request.method !== HTTPMethod.DELETE){
    if (useForm && request.data) conf.body = toFormData(request.data!);
    else conf.body = JSON.stringify(noNullObject(request.data ?? {}));
  }

  const response = await (await fetch(url, conf)).json() as BaseResponse<TResponse>;
  
  console.log(response);
  console.log(response.statusCode);
  if (Math.round(response.statusCode / 100) !== 2) throw new RequestError(`(${response.statusCode}) ${response.message}`);
  return response;
}