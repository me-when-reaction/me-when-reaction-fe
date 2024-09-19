import _ from "lodash";

export function toFormData(param: any): FormData{
  if (typeof param !== "object") return new FormData();

  let formData = new FormData();
  Object.keys(param).forEach(key => {
    if (Array.isArray(param[key])) param[key].forEach(x => formData.append(key, x));
    else formData.append(key, param[key]);
  });

  return formData;
}