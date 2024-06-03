import { trImage, trImageTag, trTag } from "@/database/schema";

export type ImageEntity = typeof trImage.$inferSelect;
export type TagEntity = typeof trTag.$inferSelect;
export type ImageTagEntity = typeof trImageTag.$inferSelect;