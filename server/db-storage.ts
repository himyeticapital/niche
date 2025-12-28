import {
  type Event,
  type InsertEvent,
  type Attendee,
  type InsertAttendee,
  type Review,
  type InsertReview,
  type DashboardStats,
  type EventFilters,
  events,
  eventAttendees,
  reviews,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike, gte, lte, desc, sql } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<any> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<any> {
    return undefined;
  }

  async createUser(user: any): Promise<any> {
    return user;
  }

  async getEvents(filters?: EventFilters): Promise<Event[]> {
    let query = db.select().from(events).where(eq(events.status, "active"));
    
    const results = await query;
    let filteredEvents = results;

    if (filters?.category) {
      filteredEvents = filteredEvents.filter((e) => e.category === filters.category);
    }

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filteredEvents = filteredEvents.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.locationName.toLowerCase().includes(q)
      );
    }

    if (filters?.minPrice !== undefined) {
      filteredEvents = filteredEvents.filter((e) => (e.price || 0) >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      filteredEvents = filteredEvents.filter((e) => (e.price || 0) <= filters.maxPrice!);
    }

    return filteredEvents.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values({
        ...insertEvent,
        currentAttendees: 0,
        rating: 0,
        reviewCount: 0,
        status: "active",
      })
      .returning();
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const [event] = await db
      .update(events)
      .set(updates)
      .where(eq(events.id, id))
      .returning();
    return event;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return true;
  }

  async getEventAttendees(eventId: string): Promise<Attendee[]> {
    return db.select().from(eventAttendees).where(eq(eventAttendees.eventId, eventId));
  }

  async getOrganizerAttendees(organizerId: string): Promise<Attendee[]> {
    // Get all events for this organizer
    const organizerEvents = await db
      .select()
      .from(events)
      .where(eq(events.organizerId, organizerId));
    
    const organizerEventIds = organizerEvents.map((e) => e.id);
    
    if (organizerEventIds.length === 0) {
      return [];
    }
    
    // Get all attendees for those events
    const allAttendees = await db.select().from(eventAttendees);
    return allAttendees.filter((a) => organizerEventIds.includes(a.eventId));
  }

  async addAttendee(insertAttendee: InsertAttendee): Promise<Attendee> {
    const [attendee] = await db
      .insert(eventAttendees)
      .values({
        ...insertAttendee,
        checkedIn: false,
      })
      .returning();

    await db
      .update(events)
      .set({
        currentAttendees: sql`${events.currentAttendees} + 1`,
      })
      .where(eq(events.id, insertAttendee.eventId));

    return attendee;
  }

  async removeAttendee(eventId: string, userId: string): Promise<boolean> {
    const [attendee] = await db
      .select()
      .from(eventAttendees)
      .where(and(eq(eventAttendees.eventId, eventId), eq(eventAttendees.userId, userId)));

    if (!attendee) return false;

    await db.delete(eventAttendees).where(eq(eventAttendees.id, attendee.id));

    await db
      .update(events)
      .set({
        currentAttendees: sql`GREATEST(${events.currentAttendees} - 1, 0)`,
      })
      .where(eq(events.id, eventId));

    return true;
  }

  async checkInAttendee(eventId: string, attendeeId: string): Promise<boolean> {
    const [attendee] = await db
      .select()
      .from(eventAttendees)
      .where(and(eq(eventAttendees.id, attendeeId), eq(eventAttendees.eventId, eventId)));

    if (!attendee) return false;

    await db
      .update(eventAttendees)
      .set({ checkedIn: true })
      .where(eq(eventAttendees.id, attendeeId));

    return true;
  }

  async getEventReviews(eventId: string): Promise<Review[]> {
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.eventId, eventId))
      .orderBy(desc(reviews.createdAt));
  }

  async addReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values({
        ...insertReview,
        organizerReply: null,
      })
      .returning();

    const eventReviews = await this.getEventReviews(insertReview.eventId);
    const avgRating =
      eventReviews.reduce((sum, r) => sum + r.rating, 0) / eventReviews.length;

    await db
      .update(events)
      .set({
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: eventReviews.length,
      })
      .where(eq(events.id, insertReview.eventId));

    return review;
  }

  async getDashboardStats(organizerId: string): Promise<DashboardStats> {
    const myEvents = await db
      .select()
      .from(events)
      .where(eq(events.organizerId, organizerId));

    const totalRevenue = myEvents.reduce((sum, e) => {
      return sum + (e.currentAttendees || 0) * (e.price || 0) * 0.8;
    }, 0);

    const totalAttendees = myEvents.reduce(
      (sum, e) => sum + (e.currentAttendees || 0),
      0
    );

    const avgRating =
      myEvents.length > 0
        ? myEvents.reduce((sum, e) => sum + (e.rating || 0), 0) / myEvents.length
        : 0;

    const upcomingEvents = myEvents
      .filter((e) => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    const allAttendees = await db.select().from(eventAttendees);
    const recentAttendees = allAttendees
      .filter((a) => myEvents.some((e) => e.id === a.eventId))
      .sort(
        (a, b) =>
          new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
      )
      .slice(0, 10);

    const revenueByEvent = myEvents.map((e) => ({
      eventTitle: e.title,
      revenue: (e.currentAttendees || 0) * (e.price || 0) * 0.8,
    }));

    return {
      totalRevenue: Math.round(totalRevenue),
      totalEvents: myEvents.length,
      totalAttendees,
      averageRating: Math.round(avgRating * 10) / 10,
      upcomingEvents,
      recentAttendees,
      revenueByEvent,
    };
  }
}

export const dbStorage = new DatabaseStorage();
