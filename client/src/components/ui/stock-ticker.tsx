import { useStocks } from "@/hooks/use-stocks";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export function StockTicker() {
  const { data: stocks } = useStocks();

  if (!stocks || stocks.length === 0) return null;

  return (
    <div className="bg-slate-900 text-white overflow-hidden py-2 border-b border-primary/20">
      <div className="flex whitespace-nowrap">
        <motion.div 
          className="flex space-x-8 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {[...stocks, ...stocks].map((stock, idx) => {
            const isPositive = parseFloat(stock.change) >= 0;
            return (
              <div key={`${stock.symbol}-${idx}`} className="flex items-center space-x-2 text-sm font-mono">
                <span className="font-bold text-slate-300">{stock.symbol}</span>
                <span>{stock.price}</span>
                <span className={`flex items-center ${isPositive ? "text-green-400" : "text-red-400"}`}>
                  {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                  {stock.change} ({stock.changePercent}%)
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
