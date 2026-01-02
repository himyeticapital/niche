import { users } from "./models/users";
import { userPreferences } from "./models/user_preference";
import { relations } from "drizzle-orm";

// Each user has one userPreferences row (user_preferences.userId references users.id)
export const userPreferenceRelation = relations(users, ({ one }) => ({
  userPreferences: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId],
  }),
}));
