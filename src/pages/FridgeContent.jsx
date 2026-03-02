import { useState } from "react";
import { Box, Button, Stack, Typography, TextField, IconButton, Chip } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SwapVertRounded from "@mui/icons-material/SwapVertRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRounded from "@mui/icons-material/RadioButtonUncheckedRounded";
import { PALETTE, PRIMARY_CTA_SX } from "../theme";
import { useLocalStorageState } from "../utils/useLocalStorageState";
import PageHeader from "../components/PageHeader";
import { DEFAULT_FRIDGE, getEmoji, getDaysUntilExpiry } from "../data/ingredients";

const FRIDGE_KEY = "ep.foods.v2";

const getFridgeExpiryStyle = (expiryDate) => {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return { accent: "#B8423A", bg: "#FEF0EF", label: "Expired" };
  if (days <= 1) return { accent: "#D4603A", bg: "#FFF4EC", label: "Today" };
  if (days <= 4) return { accent: PALETTE.accent, bg: PALETTE.accentLight, label: "Soon" };
  if (days <= 14) return { accent: PALETTE.ecoMedium, bg: PALETTE.sageLight, label: "Good" };
  return { accent: PALETTE.ecoDeep, bg: PALETTE.sageLight, label: "Fresh" };
};

export default function FridgeContent({ onBack, onNext, onOpenChat }) {
  const [foods, setFoods] = useLocalStorageState(FRIDGE_KEY, DEFAULT_FRIDGE);
  const [newFood, setNewFood] = useState({ name: "", quantity: 1, expiryDate: "", category: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSorted, setIsSorted] = useState(true);

  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handleAddFood = () => {
    if (newFood.name && newFood.expiryDate) {
      const qty = Math.max(1, parseInt(String(newFood.quantity), 10) || 1);
      setFoods((prev) => [...prev, { id: Date.now(), ...newFood, quantity: qty, category: newFood.category || "Other" }]);
      setNewFood({ name: "", quantity: 1, expiryDate: "", category: "" });
      setIsAdding(false);
    }
  };

  const safeFoods = Array.isArray(foods) ? foods : [];
  const sorted = [...safeFoods].sort((a, b) =>
    isSorted ? getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate) : (a.id - b.id)
  );

  if (isAdding) {
    return (
      <Box sx={{ px: 2, pt: 1, pb: 3, animation: "fadeIn 0.25s ease" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <IconButton onClick={() => setIsAdding(false)} sx={{ color: PALETTE.accent }}>
            <ChevronLeftRounded />
          </IconButton>
          <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600 }}>Add Food</Typography>
          <IconButton onClick={() => setIsAdding(false)} sx={{ color: PALETTE.textTertiary }}>
            <CloseRounded />
          </IconButton>
        </Stack>
        <Stack spacing={2}>
          <TextField
            label="Food Name" required placeholder="e.g. Tomatoes"
            value={newFood.name} onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            size="small" fullWidth
          />
          <TextField
            label="Quantity" type="number" inputProps={{ min: 1 }}
            value={newFood.quantity} onChange={(e) => setNewFood({ ...newFood, quantity: e.target.value })}
            size="small" fullWidth
          />
          <TextField
            label="Expiry Date" required type="date"
            value={newFood.expiryDate} onChange={(e) => setNewFood({ ...newFood, expiryDate: e.target.value })}
            InputLabelProps={{ shrink: true }} size="small" fullWidth
          />
          <TextField
            label="Category" placeholder="e.g. Produce, Dairy"
            value={newFood.category} onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
            size="small" fullWidth
          />
          <Button fullWidth variant="contained" onClick={handleAddFood} sx={{ mt: 1, ...PRIMARY_CTA_SX }}>
            Add to Fridge
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, pt: 1, pb: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", animation: "fadeIn 0.25s ease" }}>
      {/* Header */}
      <PageHeader
        title="My Fridge"
        rightAction={
          <IconButton
            onClick={() => setIsAdding(true)}
            aria-label="Add food"
            sx={{
              width: 36, height: 36,
              bgcolor: PALETTE.accent, color: "#fff",
              "&:hover": { bgcolor: PALETTE.accentDark },
              "&:active": { transform: "scale(0.93)" },
            }}
          >
            <AddRounded sx={{ fontSize: 18 }} />
          </IconButton>
        }
      />

      {/* Sort row */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, flexShrink: 0 }}>
        <Button
          startIcon={<SwapVertRounded sx={{ fontSize: 14 }} />}
          size="small"
          onClick={() => setIsSorted((s) => !s)}
          sx={{
            color: isSorted ? PALETTE.accent : PALETTE.textSecondary,
            fontSize: "0.75rem",
            fontWeight: 500,
            px: 1,
            minHeight: 32,
            bgcolor: isSorted ? PALETTE.accentLight : "transparent",
            borderRadius: "10px",
            "&:hover": { bgcolor: isSorted ? PALETTE.accentLight : "rgba(0,0,0,0.03)" },
          }}
        >
          {isSorted ? "By expiry" : "Sort by expiry"}
        </Button>
        <Typography sx={{ fontSize: "0.6875rem", color: PALETTE.textTertiary, fontWeight: 500 }}>
          {safeFoods.length} items{selectedIds.length > 0 ? ` · ${selectedIds.length} selected` : ""}
        </Typography>
      </Stack>

      {/* Scrollable list */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}>
        <Box sx={{ bgcolor: PALETTE.surface, borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          {sorted.map((food, index) => {
            const style = getFridgeExpiryStyle(food.expiryDate);
            const days = getDaysUntilExpiry(food.expiryDate);
            const daysText = days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d left`;
            const qty = food.quantity ?? 1;
            const isSelected = selectedIds.includes(food.id);

            return (
              <Box key={food.id}>
                <Stack
                  direction="row" alignItems="center"
                  onClick={() => toggleSelect(food.id)}
                  sx={{
                    px: 1.5, py: 1,
                    minHeight: 52,
                    cursor: "pointer",
                    bgcolor: isSelected ? `${PALETTE.accent}0A` : "transparent",
                    transition: "background-color 0.15s",
                    "&:active": { bgcolor: "rgba(0,0,0,0.04)" },
                  }}
                >
                  <Box sx={{ mr: 1.25, display: "flex", alignItems: "center", flexShrink: 0 }}>
                    {isSelected ? (
                      <CheckCircleRounded sx={{ fontSize: 22, color: PALETTE.accent }} />
                    ) : (
                      <RadioButtonUncheckedRounded sx={{ fontSize: 22, color: PALETTE.textTertiary }} />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: "1rem", mr: 1, lineHeight: 1, flexShrink: 0 }}>
                    {getEmoji(food.name)}
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: PALETTE.textPrimary }}>
                      {food.name}{qty > 1 ? ` ×${qty}` : ""}
                    </Typography>
                    <Typography sx={{ fontSize: "0.6875rem", color: PALETTE.textSecondary, mt: 0.25 }}>
                      {new Date(food.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </Typography>
                  </Box>
                  <Chip
                    label={daysText} size="small"
                    sx={{ height: 22, fontSize: "0.625rem", fontWeight: 600, bgcolor: style.bg, color: style.accent, mr: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); setFoods((f) => f.filter((x) => x.id !== food.id)); }}
                    sx={{ width: 36, height: 36, color: PALETTE.textTertiary, "&:hover": { color: "#B8423A", bgcolor: "rgba(184,66,58,0.08)" } }}
                    aria-label={`Delete ${food.name}`}
                  >
                    <DeleteOutlineRounded sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
                {index < sorted.length - 1 && <Box sx={{ mx: 1.5, borderBottom: `0.5px solid ${PALETTE.separator}` }} />}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Next button — flush to bottom */}
      {onNext && (
        <Box sx={{ flexShrink: 0, pt: 0.75, pb: 0.5 }}>
          <Button
            fullWidth variant="contained" size="large"
            disabled={selectedIds.length === 0}
            onClick={() => {
              const names = sorted.filter((i) => selectedIds.includes(i.id)).map((i) => i.name);
              onNext?.(names);
            }}
            sx={PRIMARY_CTA_SX}
          >
            Next{selectedIds.length > 0 ? ` — ${selectedIds.length} ingredient${selectedIds.length !== 1 ? "s" : ""}` : ""}
          </Button>
        </Box>
      )}
    </Box>
  );
}
