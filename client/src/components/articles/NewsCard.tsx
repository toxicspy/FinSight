import { Link } from "wouter";
import { type Article } from "@shared/schema";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  article: Article;
  featured?: boolean;
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  if (featured) {
    return (
      <Link href={`/article/${article.slug}`}>
        <div className="group relative overflow-hidden rounded-2xl cursor-pointer h-full min-h-[400px]">
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20" />
          
          <div className="absolute bottom-0 left-0 p-6 md:p-8 z-30 w-full">
            <Badge className="mb-4 bg-primary text-white hover:bg-primary/90 border-none">
              {article.category}
            </Badge>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-3 leading-tight group-hover:text-primary-foreground/90 transition-colors">
              {article.title}
            </h2>
            <p className="text-slate-200 line-clamp-2 md:line-clamp-3 mb-4 max-w-2xl text-lg">
              {article.summary}
            </p>
            <div className="flex items-center text-slate-300 text-sm font-medium">
              <span>{article.authorName}</span>
              <span className="mx-2">•</span>
              <span style={{ color: '#137333', fontWeight: 500 }}>
                🕒 {formatDateTime(article.publishedAt || "")}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`}>
      <div className="group flex flex-col h-full bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            loading="lazy"
            width="800"
            height="450"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge className="absolute top-3 left-3 bg-white/90 text-primary hover:bg-white backdrop-blur shadow-sm">
            {article.category}
          </Badge>
        </div>
        <div className="flex flex-col flex-grow p-5">
          <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
            {article.summary}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50">
            <span className="font-medium text-foreground">{article.authorName}</span>
            <span style={{ color: '#137333', fontWeight: 500 }}>
              🕒 {formatDateTime(article.publishedAt || "")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
