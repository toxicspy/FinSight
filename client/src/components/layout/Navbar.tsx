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
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const navItems = [
    { name: "Market News", path: "/", icon: <TrendingUp className="w-4 h-4 mr-2" /> },
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
                  <Link href={item.path}>
                    <div className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary cursor-pointer ${isActive(item.path) ? "text-primary font-bold" : "text-muted-foreground"}`}>
                      {item.name}
                    </div>
                  </Link>
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
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search stocks, news..."
              className="w-full rounded-full bg-secondary px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

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
                  <Link key={item.path} href={item.path} onClick={() => setIsMobileOpen(false)}>
                     <div className={`flex items-center text-lg font-medium ${isActive(item.path) ? "text-primary" : "text-foreground"}`}>
                        {item.icon}
                        {item.name}
                     </div>
                  </Link>
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
