/**
 * Context Selector - Quick access to change active league/team
 * 
 * Uses ContextProvider to read/update context
 */

import { useAppContext } from "@/contexts/ContextProvider";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function ContextSelector() {
  const context = useAppContext();

  // If no context, show selector button
  if (!context?.activeLeague) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => {
          // Trigger context gate to show selector
          // This is handled by ContextGate component
        }}
      >
        <span className="hidden sm:inline">Select League</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
    );
  }

  // If context exists, show current selection
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 text-xs"
      onClick={() => {
        // Could open a menu to change context
        // For now, just show current selection
      }}
    >
      <span className="hidden sm:inline">{context.activeLeague.name}</span>
      {context.activeTeam && (
        <span className="hidden md:inline text-muted-foreground">
          {context.activeTeam.name}
        </span>
      )}
      <ChevronDown className="h-4 w-4" />
    </Button>
  );
}
