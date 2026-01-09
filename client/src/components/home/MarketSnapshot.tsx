import { useStocks } from "@/hooks/use-stocks";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MarketSnapshot() {
  const { data: stocks, isLoading } = useStocks();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!stocks) return null;

  // Mock indices for the snapshot
  const indices = [
    { name: "NIFTY 50", value: "24,852.15", change: "+124.50", percent: "0.50" },
    { name: "SENSEX", value: "81,741.80", change: "-210.45", percent: "-0.26" },
    { name: "BANK NIFTY", value: "53,410.20", change: "+340.10", percent: "0.64" },
    { name: "NIFTY IT", value: "41,250.60", change: "+85.30", percent: "0.21" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {indices.map((idx) => {
        const isPositive = !idx.change.startsWith("-");
        return (
          <Card key={idx.name} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground mb-1">{idx.name}</div>
              <div className="text-xl font-bold font-mono tracking-tight text-foreground">{idx.value}</div>
              <div className={`flex items-center text-sm font-medium mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                {idx.change} ({idx.percent}%)
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
