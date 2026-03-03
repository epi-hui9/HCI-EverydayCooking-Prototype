/**
 * Dietary restrictions: which ingredients to exclude.
 * Used for filtering recipes and AI generation.
 */
export const DIETARY_OPTIONS = [
  { id: "noMeat", label: "No meat", excludeIngredients: ["Chicken Breast", "Ground Beef", "Salmon"] },
  { id: "noDairy", label: "No dairy", excludeIngredients: ["Milk", "Cheese", "Eggs", "Butter", "Yogurt"] },
];

/** Get all ingredient names to exclude for given dietary option IDs */
export function getExcludedIngredients(optionIds) {
  const ids = Array.isArray(optionIds) ? optionIds : [];
  const seen = new Set();
  const out = [];
  for (const opt of DIETARY_OPTIONS) {
    if (ids.includes(opt.id)) {
      for (const ing of opt.excludeIngredients) {
        if (!seen.has(ing)) { seen.add(ing); out.push(ing); }
      }
    }
  }
  return out;
}
