import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import { ENERGY_OPTIONS } from "../constants/energy";
import { PALETTE } from "../theme";

const ENERGY_ICONS = { low: "🍃", medium: "🍳", high: "🔥" };

export default function EnergyLevelPage({ onBack, onContinue, selectedEnergy = "medium", onEnergyChange }) {
  return (
    <Box sx={{ px: 2, pt: 1, pb: 3, display: "flex", flexDirection: "column", minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
      </Stack>

      <Box sx={{ textAlign: "center", pt: 4, pb: 4 }}>
        <Typography sx={{ fontSize: "2.5rem", lineHeight: 1, mb: 1.5 }}>🥘</Typography>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", mb: 0.5 }}>
          How's your energy?
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", color: PALETTE.textSecondary }}>
          We'll match recipes to your pace
        </Typography>
      </Box>

      <Stack spacing={1.5} sx={{ flex: 1, justifyContent: "center", pb: 2 }}>
        {ENERGY_OPTIONS.map((option) => {
          const isActive = option.id === selectedEnergy;
          return (
            <Box
              key={option.id}
              component="button" type="button"
              onClick={() => onEnergyChange?.(option.id)}
              sx={{
                border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                borderRadius: "16px",
                bgcolor: isActive ? PALETTE.surface : "transparent",
                boxShadow: isActive ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
                outline: isActive ? `2px solid ${PALETTE.accent}` : `1.5px solid ${PALETTE.separator}`,
                px: 2, py: 1.75,
                transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                "&:hover": { bgcolor: isActive ? PALETTE.surface : "rgba(0,0,0,0.02)" },
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              <Box
                sx={{
                  width: 44, height: 44, borderRadius: "12px",
                  bgcolor: isActive ? PALETTE.accentLight : PALETTE.surfaceSecondary,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", flexShrink: 0, mr: 1.5,
                  transition: "all 0.25s",
                }}
              >
                {ENERGY_ICONS[option.id]}
              </Box>
              <Box sx={{ flex: 1, textAlign: "left" }}>
                <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: isActive ? PALETTE.accent : PALETTE.textPrimary }}>
                  {option.label}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary }}>
                  {option.description}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 22, height: 22, borderRadius: "50%",
                  border: isActive ? `6px solid ${PALETTE.accent}` : `2px solid ${PALETTE.textTertiary}`,
                  transition: "all 0.2s",
                }}
              />
            </Box>
          );
        })}

        <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textTertiary, textAlign: "center", pt: 1 }}>
          No right answer — just for right now.
        </Typography>
      </Stack>

      <Button
        fullWidth variant="contained" size="large"
        onClick={() => onContinue?.(selectedEnergy)}
        sx={{
          height: 50, borderRadius: "14px", fontSize: "1.0625rem", fontWeight: 600,
          bgcolor: PALETTE.accent, "&:hover": { bgcolor: PALETTE.accentDark },
        }}
      >
        Continue
      </Button>
    </Box>
  );
}
