import { useState, useMemo } from "react";
import { Box, Stack, Typography, IconButton, Button, Modal, Chip } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import CalendarTodayRounded from "@mui/icons-material/CalendarTodayRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import { PALETTE, PRIMARY_CTA_SX } from "../theme";
import { useLocalStorageState } from "../utils/useLocalStorageState";
import { ALL_RECIPES } from "../data/recipes";
import { DEFAULT_FRIDGE, getDaysUntilExpiry, getEmoji } from "../data/ingredients";

const PLAN_KEY = "ep.weeklyPlan";
const FRIDGE_KEY = "ep.foods.v3";
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function toDateKey(d) {
  return d.toISOString().slice(0, 10);
}

export default function WeeklyPlanPage({ onBack, onNavigate, modalContainerRef }) {
  const [plan, setPlan] = useLocalStorageState(PLAN_KEY, {});
  const [foods] = useLocalStorageState(FRIDGE_KEY, DEFAULT_FRIDGE);
  const [modalDay, setModalDay] = useState(null);

  const weekDates = useMemo(getWeekDates, []);

  const fridgeList = Array.isArray(foods) ? foods : [];
  const useSoonCount = fridgeList.filter((f) => {
    const days = getDaysUntilExpiry(f.expiryDate);
    return days <= 4 && days >= 0;
  }).length;

  const plannedCount = weekDates.filter((d) => plan[toDateKey(d)]?.recipeName).length;

  const setPlanForDay = (dateKey, recipe) => {
    setPlan((p) => {
      const next = { ...p };
      if (recipe) next[dateKey] = { recipeName: recipe.name, recipeId: recipe.id };
      else delete next[dateKey];
      return next;
    });
    setModalDay(null);
  };

  const handleStartCooking = () => {
    onNavigate?.("Recipe");
  };

  return (
    <Box sx={{ px: 2, pt: 1, pb: 4, minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
      {/* Back */}
      <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
      </Stack>

      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${PALETTE.sageDark} 0%, ${PALETTE.ecoMedium} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarTodayRounded sx={{ fontSize: 22, color: "#fff" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: PALETTE.textPrimary, lineHeight: 1.2 }}>
              Weekly Plan
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, mt: 0.25 }}>
              Plan meals to use what you have — reduce waste
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Summary card */}
      <Box
        sx={{
          borderRadius: "18px",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${PALETTE.sageLight} 0%, ${PALETTE.surface} 50%, ${PALETTE.cream} 100%)`,
          border: `1px solid ${PALETTE.separator}`,
          p: 2,
          mb: 2,
          boxShadow: "0 4px 20px rgba(92, 110, 72, 0.08)",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: PALETTE.textPrimary, letterSpacing: "-0.02em" }}>
              {plannedCount} of 7
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary, fontWeight: 600 }}>meals planned</Typography>
          </Box>
          {useSoonCount > 0 && (
            <Chip
              label={`${useSoonCount} expiring soon`}
              size="small"
              sx={{
                height: 28,
                fontSize: "0.75rem",
                fontWeight: 700,
                bgcolor: `${PALETTE.ecoDeep}18`,
                color: PALETTE.ecoDeep,
              }}
            />
          )}
        </Stack>
      </Box>

      {/* Week label */}
      <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: PALETTE.textSecondary, mb: 1.25, letterSpacing: "0.04em" }}>
        THIS WEEK
      </Typography>

      {/* Day cards */}
      <Stack spacing={1.25}>
        {weekDates.map((d) => {
          const key = toDateKey(d);
          const entry = plan[key];
          const isToday = toDateKey(new Date()) === key;
          const dayName = DAY_NAMES[d.getDay() === 0 ? 6 : d.getDay() - 1];
          const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

          return (
            <Box
              key={key}
              component="button"
              type="button"
              onClick={() => setModalDay(d)}
              sx={{
                border: "none",
                cursor: "pointer",
                borderRadius: "16px",
                bgcolor: PALETTE.surface,
                borderLeft: `4px solid ${isToday ? PALETTE.accent : entry ? PALETTE.ecoMedium : PALETTE.separator}`,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
                textAlign: "left",
                p: 0,
                "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: PALETTE.textSecondary, mb: 0.25 }}>
                    {dayName} · {dateStr}
                    {isToday && (
                      <Chip label="Today" size="small" sx={{ ml: 1, height: 18, fontSize: "0.625rem", fontWeight: 700, bgcolor: PALETTE.accentLight, color: PALETTE.accent }} />
                    )}
                  </Typography>
                  {entry?.recipeName ? (
                    <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700, color: PALETTE.textPrimary }}>
                      {entry.recipeName}
                    </Typography>
                  ) : (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <AddRounded sx={{ fontSize: 18, color: PALETTE.textTertiary }} />
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: PALETTE.textTertiary }}>
                        Add meal
                      </Typography>
                    </Stack>
                  )}
                </Box>
                {entry && (
                  <Typography sx={{ fontSize: "1.25rem" }}>{getEmoji(ALL_RECIPES.find((r) => r.name === entry.recipeName)?.ingredients?.[0] ?? "🥗")}</Typography>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>

      {/* CTA */}
      {onNavigate && (
        <Button
          fullWidth
          variant="contained"
          onClick={handleStartCooking}
          startIcon={<LocalFireDepartmentRounded sx={{ fontSize: 20 }} />}
          sx={{ mt: 2, ...PRIMARY_CTA_SX }}
        >
          Start Cooking
        </Button>
      )}

      {/* Recipe picker modal — container keeps it inside phone frame on desktop */}
      <Modal
        open={!!modalDay}
        onClose={() => setModalDay(null)}
        container={modalContainerRef?.current ?? undefined}
        sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 393,
            maxHeight: "70vh",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            bgcolor: PALETTE.surface,
            boxShadow: "0 -8px 32px rgba(0,0,0,0.12)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${PALETTE.separator}` }}>
            <Typography sx={{ fontSize: "1.125rem", fontWeight: 700, color: PALETTE.textPrimary }}>
              {modalDay && `${DAY_NAMES[modalDay.getDay() === 0 ? 6 : modalDay.getDay() - 1]} · ${modalDay.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
            </Typography>
            <IconButton onClick={() => setModalDay(null)} sx={{ color: PALETTE.textSecondary }}>
              <CloseRounded />
            </IconButton>
          </Stack>
          <Box sx={{ overflowY: "auto", flex: 1, py: 1, "&::-webkit-scrollbar": { display: "none" } }}>
            {modalDay && (
              <Stack spacing={0.75} sx={{ px: 2, pb: 2 }}>
                <Button
                  fullWidth
                  onClick={() => setPlanForDay(toDateKey(modalDay), null)}
                  sx={{
                    justifyContent: "flex-start",
                    color: PALETTE.textTertiary,
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": { bgcolor: PALETTE.surfaceSecondary },
                  }}
                >
                  Clear
                </Button>
                {ALL_RECIPES.map((recipe) => (
                  <Box
                    key={recipe.id}
                    component="button"
                    type="button"
                    onClick={() => setPlanForDay(toDateKey(modalDay), recipe)}
                    sx={{
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "14px",
                      bgcolor: PALETTE.surfaceSecondary,
                      p: 1.5,
                      textAlign: "left",
                      transition: "all 0.15s",
                      "&:hover": { bgcolor: PALETTE.accentLight },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Typography sx={{ fontSize: "1.25rem" }}>{getEmoji(recipe.ingredients?.[0])}</Typography>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700, color: PALETTE.textPrimary }}>
                          {recipe.name}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.25 }}>
                          <Chip
                            icon={<AccessTimeRounded sx={{ fontSize: 12 }} />}
                            label={`${recipe.prepTime} + ${recipe.cookTime}`}
                            size="small"
                            sx={{ height: 20, fontSize: "0.625rem", bgcolor: PALETTE.surface, color: PALETTE.textSecondary }}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
