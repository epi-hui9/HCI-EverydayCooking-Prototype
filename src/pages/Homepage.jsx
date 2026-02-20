/**
 * Home screen: food waste impact (gamification) + quick navigation tiles.
 * Shows CO₂ saved, level, points, streak, and achievements.
 */
import React from "react";
import { Box, Button, Grid, Stack, IconButton, Tooltip, Typography, LinearProgress } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SpaIcon from "@mui/icons-material/Spa";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { HOMEPAGE_BUTTON_COLORS } from "../constants/theme";
import { PALETTE } from "../theme";
import { useGamification } from "../context/GamificationContext";

export default function Homepage({ onNavigate, onOpenChat }) {
  const {
    co2SavedKg,
    level,
    points,
    streakDays,
    pointsInCurrentLevel,
    pointsToNextLevel,
    POINTS_PER_LEVEL,
    getAchievements,
  } = useGamification();

  const tiles = [
    { label: "Your Food", color: HOMEPAGE_BUTTON_COLORS.yourFood, nav: "Fridge" },
    { label: "Recipes", color: HOMEPAGE_BUTTON_COLORS.recipes, nav: "Recipe" },
    { label: "History", color: HOMEPAGE_BUTTON_COLORS.history, nav: "History" },
    { label: "Weekly Plan", color: HOMEPAGE_BUTTON_COLORS.weeklyPlan, nav: "WeeklyPlan" },
  ];

  const achievements = getAchievements().filter((a) => a.unlocked).slice(0, 4);

  return (
    <Box sx={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      <Box sx={{ px: 2.5, pt: 3, pb: 2 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: "-0.03em", color: "text.primary" }}>
              Earthplate
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, mt: 0.25 }}>
              Cook smart. Waste less.
            </Typography>
          </Box>
          {onOpenChat && (
            <Tooltip title="Chat" placement="left">
              <IconButton
                aria-label="Open Chat"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: PALETTE.warmBrown,
                  color: "#fff",
                  boxShadow: "0 6px 20px rgba(212, 163, 115, 0.4)",
                  "&:hover": { bgcolor: PALETTE.warmBrown, opacity: 0.92, transform: "scale(1.05)" },
                }}
                onClick={onOpenChat}
              >
                <ChatIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* Food Waste Impact / Gamification card */}
        <Box
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            background: "linear-gradient(135deg, #5a7a6a 0%, #4a6a5a 100%)",
            color: "#fff",
            p: 2.5,
            mb: 2.5,
            boxShadow: "0 12px 40px rgba(90, 122, 106, 0.35)",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <SpaIcon sx={{ fontSize: 22, opacity: 0.95 }} />
            <Typography variant="overline" sx={{ letterSpacing: 1.2, opacity: 0.95, fontWeight: 600 }}>
              Your impact this week
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              {co2SavedKg} kg
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
              CO₂ saved
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ opacity: 0.85, display: "block", mb: 2 }}>
            By using food before it expires, you&apos;re reducing emissions from waste.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.18)", borderRadius: 2, p: 1.5, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Level {level}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>Points: {points}</Typography>
            </Box>
            <Box sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.18)", borderRadius: 2, p: 1.5, textAlign: "center" }}>
              <LocalFireDepartmentIcon sx={{ fontSize: 28, color: "#ffab40", verticalAlign: "middle", mr: 0.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, display: "inline" }}>
                {streakDays} day{streakDays !== 1 ? "s" : ""}
              </Typography>
              <Typography variant="caption" sx={{ display: "block", opacity: 0.9 }}>Streak</Typography>
            </Box>
          </Stack>

          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.95 }}>Next level</Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>{pointsToNextLevel} pts to go</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(pointsInCurrentLevel / POINTS_PER_LEVEL) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,0.2)",
                "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: "#fff" },
              }}
            />
          </Box>
        </Box>

        {/* Achievements row */}
        {achievements.length > 0 && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <EmojiEventsIcon sx={{ fontSize: 20, color: PALETTE.warmBrown }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
              Achievements
            </Typography>
            <Stack direction="row" spacing={1}>
              {achievements.map((a) => (
                <Tooltip key={a.id} title={a.name} placement="top">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: PALETTE.sageLight,
                      border: "1px solid",
                      borderColor: PALETTE.sage,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                    }}
                  >
                    {a.icon}
                  </Box>
                </Tooltip>
              ))}
            </Stack>
          </Stack>
        )}

        {/* Quick nav tiles */}
        <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1.5 }}>
          Quick access
        </Typography>
        <Grid container spacing={2}>
          {tiles.map((item, index) => (
            <Grid item xs={6} key={item.label}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  height: 96,
                  minHeight: 96,
                  fontSize: "1rem",
                  fontWeight: 700,
                  borderRadius: 2.5,
                  bgcolor: item.color,
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  "&:hover": { bgcolor: item.color, opacity: 0.92, transform: "translateY(-2px)", boxShadow: "0 12px 28px rgba(0,0,0,0.15)" },
                  transition: "all 0.2s ease",
                }}
                onClick={() => onNavigate?.(item.nav)}
              >
                {item.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
