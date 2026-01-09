import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// Fetch all stocks for ticker/market view
export function useStocks() {
  return useQuery({
    queryKey: [api.stocks.list.path],
    queryFn: async () => {
      const res = await fetch(api.stocks.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stocks");
      return api.stocks.list.responses[200].parse(await res.json());
    },
    refetchInterval: 30000, // Refresh every 30s
  });
}

// Fetch single stock details
export function useStock(symbol: string) {
  return useQuery({
    queryKey: [api.stocks.get.path, symbol],
    queryFn: async () => {
      const url = buildUrl(api.stocks.get.path, { symbol });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch stock");
      return api.stocks.get.responses[200].parse(await res.json());
    },
    enabled: !!symbol,
  });
}
