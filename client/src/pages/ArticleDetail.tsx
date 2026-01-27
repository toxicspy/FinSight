import { useArticle, useArticles } from "@/hooks/use-articles";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRoute, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NewsCard } from "@/components/articles/NewsCard";

export default function ArticleDetail() {
  const [_, params] = useRoute("/article/:slug");
  const slug = params?.slug || "";
  const { data: article, isLoading, error } = useArticle(slug);
  const { data: allArticles } = useArticles();

  const moreArticles = allArticles
    ? allArticles
        .filter((a) => a.id !== article?.id)
        .slice(0, 3)
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-4xl flex-grow">
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center flex-grow" data-testid="status-error">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The article you are looking for might have been moved or deleted.</p>
          <Link href="/">
            <Button variant="default" data-testid="link-back-home">Return to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const articleImageUrl = article.imageUrl || (article as any).image_url || 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&h=600&fit=crop';
  const authorName = article.authorName || (article as any).author_name || 'Anonymous';
  const authorInitial = authorName[0]?.toUpperCase() || 'A';

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Helmet>
        <title>{article.title} | FinSight</title>
        <meta name="description" content={article.summary || article.title} />
        <link rel="canonical" href={window.location.href} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:image" content={articleImageUrl} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.summary} />
        <meta name="twitter:image" content={articleImageUrl} />
      </Helmet>
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
                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}`} />
                <AvatarFallback>{authorInitial}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">{authorName}</p>
                <p className="text-xs text-muted-foreground">Financial Analyst</p>
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">Published</p>
              <p className="text-xs font-medium" style={{ color: '#137333' }}>
                🕒 {formatDateTime(article.publishedAt || (article as any).published_at)}
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
            src={articleImageUrl} 
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <article className="prose prose-lg prose-slate max-w-none mb-12 prose-headings:font-serif prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl dark:prose-invert">
           <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
        </article>

        {/* Disclaimer */}
        <Alert className="bg-secondary/50 border-primary/20 mb-16">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-bold mb-2">Investment Disclaimer</AlertTitle>
          <AlertDescription className="text-muted-foreground text-sm">
            The content provided here is for informational purposes only and does not constitute financial advice. 
            Investments in securities market are subject to market risks. Read all the related documents carefully before investing.
          </AlertDescription>
        </Alert>

        {/* More Articles Section */}
        {moreArticles.length > 0 && (
          <div className="mt-16 pt-16 border-t border-border">
            <h2 className="text-2xl font-serif font-bold mb-8 text-foreground">
              More Articles You May Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moreArticles.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
