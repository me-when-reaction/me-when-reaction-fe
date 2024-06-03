export type BaseRequest<TData extends Record<string, any> | never> = {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  data?: TData;
}