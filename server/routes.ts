import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

import { supabaseAdmin } from "./lib/supabase-admin";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Setup Replit Auth (Keep if still needed, but we'll use Supabase for CMS)
  await setupAuth(app);
  registerAuthRoutes(app);

  // Secure API route for publishing articles (uses Supabase Admin client)
  app.post("/api/admin/articles", async (req, res) => {
    try {
      // In a real app, verify the Supabase session here
      const {
        title,
        slug,
        summary,
        content,
        category,
        imageUrl,
        authorName,
        isFeatured,
        isEditorPick,
      } = req.body;

      if (!supabaseAdmin) {
        return res
          .status(500)
          .json({ error: "Supabase Admin client not configured" });
      }

      const { data, error } = await supabaseAdmin
        .from("articles")
        .insert({
          title,
          slug,
          summary,
          content,
          category,
          image_url: imageUrl,
          author_name: authorName,
          is_featured: isFeatured,
          is_editor_pick: isEditorPick,
          status: "published",
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return res.status(500).json({ error: error.message });
      }

      console.log("Article published to Supabase:", data);
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Articles Routes
  // ---------------- GET ALL ARTICLES ----------------
  app.get(api.articles.list.path, async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const featured = req.query.featured === "true";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      if (!supabaseAdmin) {
        return res.status(500).json({ error: "Supabase not configured" });
      }

      let query = supabaseAdmin
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(limit);

      if (category) {
        query = query.eq("category", category);
      }

      if (featured) {
        query = query.eq("is_featured", true);
      }

      const { data, error } = await query;

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(data ?? []);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get(api.articles.get.path, async (req, res) => {
    const article = await storage.getArticleBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  });

  app.post(api.articles.create.path, async (req, res) => {
    try {
      // In a real app, check for admin role here
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const input = api.articles.create.input.parse(req.body);
      const article = await storage.createArticle(input);
      res.status(201).json(article);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
    }
  });

  app.patch(api.articles.update.path, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const input = api.articles.update.input.parse(req.body);
      const article = await storage.updateArticle(id, input);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json(article);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
    }
  });

  app.delete(api.articles.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = parseInt(req.params.id);
    const success = await storage.deleteArticle(id);

    if (!success) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.sendStatus(204);
  });

  app.get(api.articles.search.path, async (req, res) => {
    try {
      const { q } = api.articles.search.input.parse(req.query);

      if (!q || q.trim() === "") {
        return res.json([]);
      }

      const results = await storage.searchArticles(q.trim());
      res.json(results);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid search query" });
      } else {
        console.error("Search error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Stocks Routes
  app.get(api.stocks.list.path, async (req, res) => {
    const stocks = await storage.getStocks();
    res.json(stocks);
  });

  app.get(api.stocks.get.path, async (req, res) => {
    const stock = await storage.getStock(req.params.symbol);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.json(stock);
  });

  // Dynamic Sitemap Route
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      const baseUrl = `https://${req.get("host")}`;

      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

      // Homepage
      xml += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

      // Main Categories
      const categories = [
        "market-news",
        "cryptocurrency",
        "personal-finance",
        "ipo-analysis",
        "stock-ideas",
        "fpo-analysis",
        "results",
      ];

      categories.forEach((cat) => {
        xml += `
  <url>
    <loc>${baseUrl}/category/${cat}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      });

      // All Articles
      articles.forEach((article) => {
        xml += `
  <url>
    <loc>${baseUrl}/post/${article.slug}</loc>
    <lastmod>${new Date(article.publishedAt || new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });

      xml += "</urlset>";

      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (err) {
      console.error("Sitemap generation error:", err);
      res.status(500).end();
    }
  });

  // Market Category Catch-all (Temporary for migration)
  app.get("/market/:category", (req, res) => {
    const category = req.params.category;
    res.send(`
      <html>
        <head>
          <title>${category.replace(/-/g, " ")} | Market Segments</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f9f9f9;
              padding: 40px;
            }
            h1 {
              color: #137333;
            }
          </style>
        </head>
        <body>
          <h1>${category.replace(/-/g, " ").toUpperCase()}</h1>
          <p>Articles for this category will appear here.</p>
          <a href="/">Back to Home</a>
        </body>
      </html>
    `);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingArticles = await storage.getArticles(1);
  if (existingArticles.length === 0) {
    // Seed Articles
    await storage.createArticle({
      title: "Market Rally: Sensex Hits All-Time High",
      slug: "market-rally-sensex-high",
      summary:
        "Indian benchmark indices touched new highs today driven by banking and IT stocks.",
      content:
        "The BSE Sensex crossed the 75,000 mark for the first time... (Full article content)",
      category: "Indian Markets",
      imageUrl:
        "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=1000",
      authorName: "Market Analyst",
      isFeatured: true,
      tickerSymbol: "SENSEX",
    });

    await storage.createArticle({
      title: "Top 5 Mid-Cap Stocks for 2026",
      slug: "top-5-mid-cap-stocks-2026",
      summary:
        "A detailed analysis of mid-cap stocks showing strong growth potential.",
      content:
        "Mid-cap stocks have historically outperformed... (Full article content)",
      category: "Indian Markets",
      subcategory: "Mid Cap",
      imageUrl:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000",
      authorName: "Research Team",
      isFeatured: false,
    });
    await storage.createArticle({
      title: "Understanding IPOs: A Beginner's Guide",
      slug: "understanding-ipos-guide",
      summary:
        "Everything you need to know before investing in an Initial Public Offering.",
      content:
        "IPOs can be lucrative but carry risks... (Full article content)",
      category: "Learn",
      imageUrl:
        "https://images.unsplash.com/photo-1579532551690-3842daef459b?auto=format&fit=crop&q=80&w=1000",
      authorName: "Education Desk",
      isFeatured: false,
    });

    // Seed Stocks
    await storage.createStock({
      symbol: "SENSEX",
      name: "BSE Sensex",
      price: "75,124.50",
      change: "+350.20",
      changePercent: "+0.47%",
      sector: "Index",
    });
    await storage.createStock({
      symbol: "NIFTY",
      name: "Nifty 50",
      price: "22,642.80",
      change: "+110.15",
      changePercent: "+0.49%",
      sector: "Index",
    });
    await storage.createStock({
      symbol: "RELIANCE",
      name: "Reliance Ind.",
      price: "2,980.00",
      change: "+15.00",
      changePercent: "+0.51%",
      sector: "Energy",
    });
    await storage.createStock({
      symbol: "TCS",
      name: "TCS",
      price: "3,950.00",
      change: "-12.50",
      changePercent: "-0.32%",
      sector: "Technology",
    });
    await storage.createStock({
      symbol: "HDFCBANK",
      name: "HDFC Bank",
      price: "1,540.00",
      change: "+22.00",
      changePercent: "+1.45%",
      sector: "Banking",
    });
  }
}
