import { relations } from "drizzle-orm/relations";
import { trImage, trImageTag, trTag } from "./schema";

export const trImageTagRelations = relations(trImageTag, ({ one }) => ({
	tr_image: one(trImage, {
		fields: [trImageTag.image_id],
		references: [trImage.id]
	}),
	tr_tag: one(trTag, {
		fields: [trImageTag.tag_id],
		references: [trTag.id]
	}),
}));

export const trImageRelations = relations(trImage, ({ many }) => ({
	tr_image_tags: many(trImageTag),
}));

export const trTagRelations = relations(trTag, ({ many }) => ({
	tr_image_tags: many(trImageTag),
}));