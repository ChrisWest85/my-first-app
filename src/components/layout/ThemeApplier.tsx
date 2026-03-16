"use client";

import { useEffect } from "react";
import { useActiveMember } from "@/contexts/ActiveMemberContext";
import { useTheme, type ThemeValue } from "@/contexts/ThemeContext";

const THEME_CLASSES: Record<ThemeValue, string> = {
  standard: "",
  "kids-vivid": "theme-kids-vivid",
  "kids-soft": "theme-kids-soft",
};

/**
 * ThemeApplier reads the active member's theme and sets
 * the corresponding CSS class on <html>. No visual output.
 */
export function ThemeApplier() {
  const { activeMember } = useActiveMember();
  const { getTheme } = useTheme();

  const activeTheme = activeMember ? getTheme(activeMember.id) : "standard";

  useEffect(() => {
    const html = document.documentElement;

    // Remove all theme classes
    html.classList.remove("theme-kids-vivid", "theme-kids-soft");

    // Add active theme class
    const cls = THEME_CLASSES[activeTheme];
    if (cls) {
      html.classList.add(cls);
    }

    return () => {
      html.classList.remove("theme-kids-vivid", "theme-kids-soft");
    };
  }, [activeTheme]);

  return null;
}
