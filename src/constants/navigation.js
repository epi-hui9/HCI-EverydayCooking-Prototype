/**
 * Bottom tab bar (4 items, mobile-style). Shown on main app screens.
 */
export const BOTTOM_NAV_TABS = ["Home", "Fridge", "Recipe", "Chat"];

export const NAV_LABELS = {
  Recipe: "Recipes",
};

export const getNavLabel = (key) => NAV_LABELS[key] ?? key;

/** Which bottom tab is active for a given page (for stack pages like Energy, Recipe Details). */
export function getActiveTabForPage(page) {
  if (["Energy", "Recipe Details"].includes(page)) return "Recipe";
  if (page === "Recipe Selection" || page === "Recipe") return "Recipe";
  if (page === "History" || page === "WeeklyPlan") return "Home";
  return page;
}
