import { handleDataValidation, successResponse } from "@/utilities/api";
import { uploadImage } from "@/utilities/storage";
import { NextRequest } from "next/server";
import { z } from "zod";

const sandboxSchema = z.object({
  image: z.custom<File>()
  .refine(fl => (
      !!fl &&
      !!fl.name.split(".", 2).pop() &&
      ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(fl.type ?? '')
    ), { message: "Image is required, duh..." })
  .refine(fl => (fl && fl.size <= 1024 * 20), { message: "File too large" })
})

export async function POST(request: NextRequest) {
  return await handleDataValidation(request, sandboxSchema, async data => {
    await uploadImage(data.image);
    return successResponse("Done");
  })
}