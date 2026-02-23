import { useState } from "react";
import { Box, Button, Stack, Typography, IconButton, Chip } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import { ALL_RECIPES } from "../data/recipes";
import { MAX_MINUTES_BY_ENERGY } from "../constants/energy";
import { parseMinutes } from "../utils/recipe";
import { PALETTE } from "../theme";

export default function RecipeDetailsPage({ onBack, selectedIngredientNames = [], selectedEnergy, onNext }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const selectedSet = new Set(
    (selectedIngredientNames || [])
      .filter(Boolean)
      .map((n) => String(n).trim())
      .filter((n) => n.length > 0)
  );

  // 1) Apply energy filter first
  let baseRecipes = [...ALL_RECIPES];
  if (selectedEnergy && MAX_MINUTES_BY_ENERGY[selectedEnergy] != null) {
    const maxMin = MAX_MINUTES_BY_ENERGY[selectedEnergy];
    baseRecipes = baseRecipes.filter((r) => {
      const total = parseMinutes(r.prepTime) + parseMinutes(r.cookTime);
      return total <= maxMin;
    });
  }

  // 2) Build match meta
  const withMeta = baseRecipes.map((r) => {
    const overlap = r.ingredients.filter((ing) => selectedSet.has(ing));
    const missing = r.ingredients.filter((ing) => !selectedSet.has(ing));
    const perfect = missing.length === 0;
    return { recipe: r, overlapCount: overlap.length, missing, perfect };
  });

  // 3) Decide what to show:
  // - if user selected nothing -> show all (energy-filtered)
  // - else show perfect matches; if none, show partial matches (overlap > 0) sorted by overlap desc
  let showMode = "all"; // all | perfect | partial
  let shown = withMeta;

  if (selectedSet.size === 0) {
    showMode = "all";
    shown = withMeta;
  } else {
    const perfect = withMeta.filter((x) => x.perfect);
    if (perfect.length > 0) {
      showMode = "perfect";
      shown = perfect;
    } else {
      const partial = withMeta
        .filter((x) => x.overlapCount > 0)
        .sort((a, b) => b.overlapCount - a.overlapCount);
      showMode = "partial";
      shown = partial;
    }
  }

  const titleText = "Choose a Recipe";
  const subtitleText =
    selectedSet.size === 0
      ? `${shown.length} recipes available`
      : showMode === "perfect"
        ? `${shown.length} recipes match your ingredients`
        : showMode === "partial"
          ? `${shown.length} suggestions using some of your ingredients`
          : "No matches found";

  return (
    <Box sx={{ px: 2, pt: 1, pb: 3, display: "flex", flexDirection: "column", minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
      </Stack>

      <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", mb: 0.25 }}>
        {titleText}
      </Typography>
      <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, mb: 2 }}>
        {subtitleText}
      </Typography>

      <Stack spacing={1.25} sx={{ flex: 1, pb: 2 }}>
        {shown.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: PALETTE.textSecondary }}>
            <Typography sx={{ fontSize: "2rem", mb: 1 }}>🍽️</Typography>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: PALETTE.textPrimary }}>
              No matches found
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", mt: 0.75 }}>
              Try selecting different ingredients or adjusting your energy level.
            </Typography>
          </Box>
        ) : (
          shown.map(({ recipe, missing, perfect }, idx) => {
            const isSelected = selectedRecipe?.id === recipe.id;

            return (
              <Box
                key={recipe.id}
                component="button"
                type="button"
                onClick={() => setSelectedRecipe(recipe)}
                sx={{
                  border: `1px solid ${isSelected ? PALETTE.accentRaw : PALETTE.separator}`,
                  borderRadius: "16px",
                  bgcolor: PALETTE.surface,
                  textAlign: "left",
                  px: 2,
                  py: 1.5,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: isSelected ? "0 6px 18px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.975rem", fontWeight: 700, color: PALETTE.textPrimary, mb: 0.75 }}>
                      {recipe.name}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: perfect ? 0.75 : 0.5, flexWrap: "wrap" }}>
                      <Chip
                        icon={<AccessTimeRounded sx={{ fontSize: 16 }} />}
                        label={`${recipe.prepTime} + ${recipe.cookTime}`}
                        size="small"
                        sx={{ bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textSecondary, fontWeight: 600 }}
                      />
                      <Chip
                        icon={<LocalFireDepartmentRounded sx={{ fontSize: 16 }} />}
                        label={`${recipe.calories} cal`}
                        size="small"
                        sx={{ bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textSecondary, fontWeight: 600 }}
                      />

                      {!perfect && (
                        <Chip
                          label="Suggested"
                          size="small"
                          sx={{ bgcolor: PALETTE.accentLight, color: PALETTE.accentRaw, fontWeight: 700 }}
                        />
                      )}
                    </Stack>

                    {!perfect && missing?.length > 0 && (
                      <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary, lineHeight: 1.35 }}>
                        Missing: {missing.slice(0, 4).join(", ")}{missing.length > 4 ? "…" : ""}
                      </Typography>
                    )}
                  </Box>

                  {isSelected && <CheckCircleRounded sx={{ fontSize: 22, color: PALETTE.accent }} />}
                </Stack>
              </Box>
            );
          })
        )}
      </Stack>

      {onNext && (
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!selectedRecipe}
          onClick={() => selectedRecipe && onNext?.(selectedRecipe)}
          sx={{
            height: 50,
            borderRadius: "14px",
            fontSize: "1.0625rem",
            fontWeight: 600,
            bgcolor: PALETTE.accent,
            "&:hover": { bgcolor: PALETTE.accentDark },
            "&.Mui-disabled": { bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textTertiary },
          }}
        >
          Start Cooking
        </Button>
      )}
    </Box>
  );
}