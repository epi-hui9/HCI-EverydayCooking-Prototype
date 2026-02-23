import { Box, Stack, IconButton, Typography, LinearProgress, Button } from "@mui/material";
import ChatRounded from "@mui/icons-material/ChatRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import KitchenRounded from "@mui/icons-material/KitchenRounded";
import RestaurantMenuRounded from "@mui/icons-material/RestaurantMenuRounded";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import CalendarTodayRounded from "@mui/icons-material/CalendarTodayRounded";
import { PALETTE } from "../theme";
import { useGamification } from "../context/GamificationContext";

const TILES = [
  { label: "Your Food", icon: KitchenRounded, nav: "Fridge", color: PALETTE.ecoMedium },
  { label: "Recipes", icon: RestaurantMenuRounded, nav: "Recipe", color: PALETTE.accent },
  { label: "History", icon: HistoryRounded, nav: "History", color: PALETTE.textTertiary },
  { label: "Weekly Plan", icon: CalendarTodayRounded, nav: "WeeklyPlan", color: PALETTE.sageDark },
];

export default function Homepage({ onNavigate, onOpenChat }) {
  const {
    co2SavedKg, level, points, streakDays,
    pointsInCurrentLevel, pointsToNextLevel, POINTS_PER_LEVEL,
    getAchievements, addSavedMeal,
  } = useGamification();

  const achievements = getAchievements().filter((a) => a.unlocked).slice(0, 4);

  return (
    <Box sx={{ px: 2, pt: 1, pb: 3, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", color: PALETTE.textPrimary, lineHeight: 1.15 }}>
            Earthplate
          </Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, fontWeight: 500, mt: 0.25, letterSpacing: "0.01em" }}>
            Cook smart. Waste less.
          </Typography>

          {/* DEV-ONLY: test persistence quickly */}
          {import.meta.env.DEV && (
            <Button
              onClick={() => addSavedMeal?.(1)}
              sx={{
                mt: 1,
                borderRadius: "999px",
                px: 2,
                py: 0.75,
                fontSize: "0.75rem",
                bgcolor: PALETTE.surface,
                border: `1px solid ${PALETTE.separator}`,
                color: PALETTE.textSecondary,
                "&:hover": { bgcolor: PALETTE.accentLight, borderColor: PALETTE.accentRaw },
                textTransform: "none",
              }}
            >
              Debug: +1 saved meal
            </Button>
          )}
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

      {/* Impact card — sage green gradient derived from CCD5AE */}
      <Box
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          background: `linear-gradient(145deg, ${PALETTE.ecoDeep} 0%, ${PALETTE.ecoDark} 60%, #344A28 100%)`,
          color: "#fff",
          p: 2.5,
          mb: 2,
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: "absolute", top: -30, right: -10, width: 120, height: 120, borderRadius: "50%", background: `${PALETTE.sage}15` }} />
        <Box sx={{ position: "absolute", bottom: -20, left: -15, width: 90, height: 90, borderRadius: "50%", background: `${PALETTE.sage}10` }} />

        <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7, mb: 1.5 }}>
          Your impact this week
        </Typography>

        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 0.5 }}>
          <Typography sx={{ fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {co2SavedKg}
          </Typography>
          <Typography sx={{ fontSize: "1rem", fontWeight: 500, opacity: 0.75 }}>
            kg CO₂ saved
          </Typography>
        </Stack>

        <Typography sx={{ fontSize: "0.75rem", opacity: 0.5, mb: 2.5, lineHeight: 1.4 }}>
          Using food before it expires reduces waste emissions.
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1, bgcolor: `${PALETTE.sage}22`, borderRadius: "12px", p: 1.5, textAlign: "center" }}>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 700 }}>Lv.{level}</Typography>
            <Typography sx={{ fontSize: "0.6875rem", opacity: 0.6, mt: 0.25 }}>{points} pts</Typography>
          </Box>
          <Box sx={{ flex: 1, bgcolor: `${PALETTE.sage}22`, borderRadius: "12px", p: 1.5, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
              <LocalFireDepartmentRounded sx={{ fontSize: 18, color: PALETTE.accentRaw }} />
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 700 }}>{streakDays}</Typography>
            </Stack>
            <Typography sx={{ fontSize: "0.6875rem", opacity: 0.6, mt: 0.25 }}>day streak</Typography>
          </Box>
        </Stack>

        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
            <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, opacity: 0.7 }}>Next level</Typography>
            <Typography sx={{ fontSize: "0.6875rem", opacity: 0.5 }}>{pointsToNextLevel} pts to go</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(pointsInCurrentLevel / POINTS_PER_LEVEL) * 100}
            sx={{
              height: 5, borderRadius: 3,
              bgcolor: `${PALETTE.sage}25`,
              "& .MuiLinearProgress-bar": { borderRadius: 3, bgcolor: PALETTE.sage },
            }}
          />
        </Box>
      </Box>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5, px: 0.5 }}>
          <EmojiEventsRounded sx={{ fontSize: 16, color: PALETTE.accentRaw }} />
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: PALETTE.textSecondary, letterSpacing: "0.02em" }}>
            Achievements
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ ml: "auto !important" }}>
            {achievements.map((a) => (
              <Box
                key={a.id} title={a.name}
                sx={{
                  width: 32, height: 32, borderRadius: "10px",
                  bgcolor: PALETTE.sageLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", transition: "transform 0.15s",
                  "&:hover": { transform: "scale(1.12)" },
                }}
              >
                {a.icon}
              </Box>
            ))}
          </Stack>
        </Stack>
      )}

      {/* Quick access grid */}
      <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: PALETTE.textSecondary, mb: 1.5, px: 0.5, letterSpacing: "0.01em" }}>
        Quick access
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
        {TILES.map((item) => {
          const Icon = item.icon;
          return (
            <Box
              key={item.label}
              component="button" type="button"
              onClick={() => onNavigate?.(item.nav)}
              sx={{
                border: "none", cursor: "pointer", height: 96, borderRadius: "16px",
                bgcolor: PALETTE.surface,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between",
                p: 2, transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
                "&:active": { transform: "scale(0.97)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
              }}
            >
              <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: `${item.color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon sx={{ fontSize: 18, color: item.color }} />
              </Box>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: PALETTE.textPrimary, textAlign: "left" }}>
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}