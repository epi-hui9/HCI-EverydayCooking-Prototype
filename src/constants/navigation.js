/**
 * App navigation: order and labels for the top bar (matches user flow).
 */
export const NAV_ORDER = [
  "Home",
  "Fridge",
  "Recipe",
  "Energy",
  "Recipe Details",
  "Chat",
];

export const NAV_LABELS = {
  Recipe: "Ingredients",
};

export const getNavLabel = (key) => NAV_LABELS[key] ?? key;
