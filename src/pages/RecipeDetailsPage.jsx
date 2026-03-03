import { Box, Button, Stack, Typography, IconButton, Chip } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import { ALL_RECIPES } from "../data/recipes";
import { toCanonicalIngredient, getEmoji, getDaysUntilExpiry, getExpiryStyle } from "../data/ingredients";
import { useLocalStorageState } from "../utils/useLocalStorageState";
import { DEFAULT_FRIDGE } from "../data/ingredients";
import { RECIPE_INSTRUCTIONS } from "../data/recipeInstructions";
import { parseRecipeSteps } from "../utils/recipeInstructions";
import { MAX_MINUTES_BY_ENERGY } from "../constants/energy";
import { parseMinutes } from "../utils/recipe";
import { PALETTE, PRIMARY_CTA_SX } from "../theme";

const FRIDGE_KEY = "ep.foods.v3";

export default function RecipeDetailsPage({ onBack, selectedIngredientNames = [], selectedEnergy, initialRecipe, onNext }) {
  const [foods] = useLocalStorageState(FRIDGE_KEY, DEFAULT_FRIDGE);

  const selectedSet = new Set(
    (selectedIngredientNames || []).filter(Boolean).map((n) => toCanonicalIngredient(n)).filter((n) => n.length > 0)
  );

  const fridgeSet = new Set(
    (Array.isArray(foods) ? foods : []).filter((f) => (f.quantity ?? 1) > 0).map((f) => toCanonicalIngredient(f.name)).filter((n) => n.length > 0)
  );

  const maxMin = selectedEnergy && MAX_MINUTES_BY_ENERGY[selectedEnergy] != null ? MAX_MINUTES_BY_ENERGY[selectedEnergy] : 999;
  let baseRecipes = ALL_RECIPES.filter((r) => parseMinutes(r.prepTime) + parseMinutes(r.cookTime) <= maxMin);

  const withMeta = baseRecipes.map((r) => {
    const overlap = r.ingredients.filter((ing) => fridgeSet.has(toCanonicalIngredient(ing)));
    const missing = r.ingredients.filter((ing) => !fridgeSet.has(toCanonicalIngredient(ing)));
    const selectedOverlap = r.ingredients.filter((ing) => selectedSet.has(toCanonicalIngredient(ing)));
    const totalMin = parseMinutes(r.prepTime) + parseMinutes(r.cookTime);
    return {
      recipe: r,
      overlapCount: overlap.length,
      selectedOverlapCount: selectedOverlap.length,
      missing,
      perfect: missing.length === 0,
      totalMin,
    };
  });

  let shown = withMeta;
  let showMode = "all";
  if (selectedSet.size > 0) {
    const usesSelected = withMeta.filter((x) => x.selectedOverlapCount > 0);
    const perfect = usesSelected.filter((x) => x.perfect);
    const partial = usesSelected.filter((x) => !x.perfect && x.overlapCount > 0);
    if (perfect.length > 0) {
      showMode = "perfect";
      shown = perfect.sort((a, b) => b.selectedOverlapCount - a.selectedOverlapCount);
    } else if (partial.length > 0) {
      showMode = "partial";
      shown = partial.sort((a, b) => b.selectedOverlapCount - a.selectedOverlapCount || b.overlapCount - a.overlapCount);
    } else {
      showMode = "partial";
      shown = usesSelected.sort((a, b) => b.selectedOverlapCount - a.selectedOverlapCount || b.overlapCount - a.overlapCount);
    }

    if (shown.length < 4) {
      const extra = ALL_RECIPES.filter((r) => {
        const canon = (ing) => toCanonicalIngredient(ing);
        const usesSel = r.ingredients.some((ing) => selectedSet.has(canon(ing)));
        const alreadyShown = shown.some((x) => x.recipe.id === r.id);
        return usesSel && !alreadyShown;
      }).map((r) => {
        const overlap = r.ingredients.filter((ing) => fridgeSet.has(toCanonicalIngredient(ing)));
        const missing = r.ingredients.filter((ing) => !fridgeSet.has(toCanonicalIngredient(ing)));
        const selectedOverlap = r.ingredients.filter((ing) => selectedSet.has(toCanonicalIngredient(ing)));
        return {
          recipe: r,
          overlapCount: overlap.length,
          selectedOverlapCount: selectedOverlap.length,
          missing,
          perfect: missing.length === 0,
          totalMin: parseMinutes(r.prepTime) + parseMinutes(r.cookTime),
        };
      }).sort((a, b) => b.selectedOverlapCount - a.selectedOverlapCount || b.overlapCount - a.overlapCount);
      shown = [...shown, ...extra.slice(0, 6 - shown.length)];
    }
  } else if (shown.length < 4) {
    const extra = baseRecipes.length < ALL_RECIPES.length
      ? ALL_RECIPES.filter((r) => !baseRecipes.some((b) => b.id === r.id))
        .map((r) => {
          const overlap = r.ingredients.filter((ing) => fridgeSet.has(toCanonicalIngredient(ing)));
          const missing = r.ingredients.filter((ing) => !fridgeSet.has(toCanonicalIngredient(ing)));
          return { recipe: r, overlapCount: overlap.length, selectedOverlapCount: 0, missing, perfect: missing.length === 0, totalMin: parseMinutes(r.prepTime) + parseMinutes(r.cookTime) };
        })
        .sort((a, b) => b.overlapCount - a.overlapCount)
        .slice(0, 6 - shown.length)
      : [];
    shown = [...shown, ...extra];
  }

  const subtitleText =
    selectedSet.size === 0 ? `${shown.length} recipes available`
    : showMode === "perfect" ? `${shown.length} perfect matches`
    : showMode === "partial" ? `${shown.length} suggestions`
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

        <Box sx={{ textAlign: "center", mb: 1.5 }}>
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
        {shown.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: PALETTE.textSecondary }}>
            <Typography sx={{ fontSize: "2rem", mb: 1 }}>🍽️</Typography>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: PALETTE.textPrimary }}>No matches found</Typography>
            <Typography sx={{ fontSize: "0.875rem", mt: 0.75 }}>Try selecting different ingredients or adjusting your energy level.</Typography>
          </Box>
        ) : (
          shown.map(({ recipe, missing, perfect }) => {
            return (
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
                    <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: PALETTE.textPrimary, mb: 0.75 }}>
                      {recipe.name}
                    </Typography>
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: perfect ? 0.75 : 0.5, flexWrap: "wrap", gap: 0.5 }}>
                      <Chip icon={<AccessTimeRounded sx={{ fontSize: 14 }} />} label={`${recipe.prepTime} + ${recipe.cookTime}`} size="small"
                        sx={{ height: 24, fontSize: "0.6875rem", bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textSecondary, fontWeight: 600 }}
                      />
                      <Chip icon={<LocalFireDepartmentRounded sx={{ fontSize: 14 }} />} label={`${recipe.calories} cal`} size="small"
                        sx={{ height: 24, fontSize: "0.6875rem", bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textSecondary, fontWeight: 600 }}
                      />
                      {!perfect && (
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
                </Stack>
              </Box>
            );
          })
        )}
      </Stack>

    </Box>
  );
}
