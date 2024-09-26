import { HTTPMethod } from 'http-method-enum';

export type API_ROUTE = 'IMAGE' | 'TAG' | 'AUTH' | 'TAG_SEARCH';
export type ApiTypeData = {
  route: string,
  anonMethod?: HTTPMethod[]
}

export const API_DETAIL: {[key in API_ROUTE]: ApiTypeData} = {
  IMAGE: {
    route: `${process.env.NEXT_PUBLIC_API_URL}/image`,
    anonMethod: [HTTPMethod.GET]
  },
  TAG: {
    route: `${process.env.NEXT_PUBLIC_API_URL}/tag`
  },
  TAG_SEARCH: {
    route: `${process.env.NEXT_PUBLIC_API_URL}/tag/search`,
    anonMethod: [HTTPMethod.GET]
  },
  AUTH: {
    route: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
    anonMethod: [HTTPMethod.POST]
  },
}