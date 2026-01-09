import { useParams } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useArticles } from "@/hooks/use-articles";

export default function MarketCategoryPage() {
  const { category } = useParams();
  const { data: articles, isLoading } = useArticles(category);
  const title = category?.replace(/-/g, " ").toUpperCase() || "MARKET SEGMENT";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground mt-1">Latest insights and analysis for {title.toLowerCase()}</p>
            </div>
          </div>

          <div className="grid gap-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : articles && articles.length > 0 ? (
              articles.map((article) => (
                <Card key={article.id} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div 
                        className="w-full md:w-1/3 aspect-video bg-muted rounded-md bg-cover bg-center"
                        style={{ backgroundImage: `url(${article.imageUrl})` }}
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">{article.category}</span>
                          <span className="text-xs text-muted-foreground">
                            • {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <Link href={`/article/${article.slug}`}>
                          <h2 className="text-2xl font-serif font-bold hover:text-primary cursor-pointer transition-colors leading-tight">
                            {article.title}
                          </h2>
                        </Link>
                        <p className="text-muted-foreground line-clamp-2">
                          {article.summary}
                        </p>
                        <Link href={`/article/${article.slug}`} className="inline-flex items-center text-sm font-bold text-primary hover:underline">
                          Read full article <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="bg-secondary rounded-lg p-8 text-center border border-dashed border-muted-foreground/20 mt-12">
                <h3 className="text-xl font-serif font-bold mb-2 text-secondary-foreground">No Articles Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Articles and analysis for this segment will appear here once published by the admin.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
