/**
 * Recipe flow step 3: choose a recipe, then continue to chat for instructions. Content fits inside app frame.
 */
import React, { useState } from "react";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChatIcon from "@mui/icons-material/Chat";
import { ALL_RECIPES } from "../data/recipes";
import { MAX_MINUTES_BY_ENERGY } from "../constants/energy";
import { parseMinutes } from "../utils/recipe";
import { PALETTE } from "../theme";

export default function RecipeDetailsPage({ onOpenChat, onBack, selectedIngredientNames = [], selectedEnergy, onNext }) {
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
    <Box sx={{ minHeight: "100%", display: "flex", flexDirection: "column", px: 2.5, pt: 3, pb: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Button
          startIcon={<ChevronLeft />}
          onClick={onBack}
          sx={{ color: "text.secondary", minHeight: 44, "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}
        >
          Back
        </Button>
        <Typography variant="overline" sx={{ letterSpacing: 0.6, color: "text.secondary" }}>
          Recipe Details
        </Typography>
        <Box sx={{ width: 52 }} />
      </Stack>

      <Stack spacing={1.5} sx={{ flex: 1, pb: 2 }}>
        {recipes.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
            No recipes match your ingredients{selectedEnergy ? " and energy level" : ""}. Try different ingredients or energy on the previous steps.
          </Typography>
        ) : (
          recipes.map((recipe) => {
            const isSelected = selectedRecipe?.id === recipe.id;
            return (
              <Box
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                sx={{
                  minHeight: 52,
                  py: 1.5,
                  px: 2,
                  bgcolor: isSelected ? PALETTE.sageLight : "rgba(255,255,255,0.6)",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: isSelected ? PALETTE.sage : "rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: isSelected ? PALETTE.sageLight : "rgba(0,0,0,0.02)" },
                }}
              >
                <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
                  <Typography fontWeight={600} variant="body2" color="text.secondary">
                    {recipe.name}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {recipe.prepTime} prep / {recipe.cookTime} cook
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {recipe.calories} cal
                </Typography>
              </Box>
            );
          })
        )}
      </Stack>

      {onNext && (
        <Box sx={{ pt: 2, pb: 1 }}>
          <Button
            fullWidth
            variant="contained"
            size="medium"
            disabled={!selectedRecipe}
            sx={{
              minHeight: 48,
              borderRadius: 2,
              fontWeight: 600,
              bgcolor: PALETTE.warmBrown,
              "&:hover": { bgcolor: PALETTE.warmBrown, opacity: 0.9 },
              "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "text.secondary" },
            }}
            onClick={() => selectedRecipe && onNext?.(selectedRecipe)}
          >
            Next
          </Button>
        </Box>
      )}

      {onOpenChat && (
        <Box sx={{ position: "fixed", bottom: 88, right: 24, zIndex: 10 }}>
          <IconButton
            aria-label="Open Chat"
            sx={{
              width: 48,
              height: 48,
              bgcolor: PALETTE.warmBrown,
              color: "#fff",
              boxShadow: "0 4px 16px rgba(212, 163, 115, 0.4)",
              "&:hover": { bgcolor: PALETTE.warmBrown, opacity: 0.9, transform: "scale(1.05)" },
            }}
            onClick={onOpenChat}
          >
            <ChatIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
