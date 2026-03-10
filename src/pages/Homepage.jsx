import { useState } from "react";
import { Box, Stack, IconButton, Typography, LinearProgress, Dialog, DialogTitle, DialogContent } from "@mui/material";
import ChatRounded from "@mui/icons-material/ChatRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import CalendarTodayRounded from "@mui/icons-material/CalendarTodayRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import { PALETTE } from "../theme";
import { useGamification } from "../context/GamificationContext";
import { useSavedRecipes } from "../utils/useSavedRecipes";

/**
 * CO₂ equivalents (UK Gov 2022 / Our World in Data):
 * Car: ~0.17 kg/km → 1 kg ≈ 6 km
 * Short flight: ~0.25 kg/km → 1 kg ≈ 4 km
 * We use car/drive only for small values (most relatable).
 * Flight comparison only when meaningful (e.g. 50 kg ≈ 1 short flight).
 */
function getCo2Reference(kg) {
  const carKm = Math.round(kg * 6);
  const driveMin = Math.round((carKm / 50) * 60);
  if (kg < 1) return null;
  if (kg < 3) return `≈ ${carKm} km by car`;
  if (kg < 15) return driveMin >= 60 ? `≈ ${carKm} km drive (≈ ${Math.round(driveMin / 60)} hr)` : `≈ ${carKm} km drive`;
  if (kg < 50) return `≈ ${carKm} km drive`;
  const shortFlights = Math.round(kg / 50);
  return shortFlights >= 1 ? `≈ ${carKm} km drive · like ${shortFlights} short flight${shortFlights > 1 ? "s" : ""}` : `≈ ${carKm} km drive`;
}

function ImpactCard({ co2SavedKg, level, points, streakDays, pointsInCurrentLevel, pointsToNextLevel, POINTS_PER_LEVEL }) {
  const refText = getCo2Reference(co2SavedKg);
  return (
    <Box
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        background: `linear-gradient(145deg, ${PALETTE.ecoDeep} 0%, ${PALETTE.ecoDark} 60%, #344A28 100%)`,
        color: "#fff",
        p: 1.5,
        mb: 1.25,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <Box sx={{ position: "absolute", top: -24, right: -8, width: 80, height: 80, borderRadius: "50%", background: `${PALETTE.sage}12` }} />
      <Box sx={{ position: "absolute", bottom: -16, left: -12, width: 60, height: 60, borderRadius: "50%", background: `${PALETTE.sage}08` }} />

      <Typography sx={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7, mb: 0.5 }}>
        Your impact this week
      </Typography>

      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 0.25 }}>
        <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
          {co2SavedKg}
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, opacity: 0.75 }}>
          kg CO₂ saved
        </Typography>
      </Stack>

      {refText && (
        <Typography sx={{ fontSize: "0.6875rem", opacity: 0.7, mb: 1.25, lineHeight: 1.3 }}>
          {refText}
        </Typography>
      )}

      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Box sx={{ flex: 1, bgcolor: `${PALETTE.sage}22`, borderRadius: "10px", p: 1, textAlign: "center" }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>Lv.{level}</Typography>
          <Typography sx={{ fontSize: "0.5625rem", opacity: 0.6, mt: 0.125 }}>{points} pts</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: `${PALETTE.sage}22`, borderRadius: "10px", p: 1, textAlign: "center" }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
            <LocalFireDepartmentRounded sx={{ fontSize: 14, color: PALETTE.accentRaw }} />
            <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>{streakDays}</Typography>
          </Stack>
          <Typography sx={{ fontSize: "0.5625rem", opacity: 0.6, mt: 0.125 }}>day streak</Typography>
        </Box>
      </Stack>

      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.375 }}>
          <Typography sx={{ fontSize: "0.5625rem", fontWeight: 600, opacity: 0.7 }}>Next level</Typography>
          <Typography sx={{ fontSize: "0.5625rem", opacity: 0.5 }}>{pointsToNextLevel} pts to go</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={(pointsInCurrentLevel / POINTS_PER_LEVEL) * 100}
          sx={{
            height: 3,
            borderRadius: 2,
            bgcolor: `${PALETTE.sage}25`,
            "& .MuiLinearProgress-bar": { borderRadius: 2, bgcolor: PALETTE.sage },
          }}
        />
      </Box>
    </Box>
  );
}

const TILES = [
  { label: "History", icon: HistoryRounded, nav: "History", color: PALETTE.textTertiary },
  { label: "Weekly Plan", icon: CalendarTodayRounded, nav: "WeeklyPlan", color: PALETTE.sageDark },
  { label: "Saved", icon: StarRounded, nav: "SavedRecipes", color: PALETTE.accent },
];

export default function Homepage({ onNavigate, onOpenChat }) {
  const { saved } = useSavedRecipes();
  const savedCount = Array.isArray(saved) ? saved.length : 0;
  const {
    co2SavedKg, moneySavedTotal, level, points, streakDays,
    pointsInCurrentLevel, pointsToNextLevel, POINTS_PER_LEVEL,
    getAchievements,
  } = useGamification();

  const achievements = getAchievements();
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);

  return (
    <Box
      sx={{
        px: 2,
        pt: 1,
        pb: 2,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, flexShrink: 0 }}>
        <Box>
          <Typography sx={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", color: PALETTE.textPrimary, lineHeight: 1.15 }}>
            Earthplate
          </Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, fontWeight: 500, mt: 0.25, letterSpacing: "0.01em" }}>
            Cook smart. Waste less.
          </Typography>
        </Box>

        {onOpenChat && (
          <IconButton
            aria-label="Open Chat"
            onClick={onOpenChat}
            sx={{
              width: 40, height: 40, bgcolor: PALETTE.textPrimary, color: "#fff",
              "&:hover": { bgcolor: PALETTE.textPrimary, opacity: 0.85 },
              "&:active": { transform: "scale(0.93)" },
              transition: "all 0.15s ease",
            }}
          >
            <ChatRounded sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Stack>

      {/* Impact card — compact, with relatable CO₂ references */}
      <ImpactCard
        co2SavedKg={co2SavedKg}
        level={level}
        points={points}
        streakDays={streakDays}
        pointsInCurrentLevel={pointsInCurrentLevel}
        pointsToNextLevel={pointsToNextLevel}
        POINTS_PER_LEVEL={POINTS_PER_LEVEL}
      />

      {/* Money saved — subtle bridge below the card, doesn't compete */}
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 500,
          color: PALETTE.textSecondary,
          textAlign: "center",
          mb: 1.5,
          opacity: 0.9,
          letterSpacing: "0.02em",
        }}
      >
        {typeof moneySavedTotal === "number" && moneySavedTotal > 0
          ? `That's about $${moneySavedTotal.toFixed(1)} saved from waste`
          : "Use expiring ingredients to save money"}
      </Typography>

      {/* Achievements — clickable to view details */}
      {achievements.length > 0 && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            mb: 1.5,
            px: 0.5,
            flexShrink: 0,
            cursor: "pointer",
            borderRadius: "12px",
            py: 0.75,
            "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
            "&:active": { bgcolor: "rgba(0,0,0,0.04)" },
          }}
          onClick={() => setAchievementDialogOpen(true)}
        >
          <EmojiEventsRounded sx={{ fontSize: 14, color: PALETTE.accentRaw }} />
          <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, color: PALETTE.textSecondary, letterSpacing: "0.02em" }}>
            Achievements
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ ml: "auto !important" }}>
            {unlockedAchievements.slice(0, 4).map((a) => (
              <Box
                key={a.id}
                component="span"
                title={`${a.name}: ${a.desc}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setAchievementDialogOpen(true);
                }}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  bgcolor: PALETTE.sageLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.12)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
                }}
              >
                {a.icon}
              </Box>
            ))}
          </Stack>
        </Stack>
      )}

      {/* Achievement details dialog */}
      <Dialog
        open={achievementDialogOpen}
        onClose={() => setAchievementDialogOpen(false)}
        PaperProps={{
          sx: {
            mx: 2,
            maxWidth: 360,
            width: "100%",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: "1.125rem",
            fontWeight: 700,
            color: PALETTE.textPrimary,
            borderBottom: `1px solid ${PALETTE.separator}`,
            py: 1.5,
          }}
        >
          <EmojiEventsRounded sx={{ fontSize: 22, color: PALETTE.accentRaw }} />
          Achievements
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Stack spacing={0}>
            {achievements.map((a) => (
              <Stack
                key={a.id}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${PALETTE.separator}`,
                  opacity: a.unlocked ? 1 : 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    bgcolor: a.unlocked ? PALETTE.sageLight : PALETTE.surfaceSecondary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                  }}
                >
                  {a.unlocked ? a.icon : <LockRounded sx={{ fontSize: 18, color: PALETTE.textTertiary }} />}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700, color: PALETTE.textPrimary }}>
                    {a.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, mt: 0.25 }}>
                    {a.desc}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Quick access — Start Cooking as hero tile, then 2×2 grid */}
      <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: PALETTE.textSecondary, mb: 1, px: 0.5, letterSpacing: "0.01em", flexShrink: 0 }}>
        Quick access
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, alignContent: "start" }}>
        {/* Start Cooking — ingredient-first flow */}
        <Box
          component="button"
          type="button"
          onClick={() => onNavigate?.("Fridge")}
          sx={{
            gridColumn: "1 / -1",
            border: "none",
            cursor: "pointer",
            height: 72,
            borderRadius: "16px",
            background: `linear-gradient(135deg, ${PALETTE.sageLight} 0%, ${PALETTE.surface} 100%)`,
            borderLeft: `4px solid ${PALETTE.ecoMedium}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              background: `linear-gradient(135deg, ${PALETTE.sageLight} 0%, ${PALETTE.surface} 100%)`,
            },
            "&:active": { transform: "scale(0.99)" },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              bgcolor: `${PALETTE.ecoMedium}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalFireDepartmentRounded sx={{ fontSize: 20, color: PALETTE.ecoDeep }} />
          </Box>
          <Box sx={{ flex: 1, textAlign: "left", minWidth: 0 }}>
            <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700, color: PALETTE.textPrimary, letterSpacing: "-0.01em" }}>
              Start Cooking
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary, mt: 0.25 }}>
              Pick ingredients → get recipes
            </Typography>
          </Box>
        </Box>

        {TILES.map((item) => {
          const Icon = item.icon;
          const isSaved = item.nav === "SavedRecipes";
          return (
            <Box
              key={item.label}
              component="button"
              type="button"
              onClick={() => onNavigate?.(item.nav)}
              sx={{
                border: "none",
                cursor: "pointer",
                height: 80,
                borderRadius: "16px",
                bgcolor: PALETTE.surface,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                p: 2,
                transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
                "&:active": { transform: "scale(0.97)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: `${item.color}14`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon sx={{ fontSize: 18, color: item.color }} />
              </Box>
              <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: PALETTE.textPrimary, textAlign: "left" }}>
                {item.label}{isSaved && savedCount > 0 ? ` (${savedCount})` : ""}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
