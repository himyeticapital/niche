import type { Request, Response } from "express";
import { db } from "server/db";
import { users } from "@shared/models/users";
import { eq } from "drizzle-orm";

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const updatableFields = ["name", "username", "bio", "phone"];
    const updateData: Record<string, any> = {};
    for (const field of updatableFields) {
      if (
        req.body[field] !== null &&
        req.body[field] !== undefined &&
        req.body[field] !== ""
      ) {
        updateData[field] = req.body[field];
      }
    }

    const photoBuffer = req.file?.buffer;
    if (photoBuffer) {
      updateData.avatar = photoBuffer.toString("base64");
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid fields to update" });
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user.avatar });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
