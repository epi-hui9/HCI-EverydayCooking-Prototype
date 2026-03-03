/**
 * Ingredient emoji mapping and default fridge data.
 * Used by both Fridge (Your Food) and Recipe Selection pages for consistency.
 */

/** Known ingredients: display name, category, typical fridge shelf life (days). */
export const INGREDIENT_KNOWLEDGE = [
  { name: "Spinach", category: "Produce", shelfLifeDays: 5, aliases: ["spinach", "leafy greens"] },
  { name: "Garlic", category: "Produce", shelfLifeDays: 90, aliases: ["garlic", "garlic cloves"] },
  { name: "Ground Beef", category: "Meat", shelfLifeDays: 2, aliases: ["ground beef", "beef", "minced beef"] },
  { name: "Onions", category: "Produce", shelfLifeDays: 30, aliases: ["onions", "onion"] },
  { name: "Eggs", category: "Dairy", shelfLifeDays: 21, aliases: ["eggs", "egg"] },
  { name: "Milk", category: "Dairy", shelfLifeDays: 7, aliases: ["milk"] },
  { name: "Chicken Breast", category: "Meat", shelfLifeDays: 2, aliases: ["chicken breast", "chicken"] },
  { name: "Tomato", category: "Produce", shelfLifeDays: 7, aliases: ["tomato", "tomatoes"] },
  { name: "Broccoli", category: "Produce", shelfLifeDays: 5, aliases: ["broccoli"] },
  { name: "Cheese", category: "Dairy", shelfLifeDays: 21, aliases: ["cheese", "cheddar"] },
  { name: "Eggplant", category: "Produce", shelfLifeDays: 5, aliases: ["eggplant", "aubergine"] },
  { name: "Corn", category: "Produce", shelfLifeDays: 5, aliases: ["corn", "sweet corn"] },
  { name: "Rice", category: "Pantry", shelfLifeDays: 365, aliases: ["rice"] },
  { name: "Pasta", category: "Pantry", shelfLifeDays: 365, aliases: ["pasta", "noodles"] },
  { name: "Butter", category: "Dairy", shelfLifeDays: 90, aliases: ["butter"] },
  { name: "Yogurt", category: "Dairy", shelfLifeDays: 14, aliases: ["yogurt", "yoghurt"] },
  { name: "Carrots", category: "Produce", shelfLifeDays: 21, aliases: ["carrots", "carrot"] },
  { name: "Potatoes", category: "Produce", shelfLifeDays: 21, aliases: ["potatoes", "potato"] },
  { name: "Bell Pepper", category: "Produce", shelfLifeDays: 7, aliases: ["bell pepper", "pepper", "peppers"] },
  { name: "Lemon", category: "Produce", shelfLifeDays: 14, aliases: ["lemon", "lemons", "lime", "limes"] },
  { name: "Kale", category: "Produce", shelfLifeDays: 5, aliases: ["kale"] },
  { name: "Salmon", category: "Meat", shelfLifeDays: 2, aliases: ["salmon", "fish"] },
  { name: "Tofu", category: "Produce", shelfLifeDays: 5, aliases: ["tofu"] },
  { name: "Mushrooms", category: "Produce", shelfLifeDays: 7, aliases: ["mushrooms", "mushroom"] },
  { name: "Zucchini", category: "Produce", shelfLifeDays: 5, aliases: ["zucchini", "courgette"] },
  { name: "Cucumber", category: "Produce", shelfLifeDays: 7, aliases: ["cucumber", "cucumbers"] },
  { name: "Avocado", category: "Produce", shelfLifeDays: 5, aliases: ["avocado", "avocados"] },
  { name: "Bread", category: "Pantry", shelfLifeDays: 5, aliases: ["bread"] },
  { name: "Olive Oil", category: "Pantry", shelfLifeDays: 365, aliases: ["olive oil", "oil"] },
  { name: "Soy Sauce", category: "Pantry", shelfLifeDays: 365, aliases: ["soy sauce"] },
];

/** Find best-matching ingredient by name (fuzzy). Returns { name, category, shelfLifeDays } or null. */
export function matchIngredient(input) {
  const q = String(input || "").trim().toLowerCase();
  if (!q) return null;
  for (const ing of INGREDIENT_KNOWLEDGE) {
    if (ing.name.toLowerCase() === q) return ing;
    if (ing.aliases?.some((a) => a.includes(q) || q.includes(a))) return ing;
    if (ing.name.toLowerCase().includes(q)) return ing;
  }
  return null;
}

/** Get suggestions for autocomplete. */
export function getIngredientSuggestions(input, limit = 6) {
  const q = String(input || "").trim().toLowerCase();
  if (!q) return INGREDIENT_KNOWLEDGE.slice(0, limit);
  return INGREDIENT_KNOWLEDGE.filter(
    (ing) =>
      ing.name.toLowerCase().includes(q) ||
      ing.aliases?.some((a) => a.includes(q))
  ).slice(0, limit);
}

/** Expiry date string (YYYY-MM-DD) for today + days. */
export function expiryFromToday(days) {
  const d = new Date();
  d.setDate(d.getDate() + Math.max(0, days));
  return d.toISOString().slice(0, 10);
}

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
  Rice: "🍚",
  Pasta: "🍝",
  Butter: "🧈",
  Yogurt: "🥛",
  Carrots: "🥕",
  Potatoes: "🥔",
  "Bell Pepper": "🫑",
  Lemon: "🍋",
  Kale: "🥬",
  Salmon: "🐟",
  Tofu: "🧈",
  Mushrooms: "🍄",
  Zucchini: "🥒",
  Cucumber: "🥒",
  Avocado: "🥑",
  Bread: "🍞",
  "Olive Oil": "🫒",
  "Soy Sauce": "🫙",
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
