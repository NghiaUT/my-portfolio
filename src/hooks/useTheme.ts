import { useContext } from "react";
import type { ThemeContextValue } from "../types/index.type";
import { ThemeContext } from "../context/ThemeContext";

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
