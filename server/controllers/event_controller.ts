import { userPreferences } from "@shared/models";
import { events } from "@shared/schema";
import { SQL, sql, and, desc, eq, gte, lte } from "drizzle-orm";
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

export const getEvents = async (req: Request, res: Response) => {
  try {
    const filters = {
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      category: req.query.category as string | undefined,
      searchQuery: req.query.q as string | undefined,
      minPrice: req.query.minPrice
        ? parseInt(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseInt(req.query.maxPrice as string)
        : undefined,
    };

    const totalRows = await db.select({ count: sql`count(*)` }).from(events);

    let query = db.select().from(events);
    let allEvents: any = [];
    if (filters.limit !== undefined) {
      allEvents = await withPagination(
        query.$dynamic(),
        desc(events.date),
        filters.limit,
        filters.offset
      );
    } else {
      allEvents = await query;
    }

    res
      .status(200)
      .json({ success: true, data: allEvents, totalRows: totalRows[0].count });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

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
