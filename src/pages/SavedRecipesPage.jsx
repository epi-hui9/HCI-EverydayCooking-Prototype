import { Box, Stack, Typography, IconButton } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import { useSavedRecipes } from "../utils/useSavedRecipes";
import { PALETTE } from "../theme";

export default function SavedRecipesPage({ onBack, onSelectRecipe }) {
  const { saved, toggleSave } = useSavedRecipes();

  if (!Array.isArray(saved) || saved.length === 0) {
    return (
      <Box sx={{ px: 2, pt: 1, pb: 3, minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
          <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
            <ChevronLeftRounded />
          </IconButton>
          <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
        </Stack>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <StarRounded sx={{ fontSize: 48, color: PALETTE.textTertiary, mb: 1, opacity: 0.5 }} />
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: PALETTE.textPrimary }}>No saved recipes yet</Typography>
          <Typography sx={{ fontSize: "0.875rem", color: PALETTE.textSecondary, mt: 0.5 }}>Tap the star on any recipe to save it</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, pt: 1, pb: 3, minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
      </Stack>
      <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em", color: PALETTE.textPrimary, mb: 1 }}>
        Saved recipes
      </Typography>
      <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary, mb: 2 }}>
        {saved.length} recipe{saved.length !== 1 ? "s" : ""} saved
      </Typography>
      <Stack spacing={1.25}>
        {saved.map((recipe) => (
          <Box
            key={recipe._key || recipe.id || recipe.name}
            component="button"
            type="button"
            onClick={() => onSelectRecipe?.(recipe)}
            sx={{
              border: `1px solid ${PALETTE.separator}`,
              borderRadius: "14px",
              bgcolor: PALETTE.surface,
              textAlign: "left",
              px: 2,
              py: 1.5,
              cursor: "pointer",
              transition: "all 0.15s",
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
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.25, px: 0.5, py: 0.25, borderRadius: "6px", bgcolor: PALETTE.accentLight }}>
                      <AutoAwesomeRounded sx={{ fontSize: 12, color: PALETTE.accentRaw }} />
                    </Box>
                  )}
                </Stack>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexWrap: "wrap", gap: 0.5 }}>
                  <Typography component="span" sx={{ fontSize: "0.6875rem", color: PALETTE.textSecondary }}>
                    {recipe.prepTime} + {recipe.cookTime}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "0.6875rem", color: PALETTE.textSecondary }}>
                    • {recipe.calories} cal
                  </Typography>
                </Stack>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); toggleSave(recipe); }}
                sx={{ color: PALETTE.accent, p: 0.5 }}
                aria-label="Unsave"
              >
                <StarRounded sx={{ fontSize: 22 }} />
              </IconButton>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
