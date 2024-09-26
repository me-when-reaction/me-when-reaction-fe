import { AgeRating } from "@/constants/image";

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