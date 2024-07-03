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