/**
 * Recipe flow step 1: select ingredients (from fridge). Content fits inside app frame.
 */
import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Checkbox,
  Chip,
  IconButton,
} from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import SwapVert from "@mui/icons-material/SwapVert";
import ChatIcon from "@mui/icons-material/Chat";
import { INITIAL_INGREDIENTS } from "../data/ingredients";
import { PALETTE } from "../theme";

export default function RecipeSelectionPage({ onOpenChat, onNext, onBack }) {
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSorted, setIsSorted] = useState(false);

  const toggleIngredient = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSort = () => {
    const newSortedState = !isSorted;
    setIsSorted(newSortedState);
    const sortedList = [...ingredients].sort((a, b) =>
      newSortedState ? a.daysLeft - b.daysLeft : a.id - b.id,
    );
    setIngredients(sortedList);
  };

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
          Ingredients
        </Typography>
        <Box sx={{ width: 52 }} />
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Button
          startIcon={<SwapVert />}
          size="small"
          variant="outlined"
          onClick={handleSort}
          sx={{
            minHeight: 40,
            borderColor: isSorted ? PALETTE.sage : "divider",
            color: isSorted ? "text.primary" : "text.secondary",
            "&:hover": { bgcolor: "rgba(0,0,0,0.03)" },
          }}
        >
          {isSorted ? "Original Order" : "Sort by Expire"}
        </Button>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {selectedIds.length} items selected
        </Typography>
      </Stack>

      <Stack spacing={1.5} sx={{ flex: 1, pb: 2 }}>
        {ingredients.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <Box
              key={item.id}
              onClick={() => toggleIngredient(item.id)}
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
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography sx={{ fontSize: "1.25rem" }}>{item.emoji}</Typography>
                <Stack spacing={0}>
                  <Typography fontWeight={600} variant="body2" color="text.secondary">
                    {item.name}
                  </Typography>
                  <Chip
                    label={`${item.daysLeft} days left`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      bgcolor: item.daysLeft <= 3 ? "rgba(180,100,90,0.2)" : "rgba(0,0,0,0.06)",
                    }}
                  />
                </Stack>
              </Stack>
              <Checkbox checked={isSelected} sx={{ pointerEvents: "none", color: PALETTE.sage }} />
            </Box>
          );
        })}
      </Stack>

      <Box sx={{ pt: 2, pb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          size="medium"
          disabled={selectedIds.length === 0}
          sx={{
            minHeight: 48,
            borderRadius: 2,
            fontWeight: 600,
            bgcolor: PALETTE.warmBrown,
            "&:hover": { bgcolor: PALETTE.warmBrown, opacity: 0.9 },
            "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "text.secondary" },
          }}
          onClick={() => {
            const names = ingredients.filter((i) => selectedIds.includes(i.id)).map((i) => i.name);
            onNext?.(names);
          }}
        >
          Next
        </Button>
      </Box>

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
