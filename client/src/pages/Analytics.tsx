import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useStocks } from "@/hooks/use-stocks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock chart data
const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

export default function Analytics() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: stocks, isLoading: stocksLoading } = useStocks();

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center p-8 shadow-xl">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-serif font-bold mb-2">Premium Analytics</h1>
            <p className="text-muted-foreground mb-8">
              Please login to access the advanced stock screener, watchlist, and portfolio analysis tools.
            </p>
            <Button className="w-full" size="lg" asChild>
              <a href="/api/login">Login to Access</a>
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Market Dashboard</h1>
            <p className="text-slate-500">Welcome back, {user.firstName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button className="gap-2">
              <Filter className="w-4 h-4" /> Filter View
            </Button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
           <Card className="lg:col-span-2 shadow-sm">
             <CardHeader>
               <CardTitle>Portfolio Performance</CardTitle>
             </CardHeader>
             <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data}>
                   <defs>
                     <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#16A34A" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} />
                   <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                   <Tooltip />
                   <Area type="monotone" dataKey="uv" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                 </AreaChart>
               </ResponsiveContainer>
             </CardContent>
           </Card>

           <Card className="shadow-sm">
             <CardHeader>
               <CardTitle>Watchlist</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                  {stocksLoading ? (
                    [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)
                  ) : (
                    stocks?.slice(0, 5).map(stock => {
                      const isPositive = parseFloat(stock.change) >= 0;
                      return (
                        <div key={stock.symbol} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                          <div>
                            <div className="font-bold text-sm">{stock.symbol}</div>
                            <div className="text-xs text-muted-foreground">{stock.name}</div>
                          </div>
                          <div className="text-right">
                             <div className="font-mono text-sm font-medium">{stock.price}</div>
                             <div className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
                               {stock.changePercent}%
                             </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <Button variant="ghost" className="w-full text-primary text-sm">View All Watchlist</Button>
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Screener Table */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Stock Screener</CardTitle>
            <div className="relative w-64">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input placeholder="Search symbol..." className="pl-9" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Change %</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocksLoading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  stocks?.map(stock => {
                     const isPositive = parseFloat(stock.change) >= 0;
                     return (
                      <TableRow key={stock.symbol}>
                        <TableCell className="font-medium font-mono text-primary">{stock.symbol}</TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell>{stock.price}</TableCell>
                        <TableCell className={isPositive ? "text-green-600" : "text-red-600"}>{stock.change}</TableCell>
                        <TableCell>
                           <Badge variant={isPositive ? "default" : "destructive"} className={isPositive ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}>
                             {stock.changePercent}%
                           </Badge>
                        </TableCell>
                        <TableCell>{stock.sector || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Details</Button>
                        </TableCell>
                      </TableRow>
                     );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </main>
      <Footer />
    </div>
  );
}
