import { pgTable, varchar, uuid, text, timestamp, boolean, integer, index, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const __EFMigrationsHistory = pgTable("__EFMigrationsHistory", {
	MigrationId: varchar("MigrationId", { length: 150 }).primaryKey().notNull(),
	ProductVersion: varchar("ProductVersion", { length: 32 }).notNull(),
});

export const msUser = pgTable("ms_user", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	identity_id: text("identity_id").notNull(),
	identity_provider: text("identity_provider").notNull(),
	date_in: timestamp("date_in", { withTimezone: true, mode: 'string' }).notNull(),
	date_up: timestamp("date_up", { withTimezone: true, mode: 'string' }),
	date_del: timestamp("date_del", { withTimezone: true, mode: 'string' }),
	user_in: uuid("user_in").notNull(),
	user_up: uuid("user_up"),
	user_del: uuid("user_del"),
	deleted: boolean("deleted").notNull(),
});

export const trImage = pgTable("tr_image", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name").notNull(),
	link: text("link").notNull(),
	description: text("description").notNull(),
	source: text("source").notNull(),
	extension: text("extension").notNull(),
	age_rating: integer("age_rating").notNull(),
	date_in: timestamp("date_in", { withTimezone: true, mode: 'string' }).notNull(),
	date_up: timestamp("date_up", { withTimezone: true, mode: 'string' }),
	date_del: timestamp("date_del", { withTimezone: true, mode: 'string' }),
	user_in: uuid("user_in").notNull(),
	user_up: uuid("user_up"),
	user_del: uuid("user_del"),
	deleted: boolean("deleted").notNull(),
});

export const trImageTag = pgTable("tr_image_tag", {
	id: uuid("id").primaryKey().notNull(),
	image_id: uuid("image_id").notNull().references(() => trImage.id, { onDelete: "cascade" }),
	tag_id: uuid("tag_id").notNull().references(() => trTag.id, { onDelete: "cascade" }),
	date_in: timestamp("date_in", { withTimezone: true, mode: 'string' }).notNull(),
	date_up: timestamp("date_up", { withTimezone: true, mode: 'string' }),
	date_del: timestamp("date_del", { withTimezone: true, mode: 'string' }),
	user_in: uuid("user_in").notNull(),
	user_up: uuid("user_up"),
	user_del: uuid("user_del"),
	deleted: boolean("deleted").notNull(),
},
	(table) => {
		return {
			IX_tr_image_tag_image_id: index("IX_tr_image_tag_image_id").using("btree", table.image_id),
			IX_tr_image_tag_tag_id: index("IX_tr_image_tag_tag_id").using("btree", table.tag_id),
		}
	});

export const trTag = pgTable("tr_tag", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name").notNull(),
	age_rating: integer("age_rating").notNull(),
	date_in: timestamp("date_in", { withTimezone: true, mode: 'string' }).notNull(),
	date_up: timestamp("date_up", { withTimezone: true, mode: 'string' }),
	date_del: timestamp("date_del", { withTimezone: true, mode: 'string' }),
	user_in: uuid("user_in").notNull(),
	user_up: uuid("user_up"),
	user_del: uuid("user_del"),
	deleted: boolean("deleted").notNull(),
});