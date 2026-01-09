import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/auth";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  imageUrl: text("image_url").notNull(),
  authorName: text("author_name").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
  isFeatured: boolean("is_featured").default(false),
  isEditorPick: boolean("is_editor_pick").default(false),
  tickerSymbol: text("ticker_symbol"),
});

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  change: text("change").notNull(),
  changePercent: text("change_percent").notNull(),
  sector: text("sector"),
});

export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, publishedAt: true });
export const insertStockSchema = createInsertSchema(stocks).omit({ id: true });

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Stock = typeof stocks.$inferSelect;
export type InsertStock = z.infer<typeof insertStockSchema>;
