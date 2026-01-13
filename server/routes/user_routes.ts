import { Express } from "express";
import { updateUser } from "server/controllers/user_controller";
import { validateBody } from "../middleware/validateBody";
import { insertUserSchema, updateUserSchema } from "@shared/schema";
import multer from "multer";

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
}
