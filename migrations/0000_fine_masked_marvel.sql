CREATE TABLE IF NOT EXISTS "event_attendees" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"user_name" text NOT NULL,
	"user_phone" text,
	"payment_status" text DEFAULT 'pending',
	"joined_at" text NOT NULL,
	"checked_in" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"interests" text[],
	"cover_image" text,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"duration" integer NOT NULL,
	"location_name" text NOT NULL,
	"location_address" text,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"max_capacity" integer NOT NULL,
	"current_attendees" integer DEFAULT 0,
	"price" integer DEFAULT 0,
	"is_recurring" boolean DEFAULT false,
	"recurring_type" text,
	"bring_friend" boolean DEFAULT true,
	"age_requirement" text,
	"fitness_level" text,
	"organizer_id" varchar NOT NULL,
	"organizer_name" text NOT NULL,
	"organizer_avatar" text,
	"organizer_verified" boolean DEFAULT false,
	"organizer_rating" real DEFAULT 0,
	"organizer_review_count" integer DEFAULT 0,
	"rating" real DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"status" text DEFAULT 'active',
	"is_featured" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"user_name" text NOT NULL,
	"user_avatar" text,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" text NOT NULL,
	"organizer_reply" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"avatar" text,
	"bio" text,
	"is_verified" boolean DEFAULT false,
	"is_organizer" boolean DEFAULT false,
	"events_hosted" integer DEFAULT 0,
	"rating" real DEFAULT 0,
	"review_count" integer DEFAULT 0,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" USING btree ("expire");