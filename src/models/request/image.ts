import { z } from "zod";
import { zfd } from "zod-form-data";
import { PaginationRequestSchema } from "./base";
import { AgeRating, MAX_SIZE } from "@/constants/image";

export const GetImageRequestSchema = z.object({
  tagAND: zfd.repeatable(z.string().array().default([])),
  tagOR: zfd.repeatable(z.string().array().default([])),
  ageRating: zfd.numeric(z.nativeEnum(AgeRating).optional().default(AgeRating.GENERAL))
}).merge(PaginationRequestSchema);
export type GetImageRequest = z.infer<typeof GetImageRequestSchema>

export const GetImageByIDRequestSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID" })
}).merge(GetImageRequestSchema);
export type GetImageByIDRequest = z.infer<typeof GetImageByIDRequestSchema>

export const InsertImageRequestSchema = z.object({
  image: zfd.file(z.custom<File>()
    .refine(fl => (
        !!fl &&
        !!fl.name &&
        !!fl.name.split(".", 2).pop() &&
        ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(fl.type ?? '')
      ), { message: "Image is required, duh..." })
    .refine(fl => (fl && fl.size <= MAX_SIZE), { message: "Image too large. Must be no more than 10KB" })),
  name: z.string({ required_error: 'Please gimme name 🥺' }).trim().min(1, { message: 'Please gimme name 🥺' }),
  description: z.string({ required_error: 'Context please' }).trim().min(1, { message: 'Context please' }),
  tags: zfd.repeatable(z.string({ required_error: "Need tag" }).array().min(2, { message: "Must be more than 2 tags" })),
  source: z.string({ required_error: "Respect the creator, please :(" }).trim().min(1, { message: 'Respect the creator, please :(' }),
  ageRating: zfd.numeric(z.nativeEnum(AgeRating, { required_error: "Needs an age rating" }))
});
export type InsertImageRequest = z.infer<typeof InsertImageRequestSchema>

export const UpdateImageRequestSchema = z.object({
  id: z.string({ required_error: "ID required" }).uuid({ message: "Invalid UUID" }),
  name: z.string({ required_error: 'Please gimme name 🥺' }).trim().min(1, { message: 'Please gimme name 🥺' }),
  description: z.string({ required_error: 'Context please' }).trim().min(1, { message: 'Context please' }),
  tags: z.string({ required_error: "Need tag" }).array().min(2, { message: "Must be more than 2 tags" }),
  source: z.string({ required_error: "Respect the creator, please :(" }).trim().min(1, { message: 'Respect the creator, please :(' }),
  ageRating: z.preprocess(v => parseInt(v as any), z.nativeEnum(AgeRating, { required_error: "Needs an age rating" }))
});
export type UpdateImageRequest = z.infer<typeof UpdateImageRequestSchema>

export const DeleteImageRequestSchema = z.object({
  id: z.string({ required_error: "ID required" }).uuid({ message: "Invalid UUID" })
});
export type DeleteImageRequest = z.infer<typeof DeleteImageRequestSchema>