/**
 * ThemeToggle Component
 * Toggle between dark/light themes using document class
 * 
 * Note: Uses document.documentElement.classList directly since
 * the existing ThemeProvider handles base/accent colors, not dark/light mode
 */
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  
  useEffect(() => {
    // Check initial state from document
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));
  }, []);
  
  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
