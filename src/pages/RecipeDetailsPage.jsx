import { useState, useCallback } from "react";
import { Box, Button, Stack, Typography, IconButton, Chip, CircularProgress } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import { ALL_RECIPES } from "../data/recipes";
import { toCanonicalIngredient, getEmoji, getDaysUntilExpiry, getExpiryStyle } from "../data/ingredients";
import { useLocalStorageState } from "../utils/useLocalStorageState";
import { DEFAULT_FRIDGE } from "../data/ingredients";
import { RECIPE_INSTRUCTIONS } from "../data/recipeInstructions";
import { parseRecipeSteps } from "../utils/recipeInstructions";
import { MAX_MINUTES_BY_ENERGY } from "../constants/energy";
import { getExcludedIngredients } from "../constants/dietary";
import { parseMinutes } from "../utils/recipe";
import { generateRecipes } from "../utils/recipeGenerator";
import { useSavedRecipes } from "../utils/useSavedRecipes";
import { PALETTE, PRIMARY_CTA_SX } from "../theme";

const FRIDGE_KEY = "ep.foods.v3";
const MAX_MISSING = 2;

export default function RecipeDetailsPage({ onBack, selectedIngredientNames = [], selectedEnergy, dietaryExclusions = [], initialRecipe, onNext }) {
  const [foods] = useLocalStorageState(FRIDGE_KEY, DEFAULT_FRIDGE);
  const [aiRecipes, setAiRecipes] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const { isSaved, toggleSave } = useSavedRecipes();

  const selectedSet = new Set(
    (selectedIngredientNames || []).filter(Boolean).map((n) => toCanonicalIngredient(n)).filter((n) => n.length > 0)
  );

  const excludeSet = new Set(
    getExcludedIngredients(dietaryExclusions || []).map((n) => toCanonicalIngredient(n)).filter((n) => n.length > 0)
  );

  const fridgeSet = new Set(
    (Array.isArray(foods) ? foods : []).filter((f) => (f.quantity ?? 1) > 0).map((f) => toCanonicalIngredient(f.name)).filter((n) => n.length > 0)
  );

  const maxMin = selectedEnergy && MAX_MINUTES_BY_ENERGY[selectedEnergy] != null ? MAX_MINUTES_BY_ENERGY[selectedEnergy] : 999;
  const baseRecipes = ALL_RECIPES.filter((r) => parseMinutes(r.prepTime) + parseMinutes(r.cookTime) <= maxMin);

  const withMeta = baseRecipes
    .filter((r) => {
      if (excludeSet.size === 0) return true;
      const hasExcluded = r.ingredients.some((ing) => excludeSet.has(toCanonicalIngredient(ing)));
      return !hasExcluded;
    })
    .map((r) => {
    const inFridge = r.ingredients.filter((ing) => fridgeSet.has(toCanonicalIngredient(ing)));
    const missing = r.ingredients.filter((ing) => !fridgeSet.has(toCanonicalIngredient(ing)));
    const inSelected = r.ingredients.filter((ing) => selectedSet.has(toCanonicalIngredient(ing)));
    const extraFromFridge = r.ingredients.filter((ing) => fridgeSet.has(toCanonicalIngredient(ing)) && !selectedSet.has(toCanonicalIngredient(ing)));
    const allInFridge = missing.length === 0;
    const useOnlySelected = selectedSet.size > 0 && inSelected.length === r.ingredients.length && allInFridge;
    const useSelectedPlusUpTo2Extras = selectedSet.size > 0 && allInFridge && inSelected.length > 0 && extraFromFridge.length <= MAX_MISSING && extraFromFridge.length > 0;
    return {
      recipe: r,
      overlapCount: inFridge.length,
      selectedOverlapCount: inSelected.length,
      missing,
      perfect: selectedSet.size > 0 ? useOnlySelected : allInFridge,
      good: selectedSet.size > 0 ? useSelectedPlusUpTo2Extras : (!allInFridge && missing.length <= MAX_MISSING),
    };
  });

  let shown = [];
  let showMode = "all";
  if (selectedSet.size > 0) {
    const usesSelected = withMeta.filter((x) => x.selectedOverlapCount > 0);
    const perfect = usesSelected.filter((x) => x.perfect);
    const good = usesSelected.filter((x) => x.good);
    if (perfect.length > 0) {
      showMode = "perfect";
      shown = perfect.sort((a, b) => b.selectedOverlapCount - a.selectedOverlapCount);
    } else if (good.length > 0) {
      showMode = "good";
      shown = good.sort((a, b) => b.selectedOverlapCount - a.selectedOverlapCount || a.missing.length - b.missing.length);
    }
  } else {
    const perfect = withMeta.filter((x) => x.perfect);
    const good = withMeta.filter((x) => x.good && !x.perfect);
    showMode = "all";
    shown = [...perfect, ...good].sort((a, b) => a.missing.length - b.missing.length);
  }

  const excludeIngredients = getExcludedIngredients(dietaryExclusions || []);

  const fetchAiRecipes = useCallback(async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const fridgeList = (Array.isArray(foods) ? foods : []).filter((f) => (f.quantity ?? 1) > 0);
      const selected = (selectedIngredientNames || []).filter(Boolean);
      const list = await generateRecipes(fridgeList, selected, maxMin, excludeIngredients);
      setAiRecipes(list);
    } catch (e) {
      setAiError(e.message || "Failed to generate recipes");
    } finally {
      setAiLoading(false);
    }
  }, [foods, selectedIngredientNames, maxMin, excludeIngredients]);

  const displayRecipes = aiRecipes.length > 0 ? aiRecipes.map((r) => ({ recipe: r, missing: [], perfect: false })) : shown;
  const showAiSection = shown.length === 0 && !aiLoading && aiRecipes.length === 0 && !aiError;

  const subtitleText =
    aiRecipes.length > 0 ? "3 AI-generated recipes"
    : selectedSet.size === 0 ? `${displayRecipes.length} recipes available`
    : showMode === "perfect" ? `${displayRecipes.length} strict matches (selected only)`
    : showMode === "good" ? `${displayRecipes.length} suggestions (selected + up to 2 extras)`
    : "No matches found";

  /** Single-recipe view: from Recipes tab, user picked one of 3 → just show it + Start Cooking */
  const isSingleRecipeView = initialRecipe && selectedIngredientNames.length === 0;

  if (isSingleRecipeView && initialRecipe) {
    const fridgeList = Array.isArray(foods) ? foods : [];
    const qtyMap = initialRecipe.ingredientQuantities || {};
    const ingredientsWithExpiry = (initialRecipe.ingredients || []).map((ing) => {
      const canon = toCanonicalIngredient(ing);
      const fridgeItem = fridgeList.find((f) => toCanonicalIngredient(f.name) === canon);
      const days = fridgeItem ? getDaysUntilExpiry(fridgeItem.expiryDate) : null;
      const style = fridgeItem ? getExpiryStyle(fridgeItem.expiryDate) : null;
      const useSoon = days != null && days <= 4 && days >= 0;
      return { name: ing, qty: qtyMap[ing] ?? 1, fridgeItem, days, style, useSoon };
    });

    return (
      <Box sx={{ px: 2, pt: 1, pb: 3, display: "flex", flexDirection: "column", minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
          <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
            <ChevronLeftRounded />
          </IconButton>
          <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
        </Stack>

        <Box sx={{ textAlign: "center", mb: 1.5, position: "relative" }}>
          <IconButton
            size="small"
            onClick={() => toggleSave(initialRecipe)}
            sx={{ position: "absolute", top: -4, right: 0, color: isSaved(initialRecipe) ? PALETTE.accent : PALETTE.textTertiary }}
            aria-label={isSaved(initialRecipe) ? "Unsave" : "Save recipe"}
          >
            {isSaved(initialRecipe) ? <StarRounded sx={{ fontSize: 24 }} /> : <StarBorderRounded sx={{ fontSize: 24 }} />}
          </IconButton>
          <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em", color: PALETTE.textPrimary }}>
            {initialRecipe.name}
          </Typography>
          <Stack direction="row" spacing={0.75} justifyContent="center" sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}>
            <Chip icon={<AccessTimeRounded sx={{ fontSize: 14 }} />} label={`${initialRecipe.prepTime} + ${initialRecipe.cookTime}`} size="small"
              sx={{ height: 24, fontSize: "0.6875rem", bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textSecondary, fontWeight: 600 }}
            />
            <Chip icon={<LocalFireDepartmentRounded sx={{ fontSize: 14 }} />} label={`${initialRecipe.calories} cal`} size="small"
              sx={{ height: 24, fontSize: "0.6875rem", bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textSecondary, fontWeight: 600 }}
            />
          </Stack>
        </Box>

        {/* Ingredients — with "use soon" highlight for food waste */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: PALETTE.textSecondary, mb: 1, letterSpacing: "0.02em" }}>
            INGREDIENTS
          </Typography>
          <Box sx={{ bgcolor: PALETTE.surface, borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            {ingredientsWithExpiry.map(({ name, qty, useSoon, style, days }) => (
              <Box
                key={name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1.5,
                  py: 1.25,
                  borderBottom: `0.5px solid ${PALETTE.separator}`,
                  "&:last-of-type": { borderBottom: "none" },
                  ...(useSoon && {
                    bgcolor: "rgba(92, 110, 72, 0.08)",
                    borderLeft: `3px solid ${PALETTE.ecoDeep}`,
                    animation: "useSoonPulse 2.5s ease-in-out infinite",
                  }),
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.25}>
                  <Typography sx={{ fontSize: "1.125rem" }}>{getEmoji(name)}</Typography>
                  <Box>
                    <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: PALETTE.textPrimary }}>
                      {name}{qty > 1 ? ` ×${qty}` : ""}
                    </Typography>
                    {useSoon && (
                      <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, color: PALETTE.ecoDeep, mt: 0.25 }}>
                        Use soon — {days === 0 ? "today" : days === 1 ? "tomorrow" : `${days}d left`}
                      </Typography>
                    )}
                  </Box>
                </Stack>
                {useSoon && (
                  <Chip
                    label="Save"
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      bgcolor: PALETTE.ecoDeep,
                      color: "#fff",
                      letterSpacing: "0.04em",
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Steps */}
        {(() => {
          const rawInstructions = RECIPE_INSTRUCTIONS[initialRecipe.name];
          const steps = parseRecipeSteps(rawInstructions);
          return (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: PALETTE.textSecondary, mb: 1, letterSpacing: "0.02em" }}>
                STEPS
              </Typography>
              <Box sx={{ bgcolor: PALETTE.surface, borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                {steps.length === 0 ? (
                  <Box sx={{ px: 2, py: 2, textAlign: "center" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: PALETTE.textTertiary }}>No steps available. Open Chat for AI help.</Typography>
                  </Box>
                ) : (
                  steps.map(({ num, text }) => (
                    <Box
                      key={num}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        px: 2,
                        py: 1.5,
                        borderBottom: `0.5px solid ${PALETTE.separator}`,
                        "&:last-of-type": { borderBottom: "none" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          bgcolor: PALETTE.accentLight,
                          color: PALETTE.accent,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.8125rem",
                          fontWeight: 700,
                          flexShrink: 0,
                          mr: 1.5,
                        }}
                      >
                        {num}
                      </Box>
                      <Typography sx={{ fontSize: "0.9375rem", lineHeight: 1.5, color: PALETTE.textPrimary, pt: 0.25 }}>
                        {text}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          );
        })()}

        <Box sx={{ flex: 1 }} />

        {onNext && (
          <Button
            fullWidth variant="contained" size="large"
            onClick={() => onNext?.(initialRecipe)}
            sx={PRIMARY_CTA_SX}
          >
            Start Cooking
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, pt: 1, pb: 3, display: "flex", flexDirection: "column", minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
      {/* Back */}
      <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
      </Stack>

      {/* Title */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em", color: PALETTE.textPrimary }}>
          Choose a Recipe
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary, mt: 0.25 }}>
          {subtitleText}
        </Typography>
      </Box>

      {/* Recipe list */}
      <Stack spacing={1.25} sx={{ flex: 1, pb: 2 }}>
        {aiLoading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
            <CircularProgress size={36} sx={{ color: PALETTE.accent, mb: 2 }} />
            <Typography sx={{ fontSize: "0.9375rem", color: PALETTE.textSecondary }}>Generating recipes…</Typography>
          </Box>
        ) : showAiSection ? (
          <Box sx={{ textAlign: "center", py: 6, color: PALETTE.textSecondary }}>
            <Typography sx={{ fontSize: "2rem", mb: 1 }}>🍽️</Typography>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: PALETTE.textPrimary }}>No matches found</Typography>
            <Typography sx={{ fontSize: "0.875rem", mt: 0.75, mb: 2 }}>
              {selectedSet.size > 0 ? "No recipes match your selection (perfect or up to 2 missing)." : "No recipes match your fridge."}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AutoAwesomeRounded />}
              onClick={fetchAiRecipes}
              sx={{ ...PRIMARY_CTA_SX, borderRadius: "14px" }}
            >
              Generate 3 AI recipes
            </Button>
          </Box>
        ) : aiError ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography sx={{ fontSize: "0.9375rem", color: PALETTE.textSecondary, mb: 2 }}>{aiError}</Typography>
            <Button variant="outlined" onClick={fetchAiRecipes} sx={{ borderRadius: "14px" }}>Try again</Button>
          </Box>
        ) : displayRecipes.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: PALETTE.textSecondary }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: PALETTE.textPrimary }}>No recipes yet</Typography>
          </Box>
        ) : (
          displayRecipes.map(({ recipe, missing, perfect }) => (
            <Box
              key={recipe.id} component="button" type="button"
              onClick={() => onNext?.(recipe)}
              sx={{
                border: `1px solid ${PALETTE.separator}`,
                borderRadius: "14px", bgcolor: PALETTE.surface, textAlign: "left",
                px: 2, py: 1.5, cursor: "pointer", transition: "all 0.15s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                "&:hover": { borderColor: PALETTE.accentRaw, boxShadow: "0 4px 14px rgba(0,0,0,0.06)" },
              }}
            >
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                    <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: PALETTE.textPrimary }}>
                      {recipe.name}
                    </Typography>
                    {recipe.isAiGenerated && (
                      <Chip icon={<AutoAwesomeRounded sx={{ fontSize: 12 }} />} label="AI" size="small"
                        sx={{ height: 20, fontSize: "0.625rem", bgcolor: PALETTE.accentLight, color: PALETTE.accentRaw, fontWeight: 700 }}
                      />
                    )}
                  </Stack>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: perfect ? 0.75 : 0.5, flexWrap: "wrap", gap: 0.5 }}>
                    <Chip icon={<AccessTimeRounded sx={{ fontSize: 14 }} />} label={`${recipe.prepTime} + ${recipe.cookTime}`} size="small"
                      sx={{ height: 24, fontSize: "0.6875rem", bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textSecondary, fontWeight: 600 }}
                    />
                    <Chip icon={<LocalFireDepartmentRounded sx={{ fontSize: 14 }} />} label={`${recipe.calories} cal`} size="small"
                      sx={{ height: 24, fontSize: "0.6875rem", bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textSecondary, fontWeight: 600 }}
                    />
                    {!perfect && !recipe.isAiGenerated && (
                      <Chip label="Suggested" size="small"
                        sx={{ height: 24, fontSize: "0.6875rem", bgcolor: PALETTE.accentLight, color: PALETTE.accentRaw, fontWeight: 700 }}
                      />
                    )}
                  </Stack>
                  {!perfect && missing?.length > 0 && (
                    <Typography sx={{ fontSize: "0.6875rem", color: PALETTE.textTertiary, lineHeight: 1.35 }}>
                      Missing: {missing.slice(0, 4).join(", ")}{missing.length > 4 ? "…" : ""}
                    </Typography>
                  )}
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); toggleSave(recipe); }}
                  sx={{ color: isSaved(recipe) ? PALETTE.accent : PALETTE.textTertiary, p: 0.5 }}
                  aria-label={isSaved(recipe) ? "Unsave" : "Save recipe"}
                >
                  {isSaved(recipe) ? <StarRounded sx={{ fontSize: 22 }} /> : <StarBorderRounded sx={{ fontSize: 22 }} />}
                </IconButton>
              </Stack>
            </Box>
          ))
        )}
      </Stack>

    </Box>
  );
}
