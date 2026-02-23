import { useState } from "react";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
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
  const selectedSet = new Set(selectedIngredientNames.map((n) => n.trim()));

  let recipes =
    selectedSet.size === 0 ? [...ALL_RECIPES] : ALL_RECIPES.filter((r) => r.ingredients.every((ing) => selectedSet.has(ing)));

  if (selectedEnergy && MAX_MINUTES_BY_ENERGY[selectedEnergy] != null) {
    const maxMin = MAX_MINUTES_BY_ENERGY[selectedEnergy];
    recipes = recipes.filter((r) => {
      const total = parseMinutes(r.prepTime) + parseMinutes(r.cookTime);
      return total <= maxMin;
    });
  }

  return (
    <Box sx={{ px: 2, pt: 1, pb: 3, display: "flex", flexDirection: "column", minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
      </Stack>

      <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", mb: 0.25 }}>
        Choose a Recipe
      </Typography>
      <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, mb: 2 }}>
        {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} match your selection
      </Typography>

      <Stack spacing={1.5} sx={{ flex: 1, pb: 2 }}>
        {recipes.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography sx={{ fontSize: "2rem", mb: 1 }}>🍽️</Typography>
            <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: PALETTE.textPrimary, mb: 0.5 }}>
              No matches found
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, lineHeight: 1.5 }}>
              Try selecting different ingredients or adjusting your energy level.
            </Typography>
          </Box>
        ) : (
          recipes.map((recipe) => {
            const isSelected = selectedRecipe?.id === recipe.id;
            const totalTime = parseMinutes(recipe.prepTime) + parseMinutes(recipe.cookTime);
            return (
              <Box
                key={recipe.id} component="button" type="button"
                onClick={() => setSelectedRecipe(recipe)}
                sx={{
                  border: "none", cursor: "pointer", textAlign: "left", width: "100%",
                  borderRadius: "16px",
                  bgcolor: isSelected ? PALETTE.surface : PALETTE.surfaceSecondary,
                  boxShadow: isSelected ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
                  outline: isSelected ? `2px solid ${PALETTE.accent}` : "none",
                  p: 2, transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                  "&:hover": { bgcolor: PALETTE.surface, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
                  "&:active": { transform: "scale(0.98)" },
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: PALETTE.textPrimary, mb: 0.5 }}>
                      {recipe.name}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeRounded sx={{ fontSize: 14, color: PALETTE.textTertiary }} />
                        <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary }}>{totalTime} min</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LocalFireDepartmentRounded sx={{ fontSize: 14, color: PALETTE.textTertiary }} />
                        <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary }}>{recipe.calories} cal</Typography>
                      </Stack>
                    </Stack>
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
          fullWidth variant="contained" size="large"
          disabled={!selectedRecipe}
          onClick={() => selectedRecipe && onNext?.(selectedRecipe)}
          sx={{
            height: 50, borderRadius: "14px", fontSize: "1.0625rem", fontWeight: 600,
            bgcolor: PALETTE.accent, "&:hover": { bgcolor: PALETTE.accentDark },
            "&.Mui-disabled": { bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textTertiary },
          }}
        >
          Start Cooking
        </Button>
      )}
    </Box>
  );
}
