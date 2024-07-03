"use client"

import { RequestError } from "@/models/errors/RequestError";
import { BaseRequest } from "@/models/request/base";
import { BaseResponse } from "@/models/response/base";
import { supabaseClient } from "@/utilities/supabase-client";
import { isNil, omitBy } from "lodash";

export async function HTTPRequestClient<TResponse, TRequest extends Record<string, any> | never>(request: BaseRequest<TRequest>, useForm: boolean = true): Promise<BaseResponse<TResponse>> {
  let supabase = await supabaseClient().auth.getSession();
  let token = supabase.data.session?.access_token
  
  // Kita pecah prosesnya biar GET dan DELETE punya proses sendiri biar nga mabuk
  let url = request.url + ((request.method === "GET" || request.method === "DELETE") ?
    ("?" + new URLSearchParams(omitBy(request.data ?? {}, isNil))) : ""
  );

  let conf: RequestInit = {
    method: request.method,
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  }

  // Jika kita kirim data pakai form, maka kita masukkan ke formData
  if (request.method !== "GET" && request.method !== "DELETE"){
    if (useForm) {
      let formData = new FormData();
      Object.keys(request.data!).forEach(key => {
        if (Array.isArray(request.data![key]))
          request.data![key].forEach(x =>  formData.append(key + '[]', x));
        else formData.append(key, request.data![key])
      });
      conf.body = formData;
    }
    else conf.body = JSON.stringify(omitBy(request.data ?? {}, isNil));
  }

  const response = await(await fetch(url, conf)).json() as BaseResponse<TResponse>;

  if (response.statusCode / 100 !== 2) throw new RequestError(`(${response.statusCode}) ${response.message}`);
  return response;
}