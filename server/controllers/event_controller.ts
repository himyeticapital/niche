import { userPreferences } from "@shared/models";
import { events } from "@shared/schema";
import { SQL, sql, and, desc, eq, gte, lte, between } from "drizzle-orm";
import { PgColumn, PgSelect } from "drizzle-orm/pg-core";
import type { Request, Response } from "express";
import { db } from "server/db";

function withPagination<T extends PgSelect>(
  qb: T,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  limit = 1,
  offset = 3
) {
  return qb.orderBy(orderByColumn).limit(limit).offset(offset);
}

function buildEventsWhereClause(filters: {
  category?: string;
  searchQuery?: string;
  organizerRating?: number;
  minPrice?: number;
  maxPrice?: number;
  ageRequirement?: string;
  fromDate?: string;
  toDate?: string;
  startTime?: string;
}) {
  const conditions = [eq(events.status, "active")];
  if (filters.startTime) {
    conditions.push(gte(events.time, filters.startTime));
  }
  if (filters.ageRequirement !== undefined) {
    conditions.push(eq(events.ageRequirement, filters.ageRequirement));
  }
  if (filters.organizerRating !== undefined) {
    conditions.push(gte(events.organizerRating, filters.organizerRating));
  }
  if (filters.category) {
    conditions.push(eq(events.category, filters.category));
  }
  if (filters.minPrice !== undefined) {
    conditions.push(gte(events.price, filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(events.price, filters.maxPrice));
  }
  if (filters.fromDate) {
    const startDate = new Date(filters.fromDate as string);
    conditions.push(sql`DATE(${events.date}) >= DATE(${startDate})`);
  }
  if (filters.toDate) {
    const endDate = new Date(filters.toDate as string);
    conditions.push(sql`DATE(${events.date}) <= DATE(${endDate})`);
  }
  if (filters.searchQuery) {
    const q = `%${filters.searchQuery.toLowerCase()}%`;
    // Search in title, description, locationName
    conditions.push(sql`(
      LOWER(${events.title}) LIKE ${q} OR
      LOWER(${events.description}) LIKE ${q} OR
      LOWER(${events.locationName}) LIKE ${q}
    )`);
  }
  return conditions.length ? and(...conditions) : undefined;
}

/**
 * Fetch events with optional filters and pagination.
 *
 * @route GET /api/events
 * @queryparam {string} [category] - Filter by event category
 * @queryparam {string} [searchQuery] - Search in title, description, locationName
 * @queryparam {number} [organizerRating] - Minimum organizer rating
 * @queryparam {number} [minPrice] - Minimum price
 * @queryparam {number} [maxPrice] - Maximum price
 * @queryparam {string} [ageRequirement] - Age requirement filter
 * @queryparam {string} [fromDate] - Start date (inclusive)
 * @queryparam {string} [toDate] - End date (inclusive)
 * @queryparam {string} [startTime] - Earliest event start time
 * @queryparam {number} [limit] - Pagination limit
 * @queryparam {number} [offset] - Pagination offset
 * @returns {Object} JSON response with success, data (events), and totalRows
 */
export const getEvents = async (req: Request, res: Response) => {
  try {
    const filters = {
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      category: req.query.category as string | undefined,
      searchQuery: req.query.q as string | undefined,
      organizerRating: req.query.organizerRating
        ? parseFloat(req.query.organizerRating as string)
        : undefined,
      minPrice: req.query.minPrice
        ? parseInt(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseInt(req.query.maxPrice as string)
        : undefined,
      ageRequirement: req.query.ageRequirement as string | undefined,
      fromDate: req.query.fromDate as string | undefined,
      toDate: req.query.toDate as string | undefined,
      startTime: req.query.startTime as string | undefined,
    };

    const whereClause = buildEventsWhereClause(filters);

    // Count total rows with filters
    const totalRowsResult = await db
      .select({ count: sql`count(*)` })
      .from(events)
      .where(whereClause);
    const totalRows = totalRowsResult[0].count;

    // Build main query with filters
    let allEvents: any = [];
    if (filters.limit !== undefined) {
      const baseQuery = db.select().from(events).where(whereClause);
      allEvents = await withPagination(
        baseQuery.$dynamic(),
        desc(events.date),
        filters.limit,
        filters.offset
      );
    } else {
      allEvents = await db.select().from(events).where(whereClause);
    }

    res.status(200).json({ success: true, data: allEvents, totalRows });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

/**
 * Fetch recommended events for the logged-in user based on their preferences.
 *
 * @route GET /api/events/recommended
 * @requires session userId
 * @returns {Object} JSON response with success, data (recommended events), and rows
 */
export const getEventsByPreference = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const [pref] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (!pref) {
      return res
        .status(404)
        .json({ success: false, message: "Preferences not found" });
    }

    const conditions = [];
    let spatialConditions = null;

    if (pref.minRating !== null) {
      conditions.push(gte(events.rating, pref.minRating));
    }

    if (pref.maxRating !== null) {
      conditions.push(lte(events.rating, pref.maxRating));
    }

    if (pref.price !== null) {
      conditions.push(lte(events.price, pref.price));
    }

    if (pref.radiusKm !== null) {
      const radiusMeters = pref.radiusKm * 1000;
      spatialConditions = sql`
        ST_DWithin(
          ${events.location},
          ST_MakePoint(${pref.lng}, ${pref.lat})::geography,
          ${radiusMeters}
        )
      `;
    }

    let whereClause;
    if (spatialConditions) {
      whereClause = and(...conditions, spatialConditions);
    } else {
      whereClause = and(...conditions);
    }

    const eventsByPreference = await db
      .select()
      .from(events)
      .where(whereClause)
      .orderBy(
        sql`
      ST_Distance(
        ${events.location},
        ST_MakePoint(${pref.lng}, ${pref.lat})::geography
      )
    `
      )
      .limit(50);

    return res.status(200).json({
      success: true,
      data: eventsByPreference,
      rows: eventsByPreference.length,
    });
  } catch (error) {
    console.error("🚀 ~ getEventsByPreference ~ error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
