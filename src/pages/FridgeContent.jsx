/**
 * Fridge / Your Food: list of items with expiry, add/delete. Content fits inside app frame.
 */
import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  IconButton,
  Chip,
} from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Close from "@mui/icons-material/Close";
import Add from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ChatIcon from "@mui/icons-material/Chat";
import { PALETTE } from "../theme";

const getDaysUntilExpiry = (expiryDate) => {
  const today = new Date("2026-02-16");
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

const getExpiryColor = (expiryDate) => {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return { bg: "#8B7E74", text: "#FFF", label: "Expired" };
  if (days <= 1) return { bg: "#E8958E", text: "#5C1F1B", label: "Expiring Today!" };
  if (days <= 4) return { bg: "#F4C6A3", text: "#6B3E1F", label: "Expiring Soon" };
  if (days <= 14) return { bg: "#E8D99F", text: "#5C5220", label: "Use This Week" };
  if (days <= 90) return { bg: "#C8E6C9", text: "#2D5016", label: "Fresh" };
  return { bg: "#B3E5B7", text: "#1B4D1F", label: "Very Fresh" };
};

export default function FridgeContent({ onOpenChat, onBack }) {
  const [foods, setFoods] = useState([
    { id: 1, name: "Tomatoes", expiryDate: "2026-02-17", category: "Produce" },
    { id: 2, name: "Eggplant", expiryDate: "2026-02-20", category: "Produce" },
    { id: 3, name: "Corn", expiryDate: "2026-02-20", category: "Produce" },
    { id: 4, name: "Chips", expiryDate: "2026-07-01", category: "Snacks" },
    { id: 5, name: "Twizzlers", expiryDate: "2027-07-01", category: "Snacks" },
  ]);
  const [newFood, setNewFood] = useState({ name: "", expiryDate: "", category: "" });
  const [isOpen, setIsOpen] = useState(false);

  const handleAddFood = () => {
    if (newFood.name && newFood.expiryDate) {
      setFoods([
        ...foods,
        { id: Date.now(), name: newFood.name, expiryDate: newFood.expiryDate, category: newFood.category || "Other" },
      ]);
      setNewFood({ name: "", expiryDate: "", category: "" });
      setIsOpen(false);
    }
  };

  const handleDeleteFood = (id) => {
    setFoods(foods.filter((f) => f.id !== id));
  };

  const sortedFoods = [...foods].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  return (
    <Box sx={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {isOpen ? (
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Button startIcon={<ChevronLeft />} onClick={() => setIsOpen(false)} sx={{ color: "text.secondary" }}>
              Back
            </Button>
            <Typography variant="overline" sx={{ letterSpacing: 0.6, color: "text.secondary" }}>
              Add food
            </Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} aria-label="Close">
              <Close />
            </IconButton>
          </Stack>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Food Name"
              required
              placeholder="e.g., Strawberries"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              size="small"
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Expiry Date"
              required
              type="date"
              value={newFood.expiryDate}
              onChange={(e) => setNewFood({ ...newFood, expiryDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Category"
              placeholder="e.g., Produce, Dairy, Snacks"
              value={newFood.category}
              onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
              size="small"
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1, height: 46, borderRadius: 2, bgcolor: PALETTE.warmBrown, "&:hover": { bgcolor: PALETTE.warmBrown, opacity: 0.9 } }}
              onClick={handleAddFood}
            >
              Add to Fridge
            </Button>
          </Stack>
        </Box>
      ) : (
        <>
          <Box sx={{ px: 2.5, pt: 3, pb: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Button
                startIcon={<ChevronLeft />}
                onClick={onBack}
                sx={{ color: "text.secondary", minHeight: 44, "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}
              >
                Back
              </Button>
              <Typography variant="overline" sx={{ letterSpacing: 0.6, color: "text.secondary" }}>
                Fridge
              </Typography>
              <Box sx={{ width: 52 }} />
            </Stack>

            <Stack spacing={2} sx={{ mb: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
                    Expiring Soon
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Keep track of your food freshness
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setIsOpen(true)}
                  aria-label="Add food"
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: PALETTE.warmBrown,
                    color: "#fff",
                    boxShadow: "0 8px 24px rgba(212, 163, 115, 0.3)",
                    "&:hover": { bgcolor: PALETTE.warmBrown, opacity: 0.9, transform: "scale(1.04)" },
                  }}
                >
                  <Add />
                </IconButton>
              </Stack>
            </Stack>

            <Stack spacing={1.5}>
              {sortedFoods.map((food, index) => {
                const colorScheme = getExpiryColor(food.expiryDate);
                const daysLeft = getDaysUntilExpiry(food.expiryDate);
                return (
                  <Box
                    key={food.id}
                    sx={{
                      bgcolor: colorScheme.bg,
                      borderRadius: 2,
                      p: 2,
                      border: "1px solid rgba(0,0,0,0.06)",
                      boxShadow: "0 2px 10px rgba(50, 45, 35, 0.06)",
                      transition: "all 0.2s ease",
                      "&:hover": { transform: "translateY(-1px)", boxShadow: "0 4px 14px rgba(50, 45, 35, 0.08)" },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="h6" fontWeight={700} sx={{ color: colorScheme.text }}>
                            {food.name}
                          </Typography>
                          <Chip label={food.category} size="small" sx={{ bgcolor: "rgba(255,255,255,0.4)", color: colorScheme.text, fontWeight: 700 }} />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" sx={{ color: colorScheme.text, fontWeight: 600, opacity: 0.9 }}>
                            {new Date(food.expiryDate).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" })}
                          </Typography>
                          <Chip
                            size="small"
                            label={
                              daysLeft < 0
                                ? `Expired ${Math.abs(daysLeft)} days ago`
                                : daysLeft === 0
                                  ? "Expires today"
                                  : daysLeft === 1
                                    ? "Expires tomorrow"
                                    : `${daysLeft} days left`
                            }
                            sx={{ bgcolor: "rgba(0,0,0,0.15)", color: colorScheme.text, fontWeight: 700 }}
                          />
                        </Stack>
                      </Box>
                      <IconButton size="small" onClick={() => handleDeleteFood(food.id)} sx={{ color: colorScheme.text }} aria-label="Delete food">
                        <DeleteOutline />
                      </IconButton>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
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
        </>
      )}
    </Box>
  );
}
