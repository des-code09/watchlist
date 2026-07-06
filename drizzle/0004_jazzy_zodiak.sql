ALTER TABLE "movie" ADD COLUMN "release_year" integer;--> statement-breakpoint
ALTER TABLE "movie" ADD COLUMN "genres" text;--> statement-breakpoint
ALTER TABLE "movie" ADD COLUMN "status" text DEFAULT 'to_watch' NOT NULL;