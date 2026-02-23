import { useState } from "react";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import SwapVertRounded from "@mui/icons-material/SwapVertRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRounded from "@mui/icons-material/RadioButtonUncheckedRounded";
import { INITIAL_INGREDIENTS } from "../data/ingredients";
import { PALETTE } from "../theme";

export default function RecipeSelectionPage({ onNext, onBack }) {
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSorted, setIsSorted] = useState(false);

  const toggle = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handleSort = () => {
    const next = !isSorted;
    setIsSorted(next);
    setIngredients((prev) => [...prev].sort((a, b) => (next ? a.daysLeft - b.daysLeft : a.id - b.id)));
  };

  return (
    <Box sx={{ px: 2, pt: 1, pb: 3, display: "flex", flexDirection: "column", minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
      </Stack>

      <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", mb: 0.25 }}>
        Select Ingredients
      </Typography>
      <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, mb: 2 }}>
        Pick what you want to cook with
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Button
          startIcon={<SwapVertRounded sx={{ fontSize: 18 }} />}
          size="small" onClick={handleSort}
          sx={{
            color: isSorted ? PALETTE.accent : PALETTE.textSecondary,
            fontSize: "0.8125rem", fontWeight: 500, px: 1, minHeight: 34,
            bgcolor: isSorted ? PALETTE.accentLight : "transparent",
            borderRadius: "8px",
            "&:hover": { bgcolor: isSorted ? PALETTE.accentLight : "rgba(0,0,0,0.03)" },
          }}
        >
          {isSorted ? "Sorted by expiry" : "Sort by expiry"}
        </Button>
        <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textTertiary, fontWeight: 500 }}>
          {selectedIds.length} selected
        </Typography>
      </Stack>

      <Box sx={{ bgcolor: PALETTE.surface, borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", mb: 2, flex: 1 }}>
        {ingredients.map((item, index) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <Box key={item.id}>
              <Stack
                direction="row" alignItems="center"
                onClick={() => toggle(item.id)}
                sx={{
                  px: 2, py: 1.5, cursor: "pointer",
                  bgcolor: isSelected ? `${PALETTE.accent}0A` : "transparent",
                  transition: "background-color 0.15s",
                  "&:active": { bgcolor: "rgba(0,0,0,0.04)" },
                }}
              >
                <Typography sx={{ fontSize: "1.25rem", mr: 1.5, lineHeight: 1 }}>{item.emoji}</Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: PALETTE.textPrimary }}>{item.name}</Typography>
                  <Typography sx={{ fontSize: "0.6875rem", color: item.daysLeft <= 3 ? PALETTE.accent : PALETTE.textTertiary }}>
                    {item.daysLeft} days left
                  </Typography>
                </Box>
                {isSelected ? (
                  <CheckCircleRounded sx={{ fontSize: 22, color: PALETTE.accent }} />
                ) : (
                  <RadioButtonUncheckedRounded sx={{ fontSize: 22, color: PALETTE.textTertiary }} />
                )}
              </Stack>
              {index < ingredients.length - 1 && <Box sx={{ mx: 2, borderBottom: `0.5px solid ${PALETTE.separator}` }} />}
            </Box>
          );
        })}
      </Box>

      <Button
        fullWidth variant="contained" size="large"
        disabled={selectedIds.length === 0}
        onClick={() => {
          const names = ingredients.filter((i) => selectedIds.includes(i.id)).map((i) => i.name);
          onNext?.(names);
        }}
        sx={{
          height: 50, borderRadius: "14px", fontSize: "1.0625rem", fontWeight: 600,
          bgcolor: PALETTE.accent, "&:hover": { bgcolor: PALETTE.accentDark },
          "&.Mui-disabled": { bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textTertiary },
        }}
      >
        Next — {selectedIds.length} ingredient{selectedIds.length !== 1 ? "s" : ""}
      </Button>
    </Box>
  );
}
