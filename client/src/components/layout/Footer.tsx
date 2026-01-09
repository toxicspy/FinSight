import { Link } from "wouter";
import { TrendingUp, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 font-serif font-bold text-2xl text-white">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span>FinSight</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              India's most trusted financial news and analysis platform. We help you make informed investment decisions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Market News</Link></li>
              <li><Link href="/category/analysis" className="hover:text-primary transition-colors">Stock Analysis</Link></li>
              <li><Link href="/category/ipo" className="hover:text-primary transition-colors">IPO Center</Link></li>
              <li><Link href="/category/finance" className="hover:text-primary transition-colors">Personal Finance</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-serif font-semibold text-white text-lg mb-4">Tools</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/analytics" className="hover:text-primary transition-colors">Stock Screener</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">SIP Calculator</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Income Tax Calculator</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Market Heatmap</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif font-semibold text-white text-lg mb-4">Subscribe</h3>
            <p className="text-sm text-slate-400 mb-4">Get the latest market insights delivered to your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-800 border-none rounded px-3 py-2 text-sm w-full focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} FinSight Media. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
