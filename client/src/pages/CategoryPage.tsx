import { useArticles } from "@/hooks/use-articles";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRoute } from "wouter";
import { NewsCard } from "@/components/articles/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const [_, params] = useRoute("/category/:category");

  // category here is SLUG (example: "personal-finance")
  const categorySlug = params?.category || "all";

  // Convert slug → title for display only
  const title =
    categorySlug === "all"
      ? "All Articles"
      : categorySlug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

  // Map slug back to exactly what is stored in the database if necessary
  const categoryMap: Record<string, string> = {
    "market-news": "News",
    "cryptocurrency": "Cryptocurrency",
    "personal-finance": "Personal Finance",
    "ipo-analysis": "IPO Analysis",
    "stock-ideas": "Stock Ideas",
    "fpo-analysis": "FPO Analysis",
    "results": "Results",
    "news": "News"
  };

  const dbCategory = categoryMap[categorySlug] || categorySlug;

  // IMPORTANT: Send the correct category name to backend
  const { data: articles, isLoading } = useArticles({
    category: categorySlug === "all" ? undefined : dbCategory,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Helmet>
        <title>{title} | FinSight</title>
        <meta
          name="description"
          content={`Latest ${title} news, analysis, and insights on FinSight.`}
        />
        <link
          rel="canonical"
          href={`${window.location.origin}/category/${categorySlug}`}
        />
      </Helmet>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
              {title}
            </h1>
            <p className="text-muted-foreground">
              Latest insights and news in {title}
            </p>
          </div>

          <div className="hidden md:flex gap-2">
            <Button variant="outline" className="rounded-full">
              Latest
            </Button>
            <Button variant="outline" className="rounded-full">
              Popular
            </Button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Articles */}
        {!isLoading && articles && articles.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!articles || articles.length === 0) && (
          <div className="text-center py-20 bg-secondary/30 rounded-3xl">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">
              No articles found
            </h2>
            <p className="text-muted-foreground mb-8">
              There are no published articles in this category yet.
            </p>
            <Button asChild>
              <a href="/">Back to Home</a>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
