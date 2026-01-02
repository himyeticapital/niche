import {
  pgTable,
  text,
  varchar,
  boolean,
  integer,
  real,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  avatar: text("avatar"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  isOrganizer: boolean("is_organizer").default(false),
  eventsHosted: integer("events_hosted").default(0),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
});
