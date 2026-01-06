import { Express } from "express";
import { updateUser } from "server/controllers/user_controller";
import { validateBody } from "../middleware/validateBody";
import { insertUserSchema, updateUserSchema } from "@shared/schema";

export function registerUserRoutes(app: Express): void {
  app.put("/api/user", validateBody(updateUserSchema), updateUser);
}
