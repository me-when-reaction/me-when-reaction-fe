import { pgTable, varchar, uuid, text, timestamp, boolean, integer, index, foreignKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const efMigrationsHistory = pgTable("__EFMigrationsHistory", {
	migrationId: varchar("MigrationId", { length: 150 }).primaryKey().notNull(),
	productVersion: varchar("ProductVersion", { length: 32 }).notNull(),
});

export const msUser = pgTable("ms_user", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	identityId: text("identity_id").notNull(),
	identityProvider: text("identity_provider").notNull(),
	dateIn: timestamp("date_in", { withTimezone: true, mode: 'string' }).notNull(),
	dateUp: timestamp("date_up", { withTimezone: true, mode: 'string' }),
	dateDel: timestamp("date_del", { withTimezone: true, mode: 'string' }),
	userIn: uuid("user_in").notNull(),
	userUp: uuid("user_up"),
	userDel: uuid("user_del"),
	deleted: boolean("deleted").notNull(),
});

export const trImage = pgTable("tr_image", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name").notNull(),
	link: text("link").notNull(),
	description: text("description").notNull(),
	source: text("source").notNull(),
	extension: text("extension").notNull(),
	ageRating: integer("age_rating").notNull(),
	dateIn: timestamp("date_in", { withTimezone: true, mode: 'string' }).notNull(),
	dateUp: timestamp("date_up", { withTimezone: true, mode: 'string' }),
	dateDel: timestamp("date_del", { withTimezone: true, mode: 'string' }),
	userIn: uuid("user_in").notNull(),
	userUp: uuid("user_up"),
	userDel: uuid("user_del"),
	deleted: boolean("deleted").notNull(),
});

export const trImageTag = pgTable("tr_image_tag", {
	id: uuid("id").primaryKey().notNull(),
	imageId: uuid("image_id").notNull(),
	tagId: uuid("tag_id").notNull(),
	dateIn: timestamp("date_in", { withTimezone: true, mode: 'string' }).notNull(),
	dateUp: timestamp("date_up", { withTimezone: true, mode: 'string' }),
	dateDel: timestamp("date_del", { withTimezone: true, mode: 'string' }),
	userIn: uuid("user_in").notNull(),
	userUp: uuid("user_up"),
	userDel: uuid("user_del"),
	deleted: boolean("deleted").notNull(),
},
(table) => {
	return {
		ixTrImageTagImageId: index("IX_tr_image_tag_image_id").using("btree", table.imageId.asc().nullsLast()),
		ixTrImageTagTagId: index("IX_tr_image_tag_tag_id").using("btree", table.tagId.asc().nullsLast()),
		fkTrImageTagTrImageImageId: foreignKey({
			columns: [table.imageId],
			foreignColumns: [trImage.id],
			name: "FK_tr_image_tag_tr_image_image_id"
		}).onDelete("cascade"),
		fkTrImageTagTrTagTagId: foreignKey({
			columns: [table.tagId],
			foreignColumns: [trTag.id],
			name: "FK_tr_image_tag_tr_tag_tag_id"
		}).onDelete("cascade"),
	}
});

export const trTag = pgTable("tr_tag", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name").notNull(),
	ageRating: integer("age_rating").notNull(),
	dateIn: timestamp("date_in", { withTimezone: true, mode: 'string' }).notNull(),
	dateUp: timestamp("date_up", { withTimezone: true, mode: 'string' }),
	dateDel: timestamp("date_del", { withTimezone: true, mode: 'string' }),
	userIn: uuid("user_in").notNull(),
	userUp: uuid("user_up"),
	userDel: uuid("user_del"),
	deleted: boolean("deleted").notNull(),
});