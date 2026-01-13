import { updateUserSchema } from "@shared/schema";
import { Express } from "express";
import multer from "multer";
import { getUserProfile, updateUser } from "server/controllers/user_controller";
import { validateBody } from "../middleware/validateBody";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 },
}); // 5MB limit

export function registerUserRoutes(app: Express): void {
  app.put(
    "/api/user",
    upload.single("photo"),
    validateBody(updateUserSchema),
    updateUser
  );

  app.get("/api/user/profile", getUserProfile);
}
