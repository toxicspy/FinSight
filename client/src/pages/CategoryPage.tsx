import { useArticles } from "@/hooks/use-articles";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRoute } from "wouter";
import { NewsCard } from "@/components/articles/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const [_, params] = useRoute("/category/:category");
  const category = params?.category || "all";
  
  // Format category name for display (e.g., "personal-finance" -> "Personal Finance")
  const title = category.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const { data: articles, isLoading } = useArticles({ category: category === "all" ? undefined : title });

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">Latest insights and news in {title}</p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" className="rounded-full">Most Popular</Button>
            <Button variant="outline" className="rounded-full">Latest</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-96 rounded-2xl" />)}
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/30 rounded-3xl">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">No articles found</h2>
            <p className="text-muted-foreground mb-8">Check back later for updates in this category.</p>
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
