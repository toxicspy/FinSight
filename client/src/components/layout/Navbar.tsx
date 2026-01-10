import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Search, Menu, User, LogOut, TrendingUp, BarChart2, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      console.log("Navigating to search with query:", query);
      setLocation(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery(""); // Clear search bar after submission
    }
  };

  const isActive = (path: string) => location === path;

  const navItems = [
    { name: "Market News", path: "/", icon: <TrendingUp className="w-4 h-4 mr-2" /> },
    { 
      name: "Market Segments", 
      path: "/market", 
      icon: <BarChart2 className="w-4 h-4 mr-2" />,
      items: [
        { name: "Bulk / Block Deals", path: "/market/bulk-block-deals" },
        { name: "Corporate Actions", path: "/market/corporate-actions" },
        { name: "Large Cap", path: "/market/large-cap" },
        { name: "Mid Cap", path: "/market/mid-cap" },
        { name: "Micro & Penny", path: "/market/micro-penny" },
        { name: "Recent Orders", path: "/market/recent-orders" },
        { name: "Results & Earnings", path: "/market/results" },
        { name: "IPO Analysis", path: "/market/ipo-analysis" },
        { name: "FPO Analysis", path: "/market/fpo-analysis" },
        { name: "Stock Ideas", path: "/market/stock-ideas" },
        { name: "Technical Analysis", path: "/market/technical-analysis" },
        { name: "Cryptocurrency", path: "/market/cryptocurrency" },
      ]
    },
    { name: "Analysis", path: "/category/analysis", icon: <BarChart2 className="w-4 h-4 mr-2" /> },
    { name: "Personal Finance", path: "/category/finance", icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: "Analytics", path: "/analytics", protected: true, icon: <BarChart2 className="w-4 h-4 mr-2" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 font-serif font-bold text-2xl tracking-tighter text-primary">
          <TrendingUp className="h-8 w-8" />
          <span>FinSight</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.filter(i => !i.protected || user).map((item) => (
                <NavigationMenuItem key={item.path}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                        <div className={`flex items-center text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location.startsWith(item.path) ? "text-primary font-bold" : "text-muted-foreground"}`}>
                          {item.name}
                        </div>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-950">
                          {item.items.map((subItem) => (
                            <li key={subItem.path}>
                              <NavigationMenuLink asChild>
                                <Link href={subItem.path}>
                                  <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#e6f4ea] hover:text-[#137333] dark:hover:bg-[#137333] dark:hover:text-white cursor-pointer text-black dark:text-white">
                                    <div className="text-sm font-medium leading-none">{subItem.name}</div>
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.path}>
                      <div className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary cursor-pointer ${isActive(item.path) ? "text-primary font-bold" : "text-muted-foreground"}`}>
                        {item.name}
                      </div>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
              
              {user && (
                 <NavigationMenuItem>
                   <Link href="/admin">
                    <div className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary cursor-pointer ${isActive('/admin') ? "text-primary font-bold" : "text-muted-foreground"}`}>
                      CMS
                    </div>
                   </Link>
                 </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search stocks, news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-secondary px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </form>

          {user ? (
            <div className="flex items-center gap-4">
               <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button asChild className="rounded-full font-semibold shadow-lg shadow-primary/20">
              <a href="/api/login">
                <User className="h-4 w-4 mr-2" />
                Login
              </a>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.filter(i => !i.protected || user).map((item) => (
                  <div key={item.path} className="flex flex-col space-y-2">
                    {item.items ? (
                      <>
                        <div className="flex items-center text-lg font-medium text-foreground py-2 border-b border-border/50">
                          {item.icon}
                          {item.name}
                        </div>
                        <div className="pl-6 flex flex-col space-y-3 mt-2">
                          {item.items.map((subItem) => (
                            <Link key={subItem.path} href={subItem.path} onClick={() => setIsMobileOpen(false)}>
                              <div className={`text-base ${isActive(subItem.path) ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                                {subItem.name}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link href={item.path} onClick={() => setIsMobileOpen(false)}>
                        <div className={`flex items-center text-lg font-medium ${isActive(item.path) ? "text-primary" : "text-foreground"}`}>
                          {item.icon}
                          {item.name}
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
                {user && (
                  <Link href="/admin" onClick={() => setIsMobileOpen(false)}>
                    <div className="flex items-center text-lg font-medium text-foreground">
                      <BookOpen className="w-4 h-4 mr-2" />
                      CMS
                    </div>
                  </Link>
                )}
                <div className="h-px bg-border my-4" />
                {user ? (
                   <Button variant="destructive" className="w-full justify-start" onClick={() => logout()}>
                     <LogOut className="h-4 w-4 mr-2" />
                     Logout
                   </Button>
                ) : (
                  <Button asChild className="w-full justify-start" variant="default">
                    <a href="/api/login">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </a>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
