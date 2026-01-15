import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ArticleDetail from "@/pages/ArticleDetail";
import CategoryPage from "@/pages/CategoryPage";
import MarketCategoryPage from "@/pages/MarketCategoryPage";
import Analytics from "@/pages/Analytics";
import AdminCMS from "@/pages/AdminCMS";
import CMSLogin from "@/pages/CMSLogin";
import Search from "./pages/Search";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/article/:slug" component={ArticleDetail} />
      <Route path="/market/:category" component={MarketCategoryPage} />
      <Route path="/category/:category" component={CategoryPage} />
      {/* Analytics is already protected inside the component */}
      <Route path="/analytics" component={Analytics} />
      <Route path="/admin" component={AdminCMS} />
      <Route path="/adminCMS" component={AdminCMS} />
      <Route path="/cms-login" component={CMSLogin} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
