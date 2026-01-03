/**
 * MinimalHeader - For Landing and Select pages
 * 
 * Layout:
 * - Left: Brand (Trophy icon + "Sport Insider")
 * - Right: Theme selector (color) + Theme toggle (dark/light)
 * 
 * 100% shadcn/ui components only
 */
import { Trophy } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "../ThemeSelector";
import { ThemeToggle } from "../ThemeToggle";

export function MinimalHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        {/* Brand */}
        <Link href="/">
          <Button variant="ghost" className="gap-2 px-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="font-semibold">Sport Insider</span>
          </Button>
        </Link>
        
        {/* Theme Controls */}
        <div className="flex items-center gap-1">
          <ThemeSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
