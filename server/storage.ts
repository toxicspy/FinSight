import { db } from "./db";
import {
  articles, stocks,
  type Article, type InsertArticle,
  type Stock, type InsertStock
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  getArticles(limit?: number, category?: string, featured?: boolean): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  
  getStocks(): Promise<Stock[]>;
  getStock(symbol: string): Promise<Stock | undefined>;
  createStock(stock: InsertStock): Promise<Stock>;
}

export class DatabaseStorage extends (authStorage.constructor as { new (): IAuthStorage }) implements IStorage {
  async getArticles(limit?: number, category?: string, featured?: boolean): Promise<Article[]> {
    let query = db.select().from(articles).orderBy(desc(articles.publishedAt));
    
    if (category) {
      query = query.where(eq(articles.category, category)) as any;
    }
    if (featured) {
      query = query.where(eq(articles.isFeatured, true)) as any;
    }
    if (limit) {
      query = query.limit(limit) as any;
    }
    
    return await query;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db.insert(articles).values(article).returning();
    return newArticle;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const [updatedArticle] = await db
      .update(articles)
      .set(article)
      .where(eq(articles.id, id))
      .returning();
    return updatedArticle;
  }

  async deleteArticle(id: number): Promise<boolean> {
    const [deletedArticle] = await db
      .delete(articles)
      .where(eq(articles.id, id))
      .returning();
    return !!deletedArticle;
  }

  async getStocks(): Promise<Stock[]> {
    return await db.select().from(stocks);
  }

  async getStock(symbol: string): Promise<Stock | undefined> {
    const [stock] = await db.select().from(stocks).where(eq(stocks.symbol, symbol));
    return stock;
  }

  async createStock(stock: InsertStock): Promise<Stock> {
    const [newStock] = await db.insert(stocks).values(stock).returning();
    return newStock;
  }
}

export const storage = new DatabaseStorage();
