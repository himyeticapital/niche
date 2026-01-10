import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  real,
  boolean,
  geometry,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { categories } from "./utils/constants";
// Import models
import { users } from "./models/users";
import { userPreferences } from "./models/user_preference";
import * as relations from "./relations";

export type CategoryId = (typeof categories)[number]["id"];

// User Table Schema
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  eventsHosted: true,
  rating: true,
  reviewCount: true,
});
export const updateUserSchema = insertUserSchema.omit({ password: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;
export type UserWithPreferences = User & {
  userPreference?: UserPreference | null;
};

// User Preferences Table Schema
export const insertUserPreferenceSchema = createInsertSchema(
  userPreferences
).omit({
  id: true,
  lastUpdated: true,
});
export type InsertUserPreference = z.infer<typeof insertUserPreferenceSchema>;
export type UserPreference = typeof userPreferences.$inferSelect;

// Events table
export const events = pgTable("events", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  interests: text("interests").array(),
  coverImage: text("cover_image"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  duration: integer("duration").notNull(), // in minutes
  locationName: text("location_name").notNull(),
  locationAddress: text("location_address"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  location: geometry("location", { type: "Point", srid: 4326 }).notNull(), // PostGIS Point
  maxCapacity: integer("max_capacity").notNull(),
  currentAttendees: integer("current_attendees").default(0),
  price: integer("price").default(0), // in INR, 0 = free
  isRecurring: boolean("is_recurring").default(false),
  recurringType: text("recurring_type"), // weekly, biweekly, monthly
  bringFriend: boolean("bring_friend").default(true),
  ageRequirement: text("age_requirement"),
  fitnessLevel: text("fitness_level"),
  organizerId: varchar("organizer_id").notNull(),
  organizerName: text("organizer_name").notNull(),
  organizerAvatar: text("organizer_avatar"),
  organizerVerified: boolean("organizer_verified").default(false),
  organizerRating: real("organizer_rating").default(0),
  organizerReviewCount: integer("organizer_review_count").default(0),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  status: text("status").default("active"), // active, cancelled, completed
  isFeatured: boolean("is_featured").default(false),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  currentAttendees: true,
  rating: true,
  reviewCount: true,
  status: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Event Attendees (join table)
export const eventAttendees = pgTable("event_attendees", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name").notNull(),
  userPhone: text("user_phone"),
  paymentStatus: text("payment_status").default("pending"), // pending, completed, refunded
  joinedAt: text("joined_at").notNull(),
  checkedIn: boolean("checked_in").default(false),
});

export const insertAttendeeSchema = createInsertSchema(eventAttendees).omit({
  id: true,
  checkedIn: true,
});

export type InsertAttendee = z.infer<typeof insertAttendeeSchema>;
export type Attendee = typeof eventAttendees.$inferSelect;

// Reviews
export const reviews = pgTable("reviews", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name").notNull(),
  userAvatar: text("user_avatar"),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: text("created_at").notNull(),
  organizerReply: text("organizer_reply"),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  organizerReply: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Dashboard stats type (computed, not stored)
export interface DashboardStats {
  totalRevenue: number;
  totalEvents: number;
  totalAttendees: number;
  averageRating: number;
  upcomingEvents: Event[];
  recentAttendees: Attendee[];
  revenueByEvent: { eventTitle: string; revenue: number }[];
}

// Search/filter params
export interface EventFilters {
  category?: string;
  maxDistance?: number; // in km
  minPrice?: number;
  maxPrice?: number;
  date?: string;
  searchQuery?: string;
}

// Export auth models
export * from "./models";
