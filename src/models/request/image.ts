export type GetAllImagesRequest = {
  TagAND?: string[],
  TagOR?: string[],
  AgeRating?: AgeRating,
  PageSize: number,
  PageNumber: number,
}

export enum AgeRating {
  GENERAL,
  MATURE,
  EXPLICIT
}