import { Express } from "express";
import {
  getEventsByPreference,
  getEvents,
} from "server/controllers/event_controller";

export function registerEventRoutes(app: Express): void {
  app.get("/api/events", getEvents);
  app.get("/api/events/recommended", getEventsByPreference);
}
