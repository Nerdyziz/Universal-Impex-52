// ─── DYNAMIC THEME COLOR SYSTEM ─────────────────────────────────
// Colors are auto-assigned based on index or category — admin never enters them.

// Product card palette — cycles through these based on card index
export const PRODUCT_COLORS = [
  "#EEBA2B", // Gold / Amber
  "#1a1a1a", // Dark
  "#F5F0E8", // Warm Cream
  "#d4a017", // Deep Gold
  "#2d2d2d", // Charcoal
  "#E8DCC8", // Light Tan
];

// Brand card palette — cycles through these based on card index
export const BRAND_COLORS = [
  "#ffe430", // Bright Yellow
  "#d9d9d9", // Light Gray
  "#d9d9d9", // Light Gray
  "#ababab", // Medium Gray
  "#ffe430", // Bright Yellow
  "#d9d9d9", // Light Gray
];

// Category → color mapping (for single product detail pages)
export const CATEGORY_COLORS = {
  engine: "#EEBA2B",
  suspension: "#1a1a1a",
  turbo: "#d4a017",
  braking: "#2d2d2d",
  electrical: "#F5F0E8",
};

// ─── HELPERS ────────────────────────────────────────────────────

/** Returns true if a hex color is visually dark */
export function isDarkColor(hex) {
  if (!hex || hex.length < 7) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

/**
 * Get full product card theme by index.
 * Returns bg color + auto-derived text classes.
 */
export function getProductTheme(index) {
  const bg = PRODUCT_COLORS[index % PRODUCT_COLORS.length];
  const dark = isDarkColor(bg);
  return {
    bg,
    textColor: dark ? "text-white" : "text-black",
    descColor: dark ? "text-gray-400" : "text-black/70",
    numColor: dark ? "text-amber-400/40" : "text-black/40",
    isDark: dark,
  };
}

/**
 * Get brand card color by index.
 */
export function getBrandTheme(index) {
  return BRAND_COLORS[index % BRAND_COLORS.length];
}

/**
 * Get category-based color + derived classes for product detail pages.
 * Supports hierarchical category paths like "engines > turbos > twin-scroll".
 * Tries each segment from leaf to root to find a matching color.
 */
export function getCategoryTheme(category) {
  let bg = null;
  if (category) {
    // Try exact match first, then each segment from leaf to root
    const segments = category.split(" > ").map((s) => s.trim().toLowerCase());
    bg = CATEGORY_COLORS[category.toLowerCase()];
    if (!bg) {
      for (let i = segments.length - 1; i >= 0; i--) {
        if (CATEGORY_COLORS[segments[i]]) {
          bg = CATEGORY_COLORS[segments[i]];
          break;
        }
      }
    }
  }
  bg = bg || "#EEBA2B";
  const dark = isDarkColor(bg);
  return {
    bg,
    textColor: dark ? "text-white" : "text-black",
    descColor: dark ? "text-gray-400" : "text-black/70",
    numColor: dark ? "text-amber-400/40" : "text-black/40",
    isDark: dark,
  };
}
