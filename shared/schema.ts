import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Flashcard schema
export const flashcards = pgTable("flashcards", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  scientificName: text("scientific_name").notNull(),
  characteristics: text("characteristics").notNull(),
  conflictBasis: text("conflict_basis").notNull(),
  notes: text("notes").notNull(),
  codeMapping: text("code_mapping").notNull(), // Stored as JSON string
  isFavorite: boolean("is_favorite").default(false),
  studied: boolean("studied").default(false),
});

export const insertFlashcardSchema = createInsertSchema(flashcards).omit({
  isFavorite: true,
  studied: true,
});

export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Flashcard = typeof flashcards.$inferSelect;

// Study stats schema
export const studyStats = pgTable("study_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  studied: integer("studied").default(0),
  mastered: integer("mastered").default(0),
  sessions: integer("sessions").default(0),
  lastSession: text("last_session"), // Stored as ISO string
  addedThisWeek: integer("added_this_week").default(0),
  dailyProgress: text("daily_progress").notNull(), // Stored as JSON string
});

export const insertStudyStatsSchema = createInsertSchema(studyStats).omit({
  id: true,
});

export type InsertStudyStats = z.infer<typeof insertStudyStatsSchema>;
export type StudyStats = typeof studyStats.$inferSelect;

// Recent activity schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'completed', 'favorite', 'started'
  title: text("title").notNull(),
  description: text("description").notNull(),
  timestamp: text("timestamp").notNull(), // Stored as ISO string
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
