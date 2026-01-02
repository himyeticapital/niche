import { users } from "./users";
import { categories } from "@shared/utils/constants";
import { DEFAULT_LAT, DEFAULT_LNG } from "@shared/utils/constants";
import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  uuid,
  varchar,
  real,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  categoryPreference: varchar("category_preference")
    .array()
    .default(sql`ARRAY[]::varchar[]`),
  minRating: real("min_rating").default(0),
  maxRating: real("max_rating").default(5),
  lat: doublePrecision("lat").default(sql`27.3289509`),
  lng: doublePrecision("lng").default(sql`88.6073311`),
  radiusKm: integer("radius_km").notNull().default(10),
  price: integer("price").default(10000),
  ageRequirement: varchar("age_requirement"),
});
