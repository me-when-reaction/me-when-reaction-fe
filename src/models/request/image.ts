export type GetAllImagesRequest = {
  TagAND?: string[],
  TagOR?: string[],
  AgeRating?: AgeRating,
  PageSize: number,
  CurrentPage: number,
}

export enum AgeRating {
  GENERAL,
  MATURE,
  EXPLICIT
}