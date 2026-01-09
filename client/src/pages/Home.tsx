import { useArticles } from "@/hooks/use-articles";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StockTicker } from "@/components/ui/stock-ticker";
import { MarketSnapshot } from "@/components/home/MarketSnapshot";
import { NewsCard } from "@/components/articles/NewsCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: articles, isLoading } = useArticles({ limit: "10" });

  const featuredArticle = articles?.find(a => a.isFeatured) || articles?.[0];
  const editorPicks = articles?.filter(a => a.isEditorPick).slice(0, 3) || [];
  const latestNews = articles?.filter(a => a.id !== featuredArticle?.id && !a.isEditorPick) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      <StockTicker />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-serif font-bold mb-6 flex items-center">
            <TrendingUp className="w-8 h-8 text-primary mr-3" />
            Market Snapshot
          </h1>
          <MarketSnapshot />
          
          {isLoading ? (
            <Skeleton className="w-full h-[500px] rounded-2xl" />
          ) : featuredArticle ? (
            <NewsCard article={featuredArticle} featured />
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content - Latest News */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-foreground decoration-primary decoration-4 underline-offset-8">
                Latest Market News
              </h2>
              <Link href="/category/news">
                <Button variant="ghost" className="text-primary hover:text-primary/80 group">
                  View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {latestNews.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Editor's Picks & Tools */}
          <div className="lg:col-span-4 space-y-8">
            {/* Editor's Picks */}
            <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
              <h3 className="text-xl font-serif font-bold mb-4 flex items-center">
                <span className="w-1 h-6 bg-primary mr-3 rounded-full"></span>
                Editor's Picks
              </h3>
              <div className="space-y-6">
                {isLoading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)
                ) : editorPicks.length > 0 ? (
                  editorPicks.map(article => (
                    <Link key={article.id} href={`/article/${article.slug}`}>
                      <div className="flex gap-4 group cursor-pointer">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0 group-hover:opacity-90 transition-opacity"
                        />
                        <div>
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                            {article.title}
                          </h4>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                            {article.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground">No picks available.</p>
                )}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-primary text-white rounded-2xl p-6 shadow-xl shadow-primary/20">
              <h3 className="text-xl font-bold font-serif mb-2">Daily Market Brief</h3>
              <p className="text-primary-foreground/90 text-sm mb-4">
                Join 50,000+ investors getting the smartest analysis in their inbox.
              </p>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full rounded-lg px-4 py-2 text-foreground mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button variant="secondary" className="w-full font-bold text-primary hover:bg-white">
                Subscribe Free
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
