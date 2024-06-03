export type GetAllImagesResponse = {
  name: string;
  link: string;
  uploadDate: string;
  ageRating: "GENERAL" | "MATURE" | "EXPLICIT",
  tags: string[]
}