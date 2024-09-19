import HTTPMethod from 'http-method-enum';
import { z } from 'zod';

export type BaseRequest<TData extends Record<string, any> | never> = {
  url: string;
  method: HTTPMethod;
  data?: TData;
}

const PAGE_VALUE = [5, 10, 20, 50, 100];
export const PaginationRequestSchema = z.object({
  pageSize: z.coerce.number({ invalid_type_error: "Page Size must be a number" }).refine(n => PAGE_VALUE.includes(n), {
    message: "Page size must be either 5, 10, 20, 50, or 100"
  }).default(5),
  currentPage: z.coerce.number({ invalid_type_error: "Current Page must be a number" }).gte(1).default(1)
});