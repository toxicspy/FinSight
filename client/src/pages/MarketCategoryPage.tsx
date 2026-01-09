import { useParams } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function MarketCategoryPage() {
  const { category } = useParams();
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
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-1/3 aspect-video bg-muted rounded-md flex items-center justify-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">{title}</span>
                      <span className="text-xs text-muted-foreground">• 2 hours ago</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold hover:text-primary cursor-pointer transition-colors leading-tight">
                      Recent Developments in {title.toLowerCase()}
                    </h2>
                    <p className="text-muted-foreground line-clamp-2">
                      Market analysis and outlook for the {title.toLowerCase()} segment. Detailed insights into current trends and future projections.
                    </p>
                    <Link href="/" className="inline-flex items-center text-sm font-bold text-primary hover:underline">
                      Read full article <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-secondary rounded-lg p-8 text-center border border-dashed border-muted-foreground/20 mt-12">
              <h3 className="text-xl font-serif font-bold mb-2 text-secondary-foreground">Content Integration in Progress</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We are currently migrating real-time data for this specific segment. Articles and analysis will appear here shortly.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
