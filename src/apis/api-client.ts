"use client"

import { RequestError } from "@/models/errors/RequestError";
import { BaseRequest } from "@/models/request/base";
import { BaseResponse } from "@/models/response/base";
import { supabaseClient } from "@/utilities/supabase-client";
import { isNil, omitBy } from "lodash";

export async function HTTPRequestClient<TResponse, TRequest extends Record<string, any> | never>(request: BaseRequest<TRequest>, useForm: boolean = true): Promise<BaseResponse<TResponse>> {
  let supabase = await supabaseClient().auth.getSession();
  let token = supabase.data.session?.access_token
  let formData = new FormData();

  if (useForm) Object.keys(request.data!).forEach(key => {

    if (Array.isArray(request.data![key]))
      request.data![key].forEach(x =>  formData.append(key + '[]', x));

    else formData.append(key, request.data![key])
  });

  console.log(Object.fromEntries(formData))

  const response = await (await fetch(
    request.url + (request.method === "GET" || request.method === "DELETE" ? "?" + new URLSearchParams(omitBy(request.data ?? {}, isNil)) : ""),
    {
      method: request.method,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: request.method !== "GET" && request.method !== "DELETE" ? (useForm ? formData : JSON.stringify(omitBy(request.data ?? {}, isNil))) : null
    })).json() as BaseResponse<TResponse>;

  if (response.statusCode / 100 !== 2) throw new RequestError(`(${response.statusCode}) ${response.message}`);
  return response;
}