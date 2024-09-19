import { AgeRating } from "@/constants/image";

/** @deprecated Use the new one */
export type GetImageResponse = {
  id: string;
  name: string;
  image: string;
  source: string;
  description: string;
  uploadDate: string;
  ageRating: "GENERAL" | "MATURE" | "EXPLICIT",
  tags: string[]
}

export type NewGetImageResponse = {
  id: string;
  name: string;
  image: string;
  source: string;
  description: string;
  uploadDate: string;
  ageRating: AgeRating,
  tags: string[]
}