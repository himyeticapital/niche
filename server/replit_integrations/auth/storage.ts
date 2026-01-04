import { users, type User } from "@shared/models/auth";
import { type UserPreference } from "@shared/schema";
import { userPreferences } from "@shared/schema";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { DEFAULT_LAT, DEFAULT_LNG } from "@shared/utils/constants";

// Interface for auth storage operations
export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(data: {
    email: string;
    password: string;
    name: string;
    username: string;
  }): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    username: string;
  }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email: data.email,
        password: data.password,
        name: data.name,
        username: data.username,
      })
      .returning();
    return user;
  }

  async createUserPreference(
    userId: string,
    options?: {
      preferences?: string[];
      minRating?: number;
      maxRating?: number;
      lat?: number;
      lng?: number;
      radiusKm?: number;
      price?: number;
      ageRequirement?: string;
    }
  ): Promise<UserPreference> {
    const {
      preferences = [],
      minRating = 0,
      maxRating = 5,
      lat = DEFAULT_LAT,
      lng = DEFAULT_LNG,
      radiusKm = 10,
      price = 10000,
      ageRequirement,
    } = options || {};
    const [userPreference] = await db
      .insert(userPreferences)
      .values({
        userId,
        categoryPreference: preferences,
        minRating,
        maxRating,
        lat,
        lng,
        radiusKm,
        price,
        ageRequirement,
      })
      .returning();
    return userPreference;
  }
}

export const authStorage = new AuthStorage();
