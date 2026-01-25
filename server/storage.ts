// storage.ts
import { supabaseAdmin } from "./lib/supabase-admin";
import { z } from "zod";

// Types for articles and stocks
export interface ArticleInput {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  subcategory?: string | null;
  imageUrl?: string;
  authorName?: string;
  authorId?: string;
  tickerSymbol?: string | null;
  isFeatured?: boolean;
  isEditorPick?: boolean;
  status?: "published" | "draft";
}

export interface Article extends ArticleInput {
  id: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface StockInput {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  sector: string;
}

export interface Stock extends StockInput {
  id: number;
}

// ---------------- Articles ----------------

export async function createArticle(input: ArticleInput): Promise<Article> {
  const now = new Date();
  const { data, error } = await supabaseAdmin
    .from("articles")
    .insert({
      ...input,
      status: input.status || "published",
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      published_at: input.status === "published" ? now.toISOString() : null,
      image_url: input.imageUrl,
      author_name: input.authorName,
      ticker_symbol: input.tickerSymbol || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Article;
}

export async function updateArticle(
  id: number,
  updates: Partial<ArticleInput>,
): Promise<Article | null> {
  const now = new Date();
  const { data, error } = await supabaseAdmin
    .from("articles")
    .update({ ...updates, updated_at: now.toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update Article Error:", error);
    return null;
  }
  return data as Article;
}

export async function deleteArticle(id: number): Promise<boolean> {
  const { error } = await supabaseAdmin.from("articles").delete().eq("id", id);

  if (error) {
    console.error("Delete Article Error:", error);
    return false;
  }
  return true;
}

export async function getArticles(
  limit = 20,
  category?: string,
  featured?: boolean,
): Promise<Article[]> {
  let query = supabaseAdmin
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (category) query = query.eq("category", category);
  if (featured) query = query.eq("is_featured", true);

  const { data, error } = await query;
  if (error) {
    console.error("Get Articles Error:", error);
    return [];
  }
  return data as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data as Article;
}

export async function searchArticles(query: string): Promise<Article[]> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .ilike("title", `%${query}%`)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Search Articles Error:", error);
    return [];
  }
  return data as Article[];
}

// ---------------- Stocks ----------------

export async function createStock(input: StockInput): Promise<Stock> {
  const { data, error } = await supabaseAdmin
    .from("stocks")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Stock;
}

export async function getStocks(): Promise<Stock[]> {
  const { data, error } = await supabaseAdmin
    .from("stocks")
    .select("*")
    .order("symbol", { ascending: true });

  if (error) {
    console.error("Get Stocks Error:", error);
    return [];
  }
  return data as Stock[];
}

export async function getStock(symbol: string): Promise<Stock | null> {
  const { data, error } = await supabaseAdmin
    .from("stocks")
    .select("*")
    .eq("symbol", symbol)
    .single();

  if (error) return null;
  return data as Stock;
}

// Export the storage functions as an object named 'storage' to fix the import error in routes.ts
export const storage = {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticles,
  getArticleBySlug,
  searchArticles,
  createStock,
  getStocks,
  getStock,
};
