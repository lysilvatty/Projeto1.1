import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User types: "student" or "professional"
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  userType: text("user_type").notNull(),
  bio: text("bio"),
  experience: integer("experience"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  color: text("color").notNull()
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  price: doublePrecision("price").notNull(),
  duration: integer("duration").notNull(), // in seconds
  userId: integer("user_id").notNull(), // professional's ID
  categoryId: integer("category_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // student's ID
  videoId: integer("video_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // student's ID
  videoId: integer("video_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema for creating users
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
  name: true,
  userType: true,
  bio: true,
  experience: true,
  profileImage: true,
});

// Schema for creating videos
export const insertVideoSchema = createInsertSchema(videos).pick({
  title: true,
  description: true,
  videoUrl: true,
  thumbnailUrl: true,
  price: true,
  duration: true,
  userId: true,
  categoryId: true,
});

// Schema for creating purchases
export const insertPurchaseSchema = createInsertSchema(purchases).pick({
  userId: true,
  videoId: true,
  amount: true,
  paymentMethod: true,
});

// Schema for creating ratings
export const insertRatingSchema = createInsertSchema(ratings).pick({
  userId: true,
  videoId: true,
  rating: true,
  comment: true,
});

// Schema for creating categories
export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  displayName: true,
  color: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Extended types for API responses
export type VideoWithDetails = Video & { 
  professional: Pick<User, 'id' | 'name' | 'experience' | 'profileImage'>,
  category: Category,
  averageRating?: number,
  ratingCount?: number
};

export type ProfessionalWithVideos = User & { 
  videos: VideoWithDetails[],
  averageRating?: number
};
