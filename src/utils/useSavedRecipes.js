import { useLocalStorageState } from "./useLocalStorageState";

const SAVED_KEY = "ep.savedRecipes.v1";

function recipeKey(recipe) {
  if (!recipe) return "";
  if (recipe.isAiGenerated) return recipe.id || `ai-${recipe.name}`;
  return `catalog-${recipe.id ?? recipe.name}`;
}

export function useSavedRecipes() {
  const [saved, setSaved] = useLocalStorageState(SAVED_KEY, []);

  const savedIds = new Set((saved || []).map((r) => recipeKey(r)));

  const isSaved = (recipe) => recipe && savedIds.has(recipeKey(recipe));

  const toggleSave = (recipe) => {
    if (!recipe) return;
    const key = recipeKey(recipe);
    const fullRecipe = {
      ...recipe,
      _key: key,
    };
    setSaved((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const idx = list.findIndex((r) => (r._key || recipeKey(r)) === key);
      if (idx >= 0) return list.filter((_, i) => i !== idx);
      return [...list, fullRecipe];
    });
  };

  const getSaved = () => Array.isArray(saved) ? saved : [];

  return { saved: getSaved(), isSaved, toggleSave };
}
