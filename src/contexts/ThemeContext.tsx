"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ThemeValue = "standard" | "kids-vivid" | "kids-soft";

export const THEME_OPTIONS: { value: ThemeValue; label: string; description: string }[] = [
  {
    value: "standard",
    label: "Standard",
    description: "Ruhig & uebersichtlich (fuer Erwachsene)",
  },
  {
    value: "kids-vivid",
    label: "Bunt & Verspielt",
    description: "Kraeftige Farben, Emojis, groessere Schrift",
  },
  {
    value: "kids-soft",
    label: "Sanft & Freundlich",
    description: "Pastelltoene, dezente Emojis, groessere Schrift",
  },
];

// ─── Storage ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "familyThemes";

type ThemeMap = Record<string, ThemeValue>;

function readThemes(): ThemeMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed as ThemeMap;
  } catch {
    return {};
  }
}

function writeThemes(themes: ThemeMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
  } catch {
    // Non-critical: silently fail
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  getTheme: (memberId: string) => ThemeValue;
  setTheme: (memberId: string, theme: ThemeValue) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themes, setThemes] = useState<ThemeMap>({});
  const themesRef = useRef<ThemeMap>({});

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = readThemes();
    themesRef.current = loaded;
    setThemes(loaded);
  }, []);

  // Listen for changes from other tabs
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        const loaded = readThemes();
        themesRef.current = loaded;
        setThemes(loaded);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const getTheme = useCallback(
    (memberId: string): ThemeValue => {
      const value = themes[memberId];
      if (value === "kids-vivid" || value === "kids-soft" || value === "standard") {
        return value;
      }
      return "standard";
    },
    [themes]
  );

  const setTheme = useCallback((memberId: string, theme: ThemeValue) => {
    const updated = { ...themesRef.current, [memberId]: theme };
    themesRef.current = updated;
    setThemes(updated);
    writeThemes(updated);
  }, []);

  return (
    <ThemeContext.Provider value={{ getTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
