import { z } from "zod";

export function toFormData(param: any): FormData{
  if (typeof param !== "object") return new FormData();

  let formData = new FormData();
  Object.keys(param).forEach(key => {
    if (Array.isArray(param[key])) param[key].forEach((x: any) => formData.append(key, x));
    else formData.append(key, param[key]);
  });

  return formData;
}
/**
 * Handle case untuk case input `undefined`, `null`, dan isian
 * @param builder z...
 * @returns Zod, array paser
 */
export function zodArray<Z extends z.ZodType = z.ZodTypeAny>(builder: Z) {
  return z.preprocess(input =>
    input !== undefined ? (Array.isArray(input) ? input : [input]) : input, builder
  )
}

export function zodNumber<Z extends z.ZodType = z.ZodTypeAny>(builder: Z, defaultValue?: number) {
  return z.preprocess(input =>
    parseInt(input as any) ?? defaultValue , builder
  )
}