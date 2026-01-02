CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar NOT NULL,
	"category_preference" varchar[] DEFAULT ARRAY[]::varchar[],
	"min_rating" real DEFAULT 0,
	"max_rating" real DEFAULT 5,
	"lat" double precision DEFAULT 27.3289509,
	"lng" double precision DEFAULT 88.6073311,
	"radius_km" integer DEFAULT 10 NOT NULL,
	"price" integer DEFAULT 10000,
	"age_requirement" varchar
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;