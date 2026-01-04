import { Express } from "express";
import { updateUserPreference } from "server/controllers/user_preference_controller";

export function registerUserPreferencesRoutes(app: Express): void {
  app.put("/api/user/preferences", updateUserPreference);
}
