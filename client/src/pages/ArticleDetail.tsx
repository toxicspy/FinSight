import { useArticle } from "@/hooks/use-articles";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ArticleDetail() {
  const [_, params] = useRoute("/article/:slug");
  const slug = params?.slug || "";
  const { data: article, isLoading } = useArticle(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) return <div>Article not found</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 text-sm font-bold tracking-wide border-none">
            {article.category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            {article.summary}
          </p>

          <div className="flex items-center justify-center space-x-6 border-y border-border py-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={`https://ui-avatars.com/api/?name=${article.authorName}`} />
                <AvatarFallback>{article.authorName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">{article.authorName}</p>
                <p className="text-xs text-muted-foreground">Financial Analyst</p>
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">Published</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(article.publishedAt || ""), "MMM dd, yyyy • h:mm a")}
              </p>
            </div>
            <div className="flex-grow md:flex-grow-0 md:ml-auto flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-black/5">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <article className="prose prose-lg prose-slate max-w-none mb-12 prose-headings:font-serif prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl">
           <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
        </article>

        {/* Disclaimer */}
        <Alert className="bg-secondary/50 border-primary/20">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-bold mb-2">Investment Disclaimer</AlertTitle>
          <AlertDescription className="text-muted-foreground text-sm">
            The content provided here is for informational purposes only and does not constitute financial advice. 
            Investments in securities market are subject to market risks. Read all the related documents carefully before investing.
          </AlertDescription>
        </Alert>

      </main>
      <Footer />
    </div>
  );
}
