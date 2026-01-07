import { userPreferences } from "@shared/models";
import { events } from "@shared/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "server/db";

export const getEventsByPreference = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (preferences.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Preferences not found" });
    }

    const pref = preferences[0];
    const conditions = [];

    if (pref.minRating !== null) {
      conditions.push(gte(events.rating, pref.minRating));
    }

    if (pref.maxRating !== null) {
      conditions.push(lte(events.rating, pref.maxRating));
    }

    if (pref.price !== null) {
      conditions.push(lte(events.price, pref.price));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const eventsByPreference = await db
      .select()
      .from(events)
      .where(whereClause)
      .orderBy(desc(events.rating));

    return res.status(200).json({
      success: true,
      data: eventsByPreference,
      rows: eventsByPreference.length,
    });
  } catch (error) {
    console.log("🚀 ~ getEventsByPreference ~ error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
