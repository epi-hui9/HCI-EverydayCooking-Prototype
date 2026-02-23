import { useState } from "react";
import { Box, Button, Stack, Typography, TextField, IconButton, Chip } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { PALETTE } from "../theme";

const getDaysUntilExpiry = (expiryDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

const getExpiryStyle = (expiryDate) => {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return { accent: "#B8423A", bg: "#FEF0EF", label: "Expired" };
  if (days <= 1) return { accent: "#D4603A", bg: "#FFF4EC", label: "Today" };
  if (days <= 4) return { accent: PALETTE.accent, bg: PALETTE.accentLight, label: "Soon" };
  if (days <= 14) return { accent: PALETTE.ecoMedium, bg: PALETTE.sageLight, label: "Good" };
  return { accent: PALETTE.ecoDeep, bg: PALETTE.sageLight, label: "Fresh" };
};

export default function FridgeContent({ onBack }) {
  const [foods, setFoods] = useState([
    { id: 1, name: "Tomatoes", expiryDate: "2026-02-23", category: "Produce" },
    { id: 2, name: "Eggplant", expiryDate: "2026-02-26", category: "Produce" },
    { id: 3, name: "Corn", expiryDate: "2026-02-26", category: "Produce" },
    { id: 4, name: "Chips", expiryDate: "2026-07-01", category: "Snacks" },
    { id: 5, name: "Twizzlers", expiryDate: "2027-07-01", category: "Snacks" },
  ]);
  const [newFood, setNewFood] = useState({ name: "", expiryDate: "", category: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddFood = () => {
    if (newFood.name && newFood.expiryDate) {
      setFoods((prev) => [...prev, { id: Date.now(), ...newFood, category: newFood.category || "Other" }]);
      setNewFood({ name: "", expiryDate: "", category: "" });
      setIsAdding(false);
    }
  };

  const sorted = [...foods].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

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
          <TextField label="Food Name" required placeholder="e.g. Strawberries" value={newFood.name} onChange={(e) => setNewFood({ ...newFood, name: e.target.value })} size="small" fullWidth />
          <TextField label="Expiry Date" required type="date" value={newFood.expiryDate} onChange={(e) => setNewFood({ ...newFood, expiryDate: e.target.value })} InputLabelProps={{ shrink: true }} size="small" fullWidth />
          <TextField label="Category" placeholder="e.g. Produce, Dairy" value={newFood.category} onChange={(e) => setNewFood({ ...newFood, category: e.target.value })} size="small" fullWidth />
          <Button
            fullWidth variant="contained" onClick={handleAddFood}
            sx={{ mt: 1, height: 48, borderRadius: "12px", bgcolor: PALETTE.accent, fontWeight: 600, fontSize: "1rem", "&:hover": { bgcolor: PALETTE.accentDark } }}
          >
            Add to Fridge
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, pt: 1, pb: 3, animation: "fadeIn 0.25s ease" }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Your Food</Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, mt: 0.25 }}>{foods.length} items tracked</Typography>
        </Box>
        <IconButton
          onClick={() => setIsAdding(true)} aria-label="Add food"
          sx={{ width: 38, height: 38, bgcolor: PALETTE.accent, color: "#fff", "&:hover": { bgcolor: PALETTE.accentDark }, "&:active": { transform: "scale(0.93)" } }}
        >
          <AddRounded sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>

      <Box sx={{ bgcolor: PALETTE.surface, borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {sorted.map((food, index) => {
          const style = getExpiryStyle(food.expiryDate);
          const days = getDaysUntilExpiry(food.expiryDate);
          const daysText = days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d left`;
          return (
            <Box key={food.id}>
              <Stack direction="row" alignItems="center" sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: style.accent, flexShrink: 0, mr: 1.5 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: PALETTE.textPrimary }}>{food.name}</Typography>
                    <Chip label={food.category} size="small" sx={{ height: 20, fontSize: "0.6875rem", fontWeight: 500, bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textSecondary }} />
                  </Stack>
                  <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary, mt: 0.25 }}>
                    {new Date(food.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </Typography>
                </Box>
                <Chip label={daysText} size="small" sx={{ height: 24, fontSize: "0.6875rem", fontWeight: 600, bgcolor: style.bg, color: style.accent, mr: 1 }} />
                <IconButton size="small" onClick={() => setFoods((f) => f.filter((x) => x.id !== food.id))} sx={{ color: PALETTE.textTertiary, "&:hover": { color: "#B8423A" } }} aria-label={`Delete ${food.name}`}>
                  <DeleteOutlineRounded sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>
              {index < sorted.length - 1 && <Box sx={{ mx: 2, borderBottom: `0.5px solid ${PALETTE.separator}` }} />}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
