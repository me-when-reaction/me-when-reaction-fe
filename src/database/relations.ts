import { relations } from "drizzle-orm/relations";
import { trImage, trImageTag, trTag } from "./schema";

export const trImageTagRelations = relations(trImageTag, ({one}) => ({
	trImage: one(trImage, {
		fields: [trImageTag.imageId],
		references: [trImage.id]
	}),
	trTag: one(trTag, {
		fields: [trImageTag.tagId],
		references: [trTag.id]
	}),
}));

export const trImageRelations = relations(trImage, ({many}) => ({
	trImageTags: many(trImageTag),
}));

export const trTagRelations = relations(trTag, ({many}) => ({
	trImageTags: many(trImageTag),
}));