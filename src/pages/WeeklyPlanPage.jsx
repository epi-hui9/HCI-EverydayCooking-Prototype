import { useState, useMemo } from "react";
import { Box, Stack, Typography, IconButton, Button, Modal, Chip } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import CalendarTodayRounded from "@mui/icons-material/CalendarTodayRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import RemoveCircleOutlineRounded from "@mui/icons-material/RemoveCircleOutlineRounded";
import { PALETTE, PRIMARY_CTA_SX } from "../theme";
import { useLocalStorageState } from "../utils/useLocalStorageState";
import { ALL_RECIPES } from "../data/recipes";
import { DEFAULT_FRIDGE, getDaysUntilExpiry, getEmoji } from "../data/ingredients";
import { getTodayInChicago, getWeekDatesChicago } from "../utils/chicagoTime";
import { PLAN_KEY } from "../utils/weeklyPlan";

const FRIDGE_KEY = "ep.foods.v3";

/** Normalize old format { recipeName, recipeId } to { meals: [...] } */
function getMealsForDay(plan, dateKey) {
  const entry = plan[dateKey];
  if (!entry) return [];
  if (entry.meals && Array.isArray(entry.meals)) return entry.meals;
  if (entry.recipeName) return [{ recipeName: entry.recipeName, recipeId: entry.recipeId }];
  return [];
}

function addMealToDay(plan, dateKey, recipe) {
  const next = { ...plan };
  const meals = getMealsForDay(plan, dateKey);
  next[dateKey] = { meals: [...meals, { recipeName: recipe.name, recipeId: recipe.id }] };
  return next;
}

function removeMealFromDay(plan, dateKey, mealIndex) {
  const next = { ...plan };
  const meals = getMealsForDay(plan, dateKey).filter((_, i) => i !== mealIndex);
  if (meals.length === 0) delete next[dateKey];
  else next[dateKey] = { meals };
  return next;
}

function clearDay(plan, dateKey) {
  const next = { ...plan };
  delete next[dateKey];
  return next;
}

export default function WeeklyPlanPage({ onBack, onNavigate, onStartCookingWithRecipe, modalContainerRef }) {
  const [plan, setPlan] = useLocalStorageState(PLAN_KEY, {});
  const [foods] = useLocalStorageState(FRIDGE_KEY, DEFAULT_FRIDGE);
  const [modalDay, setModalDay] = useState(null);

  const weekDates = useMemo(getWeekDatesChicago, []);

  const fridgeList = Array.isArray(foods) ? foods : [];
  const useSoonCount = fridgeList.filter((f) => {
    const days = getDaysUntilExpiry(f.expiryDate);
    return days <= 4 && days >= 0;
  }).length;

  const plannedCount = weekDates.reduce((sum, w) => sum + getMealsForDay(plan, w.dateKey).length, 0);

  const handleAddMeal = (dateKey, recipe) => {
    setPlan((p) => addMealToDay(p, dateKey, recipe));
  };

  const handleRemoveMeal = (dateKey, mealIndex) => {
    setPlan((p) => removeMealFromDay(p, dateKey, mealIndex));
  };

  const handleClearDay = (dateKey) => {
    setPlan((p) => clearDay(p, dateKey));
    setModalDay(null);
  };

  const handleStartCooking = () => {
    const todayKey = getTodayInChicago();
    const plannedMeals = getMealsForDay(plan, todayKey);
    const firstRecipe = plannedMeals.length > 0
      ? ALL_RECIPES.find((r) => r.id === plannedMeals[0].recipeId || r.name === plannedMeals[0].recipeName)
      : null;
    if (firstRecipe && onStartCookingWithRecipe) {
      onStartCookingWithRecipe(firstRecipe);
    } else {
      onNavigate?.("Recipe");
    }
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
              {plannedCount}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary, fontWeight: 600 }}>meals planned this week</Typography>
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
        {weekDates.map((w) => {
          const key = w.dateKey;
          const meals = getMealsForDay(plan, key);
          const hasMeals = meals.length > 0;
          const isToday = getTodayInChicago() === key;

          return (
            <Box
              key={key}
              component="button"
              type="button"
              onClick={() => setModalDay(w)}
              sx={{
                border: "none",
                cursor: "pointer",
                borderRadius: "16px",
                bgcolor: PALETTE.surface,
                borderLeft: `4px solid ${isToday ? PALETTE.accent : hasMeals ? PALETTE.ecoMedium : PALETTE.separator}`,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
                textAlign: "left",
                p: 0,
                "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: PALETTE.textSecondary, mb: 0.25 }}>
                    {w.dayName} · {w.dateStr}
                    {isToday && (
                      <Chip label="Today" size="small" sx={{ ml: 1, height: 18, fontSize: "0.625rem", fontWeight: 700, bgcolor: PALETTE.accentLight, color: PALETTE.accent }} />
                    )}
                  </Typography>
                  {hasMeals ? (
                    <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700, color: PALETTE.textPrimary }} noWrap>
                      {meals.length === 1
                        ? meals[0].recipeName
                        : meals.length === 2
                          ? `${meals[0].recipeName}, ${meals[1].recipeName}`
                          : `${meals[0].recipeName} +${meals.length - 1} more`}
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
                {hasMeals && (
                  <Typography sx={{ fontSize: "1.25rem", flexShrink: 0 }}>{getEmoji(ALL_RECIPES.find((r) => r.name === meals[0].recipeName)?.ingredients?.[0] ?? "🥗")}</Typography>
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
              {modalDay && `${modalDay.dayName} · ${modalDay.dateStr}`}
            </Typography>
            <IconButton onClick={() => setModalDay(null)} sx={{ color: PALETTE.textSecondary }}>
              <CloseRounded />
            </IconButton>
          </Stack>
          <Box sx={{ overflowY: "auto", flex: 1, py: 1, "&::-webkit-scrollbar": { display: "none" } }}>
            {modalDay && (() => {
              const dateKey = modalDay.dateKey;
              const meals = getMealsForDay(plan, dateKey);
              return (
                <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
                  {meals.length > 0 && (
                    <>
                      <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, color: PALETTE.textSecondary, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        Planned ({meals.length})
                      </Typography>
                      {meals.map((m, i) => (
                        <Stack
                          key={i}
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                          sx={{
                            borderRadius: "12px",
                            bgcolor: PALETTE.sageLight,
                            p: 1.25,
                            border: `1px solid ${PALETTE.separator}`,
                          }}
                        >
                          <Typography sx={{ fontSize: "1.125rem" }}>{getEmoji(ALL_RECIPES.find((r) => r.name === m.recipeName)?.ingredients?.[0] ?? "🥗")}</Typography>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700, color: PALETTE.textPrimary }}>{m.recipeName}</Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveMeal(dateKey, i)}
                            sx={{ color: PALETTE.textTertiary, "&:hover": { color: PALETTE.accent } }}
                          >
                            <RemoveCircleOutlineRounded sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button
                        fullWidth
                        onClick={() => handleClearDay(dateKey)}
                        sx={{
                          justifyContent: "flex-start",
                          color: PALETTE.textTertiary,
                          fontWeight: 500,
                          textTransform: "none",
                          fontSize: "0.8125rem",
                          "&:hover": { bgcolor: PALETTE.surfaceSecondary },
                        }}
                      >
                        Clear all
                      </Button>
                      <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, color: PALETTE.textSecondary, letterSpacing: "0.04em", textTransform: "uppercase", pt: 0.5 }}>
                        Add another meal
                      </Typography>
                    </>
                  )}
                  {ALL_RECIPES.map((recipe) => (
                    <Box
                      key={recipe.id}
                      component="button"
                      type="button"
                      onClick={() => handleAddMeal(dateKey, recipe)}
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
              );
            })()}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
