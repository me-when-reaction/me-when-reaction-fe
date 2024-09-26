import { PAGE_SIZES } from '@/constants/image';
import HTTPMethod from 'http-method-enum';
import { z } from 'zod';

export type BaseRequest<TData extends Record<string, any> | never> = {
  url: string;
  method: HTTPMethod;
  data?: TData;
}

export const PaginationRequestSchema = z.object({
  pageSize: z.coerce.number({ invalid_type_error: "Page Size must be a number" }).refine(n => PAGE_SIZES.includes(n), {
    message: `Page size must be [${PAGE_SIZES.join(", ")}]`
  }).default(5),
  currentPage: z.coerce.number({ invalid_type_error: "Current Page must be a number" }).gte(1).default(1)
});