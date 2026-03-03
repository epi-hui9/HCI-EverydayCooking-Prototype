import { Box, Stack, Typography, Chip, IconButton, Button } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import PageHeader from "../components/PageHeader";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import { ALL_RECIPES } from "../data/recipes";
import { toCanonicalIngredient, getEmoji, getDaysUntilExpiry } from "../data/ingredients";
import { useLocalStorageState } from "../utils/useLocalStorageState";
import { DEFAULT_FRIDGE } from "../data/ingredients";
import { MAX_MINUTES_BY_ENERGY } from "../constants/energy";
import { parseMinutes } from "../utils/recipe";
import { PALETTE } from "../theme";

const FRIDGE_KEY = "ep.foods.v3";
const TOP_N = 3;

export default function RecipeRecommendationPage({ onSelectRecipe, onBack, onBrowseMore, selectedEnergy = "medium" }) {
  const [foods] = useLocalStorageState(FRIDGE_KEY, DEFAULT_FRIDGE);

  const fridgeSet = new Set(
    (Array.isArray(foods) ? foods : [])
      .filter((f) => (f.quantity ?? 1) > 0)
      .map((f) => toCanonicalIngredient(f.name))
      .filter((n) => n.length > 0)
  );

  const maxMin = MAX_MINUTES_BY_ENERGY[selectedEnergy] ?? MAX_MINUTES_BY_ENERGY.medium ?? 40;
  const baseRecipes = ALL_RECIPES.filter((r) => {
    const total = parseMinutes(r.prepTime) + parseMinutes(r.cookTime);
    return total <= maxMin;
  });

  const fridgeList = Array.isArray(foods) ? foods : [];
  const withMeta = baseRecipes.map((r) => {
    const overlap = r.ingredients.filter((ing) => fridgeSet.has(toCanonicalIngredient(ing)));
    const missing = r.ingredients.filter((ing) => !fridgeSet.has(toCanonicalIngredient(ing)));
    const perfect = missing.length === 0;
    const useSoonIngredients = r.ingredients.filter((ing) => {
      const canon = toCanonicalIngredient(ing);
      const item = fridgeList.find((f) => toCanonicalIngredient(f.name) === canon);
      if (!item) return false;
      const days = getDaysUntilExpiry(item.expiryDate);
      return days <= 4 && days >= 0;
    });
    return { recipe: r, overlapCount: overlap.length, missing, perfect, useSoonIngredients };
  });

  const perfect = withMeta.filter((x) => x.perfect);
  const partial = withMeta
    .filter((x) => x.overlapCount > 0 && !x.perfect)
    .sort((a, b) => b.overlapCount - a.overlapCount);
  const allMatching = [...perfect, ...partial];
  const recommended = allMatching.slice(0, TOP_N);

  return (
    <Box sx={{ px: 2, pt: 1, pb: 2, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", animation: "fadeIn 0.25s ease" }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
      </Stack>
      <PageHeader title="Recipes" />

      {/* Scrollable recipe list */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}>
        {recommended.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, color: PALETTE.textSecondary }}>
            <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>🥗</Typography>
            <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700, color: PALETTE.textPrimary }}>
              No recipes yet
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", mt: 0.5 }}>
              Add ingredients to your fridge first.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {/* Context — Design Thinking: reduce confusion, set expectations */}
            <Box sx={{ px: 0.25 }}>
              <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: PALETTE.textPrimary, mb: 0.25 }}>
                Recommended for you
              </Typography>
              <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, lineHeight: 1.4 }}>
                Based on your energy + what&apos;s in your fridge — a curated selection, not all recipes.
              </Typography>
            </Box>
            {recommended.map(({ recipe, missing, perfect: isPerfect, useSoonIngredients }) => {
              const hasUseSoon = useSoonIngredients?.length > 0;
              return (
                <Box
                  key={recipe.id}
                  component="button" type="button"
                  onClick={() => onSelectRecipe?.(recipe)}
                  sx={{
                    border: `1px solid ${hasUseSoon ? PALETTE.ecoMedium : PALETTE.separator}`,
                    borderRadius: "14px",
                    bgcolor: hasUseSoon ? "rgba(204, 213, 174, 0.12)" : PALETTE.surface,
                    textAlign: "left",
                    px: 2, py: 1.5,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: hasUseSoon ? "0 2px 8px rgba(92, 110, 72, 0.12)" : "0 1px 3px rgba(0,0,0,0.04)",
                    "&:hover": {
                      borderColor: hasUseSoon ? PALETTE.ecoDeep : PALETTE.accentRaw,
                      boxShadow: hasUseSoon ? "0 4px 16px rgba(92, 110, 72, 0.18)" : "0 4px 14px rgba(0,0,0,0.06)",
                    },
                    "&:active": { transform: "scale(0.99)" },
                  }}
                >
                  <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: PALETTE.textPrimary, mb: 0.75 }}>
                        {recipe.name}
                      </Typography>
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexWrap: "wrap", gap: 0.5 }}>
                        <Chip
                          icon={<AccessTimeRounded sx={{ fontSize: 14 }} />}
                          label={`${recipe.prepTime} + ${recipe.cookTime}`}
                          size="small"
                          sx={{ height: 24, fontSize: "0.6875rem", bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textSecondary, fontWeight: 600 }}
                        />
                        <Chip
                          icon={<LocalFireDepartmentRounded sx={{ fontSize: 14 }} />}
                          label={`${recipe.calories} cal`}
                          size="small"
                          sx={{ height: 24, fontSize: "0.6875rem", bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textSecondary, fontWeight: 600 }}
                        />
                        {!isPerfect && (
                          <Chip label="Suggested" size="small"
                            sx={{ height: 24, fontSize: "0.6875rem", bgcolor: PALETTE.accentLight, color: PALETTE.accentRaw, fontWeight: 700 }}
                          />
                        )}
                        {hasUseSoon && (
                          <Chip
                            label="Uses soon-expiring"
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: "0.625rem",
                              bgcolor: PALETTE.ecoDeep,
                              color: "#fff",
                              fontWeight: 700,
                            }}
                          />
                        )}
                      </Stack>
                      {hasUseSoon && (
                        <Typography sx={{ fontSize: "0.75rem", color: PALETTE.ecoDeep, fontWeight: 600, mt: 0.75, lineHeight: 1.35 }}>
                          Save from waste: {useSoonIngredients.map((n) => `${getEmoji(n)} ${n}`).join(", ")}
                        </Typography>
                      )}
                      {!isPerfect && missing?.length > 0 && (
                        <Typography sx={{ fontSize: "0.6875rem", color: PALETTE.textTertiary, mt: 0.5, lineHeight: 1.35 }}>
                          Missing: {missing.slice(0, 4).join(", ")}{missing.length > 4 ? "…" : ""}
                        </Typography>
                      )}
                    </Box>
                    <Typography sx={{ fontSize: "1.125rem", color: PALETTE.textTertiary, pt: 0.25 }}>›</Typography>
                  </Stack>
                </Box>
              );
            })}
            {recommended.length > 0 && onBrowseMore && (
              <Button
                fullWidth
                variant="outlined"
                onClick={onBrowseMore}
                sx={{
                  mt: 1,
                  py: 1.25,
                  borderRadius: "14px",
                  borderColor: PALETTE.separator,
                  color: PALETTE.textSecondary,
                  fontWeight: 600,
                  "&:hover": { borderColor: PALETTE.accent, color: PALETTE.accent, bgcolor: PALETTE.accentLight },
                }}
              >
                Browse more recipes
              </Button>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
