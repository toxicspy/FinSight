import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type Article, type InsertArticle } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// Fetch all articles with optional filters
export function useArticles(filters?: { category?: string; featured?: string; limit?: string }) {
  return useQuery({
    queryKey: [api.articles.list.path, filters],
    queryFn: async () => {
      const url = buildUrl(api.articles.list.path);
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.featured) params.append("featured", filters.featured);
      if (filters?.limit) params.append("limit", filters.limit);
      
      const res = await fetch(`${url}?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch articles");
      return api.articles.list.responses[200].parse(await res.json());
    },
  });
}

// Fetch single article by slug
export function useArticle(slug: string) {
  return useQuery({
    queryKey: [api.articles.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.articles.get.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch article");
      return api.articles.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

// Create new article (CMS)
export function useCreateArticle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertArticle) => {
      const res = await fetch(api.articles.create.path, {
        method: api.articles.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create article");
      }
      return api.articles.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.articles.list.path] });
      toast({
        title: "Success",
        description: "Article published successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
