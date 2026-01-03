/**
 * Footer Component - Global footer (Mobile-First)
 * 
 * Layout (2 columns - shadcn grid/flex):
 * - Left: Powered by BRND® Consulting
 * - Right: All rights reserved 2026
 * 
 * Rules:
 * - Typography/colors from theme (no manual styles)
 * - Year 2026 is fixed (legal/branding content, allowed hardcode)
 */

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container flex flex-col sm:flex-row h-auto sm:h-12 items-center justify-between gap-2 py-3 sm:py-0 text-xs text-muted-foreground">
        <div className="text-center sm:text-left">
          Powered by{" "}
          <span className="font-medium text-foreground">BRND® Consulting</span>
        </div>
        <div className="text-center sm:text-right">
          All rights reserved 2026
        </div>
      </div>
    </footer>
  );
}
