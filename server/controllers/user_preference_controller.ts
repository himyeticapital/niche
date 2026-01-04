import { userPreferences } from "@shared/models/user_preference";
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "server/db";
import { insertUserPreferenceSchema } from "@shared/schema";
import { z } from "zod";

export const updateUserPreference = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const parsedReqBody = insertUserPreferenceSchema
      .omit({ userId: true })
      .extend({
        categoryPreference: z.array(z.string()), // required
        minRating: z.number(), // required
        maxRating: z.number(), // required
        lat: z.number(), // required
        lng: z.number(), // required
        radiusKm: z.number(), // required
        price: z.number(), // required
        ageRequirement: z.string(),
      })
      .safeParse(req.body);

    if (!parsedReqBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsedReqBody.error.errors,
      });
    }
    const validData = parsedReqBody.data;

    const preferenceData = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    if (!preferenceData) {
      return res.status(404).json({ message: "User preference not found" });
    }

    await db
      .update(userPreferences)
      .set({
        lastUpdated: new Date(),
        ...validData,
      })
      .where(eq(userPreferences.userId, userId));

    res.status(200).json({ message: "User preference updated successfully" });
  } catch (error) {
    console.log("🚀 ~ updateUserPreference ~ error:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};
