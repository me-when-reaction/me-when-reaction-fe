export interface GetTagSuggestionResponse {
  name: string,
  count: number,
  nameCount: string
}

export interface GetTagManagementResponse {
  id: string,
  name: string,
  usage: number,
  alias: string[]
}