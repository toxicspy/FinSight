import { useAuth } from "@/hooks/use-auth";
import { useArticles, useCreateArticle, useUpdateArticle, useDeleteArticle } from "@/hooks/use-articles";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertArticleSchema, type Article } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Schema for the form
const formSchema = insertArticleSchema.extend({
  // Override or add specific validations if needed
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminCMS() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: articles, isLoading: articlesLoading } = useArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&h=600&fit=crop", /* Stock market chart image */
      authorName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Admin",
      isFeatured: false,
      isEditorPick: false,
    },
  });

  // Load article into form when editing
  useEffect(() => {
    if (editingArticle) {
      form.reset({
        title: editingArticle.title,
        slug: editingArticle.slug,
        summary: editingArticle.summary,
        content: editingArticle.content,
        category: editingArticle.category,
        imageUrl: editingArticle.imageUrl,
        authorName: editingArticle.authorName,
        isFeatured: editingArticle.isFeatured || false,
        isEditorPick: editingArticle.isEditorPick || false,
      });
      setIsFormVisible(true);
    } else {
      form.reset({
        title: "",
        slug: "",
        summary: "",
        content: "",
        category: "News",
        imageUrl: "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&h=600&fit=crop",
        authorName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Admin",
        isFeatured: false,
        isEditorPick: false,
      });
    }
  }, [editingArticle, form, user]);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("title", e.target.value);
    if (!editingArticle) {
      const slug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      form.setValue("slug", slug);
    }
  };

  function onSubmit(data: FormValues) {
    if (editingArticle) {
      updateArticle.mutate({ id: editingArticle.id, data }, {
        onSuccess: () => {
          setEditingArticle(null);
          setIsFormVisible(false);
        },
      });
    } else {
      createArticle.mutate(data, {
        onSuccess: () => {
          form.reset();
          setIsFormVisible(false);
        },
      });
    }
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      deleteArticle.mutate(id);
    }
  };

  if (authLoading) return null;

  if (!user) {
    window.location.href = "/api/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Content Management System</h1>
          {!isFormVisible && (
            <Button onClick={() => { setEditingArticle(null); setIsFormVisible(true); }}>
              <Plus className="mr-2 h-4 w-4" /> New Article
            </Button>
          )}
        </div>

        {isFormVisible ? (
          <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-serif">
                  {editingArticle ? "Edit Article" : "Create New Article"}
                </CardTitle>
                <CardDescription>
                  {editingArticle ? "Update existing content." : "Publish news, analysis, or insights to the platform."}
                </CardDescription>
              </div>
              <Button variant="ghost" onClick={() => setIsFormVisible(false)}>Cancel</Button>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                     <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Market hits record high..." {...field} onChange={(e) => {
                              field.onChange(e);
                              handleTitleChange(e);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug (URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="market-hits-record-high" {...field} disabled={!!editingArticle} />
                          </FormControl>
                          <FormDescription>Unique URL identifier</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief overview for the card display..." className="resize-none h-24" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Indian Markets">Indian Markets</SelectItem>
                              <SelectItem value="News">News</SelectItem>
                              <SelectItem value="Analysis">Analysis</SelectItem>
                              <SelectItem value="IPO">IPO</SelectItem>
                              <SelectItem value="Personal Finance">Personal Finance</SelectItem>
                              <SelectItem value="Economy">Economy</SelectItem>
                              <SelectItem value="Learn">Learn</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="authorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>Use a direct link to an image (Unsplash recommended)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content (HTML/Markdown support)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write your article content here..." className="min-h-[300px] font-mono text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col md:flex-row gap-8 p-4 bg-secondary/30 rounded-lg">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full bg-white">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured Article</FormLabel>
                            <FormDescription>
                              Show in the main hero section
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isEditorPick"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full bg-white">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Editor's Pick</FormLabel>
                            <FormDescription>
                              Show in sidebar recommendations
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={createArticle.isPending || updateArticle.isPending}>
                    {(createArticle.isPending || updateArticle.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingArticle ? "Update Article" : "Publish Article"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Articles</CardTitle>
              <CardDescription>Manage your published content.</CardDescription>
            </CardHeader>
            <CardContent>
              {articlesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Published At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles?.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium max-w-[300px] truncate">{article.title}</TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {article.isFeatured && <Badge variant="default">Featured</Badge>}
                            {article.isEditorPick && <Badge variant="secondary">Editor's Pick</Badge>}
                            {!article.isFeatured && !article.isEditorPick && <Badge variant="outline">Standard</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(article)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(article.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {articles?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          No articles found. Create your first one!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
