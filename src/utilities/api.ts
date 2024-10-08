import { NextRequest, NextResponse } from "next/server"
import StatusCode from "status-code-enum";
import { z, ZodError } from "zod";
import { PaginationResponse } from "@/models/response/base";
import HTTPMethod from "http-method-enum";

export function dataResponse(data: any, d: {message?: string, statusCode?: StatusCode} = {message: "Success", statusCode: StatusCode.SuccessOK}) {
  return NextResponse.json({
    statusCode: d.statusCode,
    message: d.message,
    data: data
  }, { status: d.statusCode });
}

export const paginationResponse = <T>(data: PaginationResponse<T>) => dataResponse(data, { message: "Success", statusCode: StatusCode.SuccessOK })
export const serverErrorResponse = (message: string = "Whoops, something wrong :(") => dataResponse(message, { message: message, statusCode: StatusCode.ServerErrorInternal });
export const notFoundResponse = (message: string = "Endpoint not found") => dataResponse(message, { message: message, statusCode: StatusCode.ClientErrorNotFound });
export const successResponse = (message: string) => dataResponse(message, { message: message, statusCode: StatusCode.SuccessOK });
export const badRequestResponse = (message: string) => dataResponse(message, { message: message, statusCode: StatusCode.ClientErrorBadRequest });
export const unauthorizedResponse = (message: string = "Unauthorized") => dataResponse(message, { message: message, statusCode: StatusCode.ClientErrorUnauthorized });

/**
 * Handle validasi data
 * @param request Lempar dari NextRequest
 * @param schema Lempar aja schemanya. Nanti bakal dilempar otomatis ke zod form data
 * @param onSuccess Method setelah sukses
 * @param slug Slug dari form data
 * @returns 
 */
export async function handleDataValidation<TSchema extends z.ZodTypeAny>(
  request: NextRequest,
  schema: TSchema,
  onSuccess: (data: z.infer<TSchema>) => Promise<NextResponse>,
  slug?: { [key: string]: any }
) {
  let unsanitaryData: any;
  if (request.method === HTTPMethod.GET || request.method === HTTPMethod.DELETE)
  {
    let sp = request.nextUrl.searchParams;
    for (const [key, value] of Object.entries(slug ?? {})) sp.append(key, value);
    unsanitaryData = ParseData(sp);
  }
  else
  {
    let fd = await request.formData();
    for (const [key, value] of Object.entries(slug ?? {})) fd.append(key, value);
    unsanitaryData = ParseData(fd);
  }
  try {
    const data = await schema.parseAsync(unsanitaryData);
    return await onSuccess(data);
  }
  catch (e) {
    if (e instanceof ZodError) {
    return dataResponse({
        error: e.issues.map(x => x.message)
      }, {
        message: "Validation Error",
        statusCode: StatusCode.ClientErrorBadRequest
      })
    }
    else {
      return serverErrorResponse();
    }
  }
}

function ParseData<T>(obj: URLSearchParams | FormData){
  let result: any = {};
  for (const key of obj.keys()) {
    const val = obj.getAll(key);
    result[key] = val.length > 1 ? val : val[0]
  }
  return result as T;
}