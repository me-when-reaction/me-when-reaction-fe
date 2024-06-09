export type BaseResponse<TData> = {
  messageDate: string,
  statusCode: number,
  message: string,
  data: TData
}

export type PaginationResponse<TData> = {
  currentPage: number,
  pageSize: number,
  data: TData,
  isLast: boolean,
  totalPage: number,
}