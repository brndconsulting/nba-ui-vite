/**
 * Global Header - Navigation + Theme Controls + Sync Status
 * 
 * Shadcn-only components:
 * - NavigationMenu for nav links
 * - ThemeSelector for color themes
 * - ModeToggle for light/dark
 * - Badge for sync status
 * - DropdownMenu for context/actions
 */

import { useAppContext } from "@/contexts/ContextProvider";
import { ThemeSelector } from "./ThemeSelector";
import { ModeToggle } from "./ModeToggle";
import { ContextSelector } from "./ContextSelector";
import { SyncStatusIndicator } from "./SyncStatusIndicator";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";

export function Header() {
  const context = useAppContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="font-bold text-lg">NBA UI</div>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/matchup" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Matchup
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/waiver" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Waiver
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Insider
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Center: Context label (optional) */}
        {context?.activeLeague && (
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>{context.activeLeague.name}</span>
            {context.activeTeam && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span>{context.activeTeam.name}</span>
              </>
            )}
          </div>
        )}

        {/* Right: Sync Status + Theme + Mode + Context */}
        <div className="flex items-center gap-3">
          {/* Sync Status Indicator */}
          <SyncStatusIndicator />

          {/* Theme Selector (color themes) */}
          <ThemeSelector />

          {/* Light/Dark Toggle */}
          <ModeToggle />

          {/* Context Selector */}
          <ContextSelector />
        </div>
      </div>
    </header>
  );
}
