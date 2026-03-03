import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import { RECIPE_INSTRUCTIONS } from "../data/recipeInstructions";
import { toCanonicalIngredient, getEmoji, getDaysUntilExpiry } from "../data/ingredients";
import { useLocalStorageState } from "../utils/useLocalStorageState";
import { DEFAULT_FRIDGE } from "../data/ingredients";
import { parseRecipeSteps } from "../utils/recipeInstructions";
import { PALETTE, PRIMARY_CTA_SX } from "../theme";

const FRIDGE_KEY = "ep.foods.v3";

export default function RecipePreviewPage({ recipe, onBack, onStartCooking }) {
  const [foods] = useLocalStorageState(FRIDGE_KEY, DEFAULT_FRIDGE);

  if (!recipe) return null;

  const fridgeList = Array.isArray(foods) ? foods : [];
  const qtyMap = recipe.ingredientQuantities || {};
  const ingredientsWithExpiry = (recipe.ingredients || []).map((ing) => {
    const canon = toCanonicalIngredient(ing);
    const fridgeItem = fridgeList.find((f) => toCanonicalIngredient(f.name) === canon);
    const days = fridgeItem ? getDaysUntilExpiry(fridgeItem.expiryDate) : null;
    const useSoon = days != null && days <= 4 && days >= 0;
    return { name: ing, qty: qtyMap[ing] ?? 1, useSoon, days };
  });

  const rawInstructions = RECIPE_INSTRUCTIONS[recipe.name];
  const steps = parseRecipeSteps(rawInstructions);

  return (
    <Box sx={{ px: 2, pt: 1, pb: 3, minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
      {/* Back */}
      <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
      </Stack>

      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography sx={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.02em", color: PALETTE.textPrimary, lineHeight: 1.2 }}>
          {recipe.name}
        </Typography>
        <Stack direction="row" spacing={0.75} justifyContent="center" sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}>
          <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: "0.8125rem", color: PALETTE.textSecondary }}>
            <AccessTimeRounded sx={{ fontSize: 16 }} />
            {recipe.prepTime} + {recipe.cookTime}
          </Typography>
          <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: "0.8125rem", color: PALETTE.textSecondary }}>
            <LocalFireDepartmentRounded sx={{ fontSize: 16 }} />
            {recipe.calories} cal
          </Typography>
        </Stack>
      </Box>

      {/* Ingredients */}
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: PALETTE.textSecondary, mb: 1, letterSpacing: "0.04em" }}>
          INGREDIENTS
        </Typography>
        <Box sx={{ bgcolor: PALETTE.surface, borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          {ingredientsWithExpiry.map(({ name, qty, useSoon, days }) => (
            <Box
              key={name}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1.5,
                py: 1.25,
                borderBottom: `0.5px solid ${PALETTE.separator}`,
                "&:last-of-type": { borderBottom: "none" },
                ...(useSoon && {
                  bgcolor: "rgba(92, 110, 72, 0.08)",
                  borderLeft: `3px solid ${PALETTE.ecoDeep}`,
                }),
              }}
            >
              <Typography sx={{ fontSize: "1.125rem", mr: 1.25 }}>{getEmoji(name)}</Typography>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: PALETTE.textPrimary }}>
                  {name}{qty > 1 ? ` ×${qty}` : ""}
                </Typography>
                {useSoon && (
                  <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, color: PALETTE.ecoDeep, mt: 0.25 }}>
                    Use soon — {days === 0 ? "today" : days === 1 ? "tomorrow" : `${days}d left`}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Steps */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: PALETTE.textSecondary, mb: 1, letterSpacing: "0.04em" }}>
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

      {/* CTA */}
      {onStartCooking && (
        <Button fullWidth variant="contained" size="large" onClick={onStartCooking} sx={PRIMARY_CTA_SX}>
          Start Cooking with AI
        </Button>
      )}
    </Box>
  );
}
