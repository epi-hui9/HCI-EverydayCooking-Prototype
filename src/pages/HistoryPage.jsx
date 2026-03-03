import { Box, Stack, Typography, IconButton, Chip, Button } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import { PALETTE, PRIMARY_CTA_SX } from "../theme";
import { useGamification } from "../context/GamificationContext";

function formatHistoryDate(isoString) {
  const d = new Date(isoString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dNorm = new Date(d);
  dNorm.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - dNorm) / 864e5);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
}

export default function HistoryPage({ onBack, onNavigate }) {
  const { getCookingHistory, mealsSaved, co2SavedKg, moneySavedTotal } = useGamification();
  const history = getCookingHistory();

  const savedFromWasteCount = history.filter((h) => h.savedFromWaste).length;

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
          <Box sx={{ width: 40, height: 40, borderRadius: "12px", bgcolor: `${PALETTE.sage}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HistoryRounded sx={{ fontSize: 22, color: PALETTE.ecoDeep }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: PALETTE.textPrimary, lineHeight: 1.2 }}>
              Your Cooking Journey
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, mt: 0.25 }}>
              Every meal counts toward your impact
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Summary card — premium gradient */}
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
        <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: PALETTE.ecoDeep, mb: 1.5 }}>
          Your impact
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 80 }}>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: PALETTE.textPrimary, letterSpacing: "-0.02em" }}>
              {mealsSaved}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary, fontWeight: 600 }}>meals saved</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 80 }}>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: PALETTE.ecoDeep, letterSpacing: "-0.02em" }}>
              {co2SavedKg}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary, fontWeight: 600 }}>kg CO₂ saved</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 80 }}>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: PALETTE.accent, letterSpacing: "-0.02em" }}>
              ${typeof moneySavedTotal === "number" ? moneySavedTotal.toFixed(1) : moneySavedTotal ?? "0"}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary, fontWeight: 600 }}>saved</Typography>
          </Box>
          {savedFromWasteCount > 0 && (
            <Box sx={{ flex: 1, minWidth: 80 }}>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: PALETTE.accent, letterSpacing: "-0.02em" }}>
                {savedFromWasteCount}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary, fontWeight: 600 }}>from waste</Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Timeline */}
      <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: PALETTE.textSecondary, mb: 1.25, letterSpacing: "0.04em" }}>
        RECENT HISTORY
      </Typography>

      {history.length === 0 ? (
        <Box
          sx={{
            borderRadius: "20px",
            bgcolor: PALETTE.surface,
            border: `1px dashed ${PALETTE.separator}`,
            p: 4,
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
          }}
        >
          <Box sx={{ width: 64, height: 64, borderRadius: "20px", bgcolor: PALETTE.sageLight, display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 1.5 }}>
            <Typography sx={{ fontSize: "2rem" }}>🍳</Typography>
          </Box>
          <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700, color: PALETTE.textPrimary, mb: 0.5 }}>
            Start your journey
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: PALETTE.textSecondary, mb: 2, lineHeight: 1.4 }}>
            Complete a recipe to see your impact here. Every meal saved from waste counts.
          </Typography>
          {onNavigate && (
            <Button
              variant="contained"
              onClick={() => onNavigate("Recipe")}
              startIcon={<LocalFireDepartmentRounded sx={{ fontSize: 18 }} />}
              sx={PRIMARY_CTA_SX}
            >
              Start Cooking
            </Button>
          )}
        </Box>
      ) : (
        <Stack spacing={1.25}>
          {history.map((entry) => (
            <Box
              key={entry.id ?? entry.date}
              sx={{
                borderRadius: "16px",
                bgcolor: PALETTE.surface,
                border: `1px solid ${entry.savedFromWaste ? `${PALETTE.ecoMedium}40` : PALETTE.separator}`,
                overflow: "hidden",
                boxShadow: entry.savedFromWaste ? "0 0 0 1px rgba(143, 160, 122, 0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
                "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700, color: PALETTE.textPrimary, mb: 0.25 }}>
                    {entry.recipeName ?? "Meal"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary }}>
                    {formatHistoryDate(entry.date)}
                  </Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
                  <Chip
                    label={`${entry.co2Saved ?? 0.5} kg CO₂`}
                    size="small"
                    sx={{
                      height: 26,
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      bgcolor: `${PALETTE.ecoMedium}22`,
                      color: PALETTE.ecoDeep,
                    }}
                  />
                  {(entry.moneySaved ?? 0) > 0 && (
                    <Chip
                      label={`$${entry.moneySaved.toFixed(2)}`}
                      size="small"
                      sx={{
                        height: 26,
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        bgcolor: `${PALETTE.accent}22`,
                        color: PALETTE.accentDark,
                      }}
                    />
                  )}
                  <Chip
                    icon={<LocalFireDepartmentRounded sx={{ fontSize: 14 }} />}
                    label={`+${entry.pointsEarned ?? 10}`}
                    size="small"
                    sx={{
                      height: 26,
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      bgcolor: `${PALETTE.accent}18`,
                      color: PALETTE.accentDark,
                      "& .MuiChip-icon": { color: PALETTE.accentRaw },
                    }}
                  />
                  {entry.savedFromWaste && (
                    <Chip
                      label="Saved"
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.625rem",
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                        bgcolor: PALETTE.ecoDeep,
                        color: "#fff",
                      }}
                    />
                  )}
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
