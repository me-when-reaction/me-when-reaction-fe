export type BaseResponse<TData> = {
  messageDate: string,
  statusCode: number,
  message: string,
  data: TData
}