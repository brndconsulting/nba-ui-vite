/**
 * ThemeSelector - Selector de temas de color shadcn
 * 
 * Diseño exacto como el de shadcn.com:
 * - Botón: "Theme: [nombre]" con chevron
 * - Dropdown: lista limpia de nombres con checkmark en el seleccionado
 * 
 * Usa data-theme en <html> para aplicar temas completos de shadcn
 * 100% shadcn/ui components
 */
import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Temas oficiales de shadcn/ui
const THEMES = [
  { name: "Default", value: "" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Orange", value: "orange" },
  { name: "Red", value: "red" },
  { name: "Rose", value: "rose" },
  { name: "Violet", value: "violet" },
  { name: "Yellow", value: "yellow" },
] as const;

type ThemeValue = typeof THEMES[number]["value"];

const STORAGE_KEY = "sport-insider-color-theme";

export function ThemeSelector() {
  const [theme, setTheme] = useState<ThemeValue>("");

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeValue | null;
    if (stored && THEMES.some(t => t.value === stored)) {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  const applyTheme = (newTheme: ThemeValue) => {
    const html = document.documentElement;
    
    if (newTheme) {
      html.setAttribute("data-theme", newTheme);
    } else {
      html.removeAttribute("data-theme");
    }
  };

  const handleThemeChange = (newTheme: ThemeValue) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    
    if (newTheme) {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const currentThemeName = THEMES.find(t => t.value === theme)?.name || "Default";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 gap-1 px-2 text-sm font-normal">
          <span className="text-muted-foreground">Theme:</span>
          <span>{currentThemeName}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.value || "default"}
            onClick={() => handleThemeChange(t.value)}
            className="flex items-center justify-between"
          >
            <span>{t.name}</span>
            {theme === t.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
