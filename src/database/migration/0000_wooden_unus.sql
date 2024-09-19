-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
	"MigrationId" varchar(150) PRIMARY KEY NOT NULL,
	"ProductVersion" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ms_user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"identity_id" text NOT NULL,
	"identity_provider" text NOT NULL,
	"date_in" timestamp with time zone NOT NULL,
	"date_up" timestamp with time zone,
	"date_del" timestamp with time zone,
	"user_in" uuid NOT NULL,
	"user_up" uuid,
	"user_del" uuid,
	"deleted" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tr_image" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"link" text NOT NULL,
	"description" text NOT NULL,
	"source" text NOT NULL,
	"extension" text NOT NULL,
	"age_rating" integer NOT NULL,
	"date_in" timestamp with time zone NOT NULL,
	"date_up" timestamp with time zone,
	"date_del" timestamp with time zone,
	"user_in" uuid NOT NULL,
	"user_up" uuid,
	"user_del" uuid,
	"deleted" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tr_image_tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"image_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"date_in" timestamp with time zone NOT NULL,
	"date_up" timestamp with time zone,
	"date_del" timestamp with time zone,
	"user_in" uuid NOT NULL,
	"user_up" uuid,
	"user_del" uuid,
	"deleted" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tr_tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age_rating" integer NOT NULL,
	"date_in" timestamp with time zone NOT NULL,
	"date_up" timestamp with time zone,
	"date_del" timestamp with time zone,
	"user_in" uuid NOT NULL,
	"user_up" uuid,
	"user_del" uuid,
	"deleted" boolean NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tr_image_tag" ADD CONSTRAINT "FK_tr_image_tag_tr_image_image_id" FOREIGN KEY ("image_id") REFERENCES "public"."tr_image"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tr_image_tag" ADD CONSTRAINT "FK_tr_image_tag_tr_tag_tag_id" FOREIGN KEY ("tag_id") REFERENCES "public"."tr_tag"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IX_tr_image_tag_image_id" ON "tr_image_tag" USING btree ("image_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IX_tr_image_tag_tag_id" ON "tr_image_tag" USING btree ("tag_id");
*/