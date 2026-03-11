/**
 * Shared utilities for the weekly plan (localStorage key ep.weeklyPlan).
 * Used by WeeklyPlanPage and ChatbotInterface when completing a recipe.
 */
import { getTodayInChicago } from "./chicagoTime";

export const PLAN_KEY = "ep.weeklyPlan";

/** Normalize old format { recipeName, recipeId } to { meals: [...] } */
function getMealsForDay(plan, dateKey) {
  const entry = plan[dateKey];
  if (!entry) return [];
  if (entry.meals && Array.isArray(entry.meals)) return entry.meals;
  if (entry.recipeName) return [{ recipeName: entry.recipeName, recipeId: entry.recipeId }];
  return [];
}

/**
 * Remove a completed recipe from today's weekly plan.
 * @param {Object} plan - Current plan from localStorage
 * @param {Object} recipe - Completed recipe { name, id }
 * @returns {Object} Updated plan (or same if not found)
 */
export function removeCompletedRecipeFromPlan(plan, recipe) {
  if (!plan || !recipe?.name) return plan;
  const todayKey = getTodayInChicago();
  const meals = getMealsForDay(plan, todayKey);
  const idx = meals.findIndex(
    (m) => m.recipeName === recipe.name || m.recipeId === recipe.id
  );
  if (idx < 0) return plan;

  const next = { ...plan };
  const updated = meals.filter((_, i) => i !== idx);
  if (updated.length === 0) delete next[todayKey];
  else next[todayKey] = { meals: updated };
  return next;
}
