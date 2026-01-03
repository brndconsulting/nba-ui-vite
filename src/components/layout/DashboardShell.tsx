/**
 * Dashboard Shell - Global container for authenticated views
 * 
 * Design: shadcn-only, no hardcode estético
 * Structure: Header (fixed) + Content (outlet) + Footer (global)
 */
import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header - Fixed at top */}
      <Header />
      
      {/* Main Content - Flexible grow */}
      <main className="flex-1 container py-6">
        {children}
      </main>
      
      {/* Footer - Always at bottom */}
      <Footer />
    </div>
  );
}
