import { userPreferences } from "@shared/models";
import { events } from "@shared/schema";
import { sql, and, desc, eq, gte, lte } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "server/db";

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
