import { useArticles } from "@/hooks/use-articles";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NewsCard } from "@/components/articles/NewsCard";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function SearchPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("q") || "";
  
  const { data: articles, isLoading } = useArticles();

  // Filter articles based on search query
  const filteredArticles = articles?.filter(article => {
    const searchStr = query.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchStr) ||
      article.summary.toLowerCase().includes(searchStr) ||
      article.content.toLowerCase().includes(searchStr) ||
      (article.category && article.category.toLowerCase().includes(searchStr))
    );
  }) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Helmet>
        <title>Search results for "{query}" | FinSight</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-full">
            <SearchIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Search Results
            </h1>
            <p className="text-muted-foreground">
              Showing results for "{query}"
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any articles matching "{query}". Try checking for typos or using more general terms.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
