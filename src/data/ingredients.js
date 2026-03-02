/**
 * Ingredient emoji mapping and default fridge data.
 * Used by both Fridge (Your Food) and Recipe Selection pages for consistency.
 */

export const INGREDIENT_EMOJI = {
  Spinach: "🥬",
  Garlic: "🧄",
  "Ground Beef": "🐂",
  Onions: "🧅",
  Eggs: "🥚",
  Milk: "🥛",
  "Chicken Breast": "🍗",
  Tomato: "🍅",
  Tomatoes: "🍅",
  Broccoli: "🥦",
  Cheese: "🧀",
  Eggplant: "🍆",
  Corn: "🌽",
  Chips: "🥔",
  Twizzlers: "🍬",
};

export const getEmoji = (name) => INGREDIENT_EMOJI[name] ?? "🥗";

/**
 * Maps ingredient name variations to a canonical form for matching.
 */
const CANONICAL_MAP = {
  tomato: "tomato",
  tomatoes: "tomato",
  egg: "egg",
  eggs: "egg",
  onion: "onions",
  onions: "onions",
  cheese: "cheese",
  cheeses: "cheese",
  spinach: "spinach",
  garlic: "garlic",
  milk: "milk",
  broccoli: "broccoli",
  "ground beef": "ground beef",
  "chicken breast": "chicken breast",
};

export function toCanonicalIngredient(name) {
  const key = String(name || "").trim().toLowerCase();
  return CANONICAL_MAP[key] ?? key;
}

/** Days until expiry (negative = expired). Shared for fridge + recipe pages. */
export function getDaysUntilExpiry(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

/** Style for expiry badge. Soon = ≤4 days (use-first for food waste). */
export function getExpiryStyle(expiryDate) {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return { accent: "#B8423A", bg: "#FEF0EF", label: "Expired" };
  if (days <= 1) return { accent: "#D4603A", bg: "#FFF4EC", label: "Today" };
  if (days <= 4) return { accent: "#5C6E48", bg: "#E2E8D0", label: "Use soon" };
  if (days <= 14) return { accent: "#8FA07A", bg: "#E2E8D0", label: "Good" };
  return { accent: "#5C6E48", bg: "#E2E8D0", label: "Fresh" };
}

/** True if ingredient should be highlighted for "use first" (≤4 days). */
export function isExpiringSoon(expiryDate) {
  return getDaysUntilExpiry(expiryDate) <= 4 && getDaysUntilExpiry(expiryDate) >= 0;
}

const today = new Date();
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};

/**
 * Default fridge items — matches recipe selection style.
 * Using v2 key so users with old localStorage get fresh content.
 */
export const DEFAULT_FRIDGE = [
  { id: 1, name: "Spinach", quantity: 2, expiryDate: addDays(today, 2), category: "Produce" },
  { id: 2, name: "Garlic", quantity: 3, expiryDate: addDays(today, 14), category: "Produce" },
  { id: 3, name: "Ground Beef", quantity: 1, expiryDate: addDays(today, 1), category: "Meat" },
  { id: 4, name: "Onions", quantity: 4, expiryDate: addDays(today, 7), category: "Produce" },
  { id: 5, name: "Eggs", quantity: 12, expiryDate: addDays(today, 10), category: "Dairy" },
  { id: 6, name: "Milk", quantity: 1, expiryDate: addDays(today, 3), category: "Dairy" },
  { id: 7, name: "Chicken Breast", quantity: 2, expiryDate: addDays(today, 2), category: "Meat" },
  { id: 8, name: "Tomato", quantity: 5, expiryDate: addDays(today, 5), category: "Produce" },
  { id: 9, name: "Broccoli", quantity: 2, expiryDate: addDays(today, 4), category: "Produce" },
  { id: 10, name: "Cheese", quantity: 1, expiryDate: addDays(today, 20), category: "Dairy" },
];
