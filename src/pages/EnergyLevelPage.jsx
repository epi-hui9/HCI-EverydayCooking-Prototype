/**
 * Recipe flow step 2: energy check-in. Content fits inside app frame.
 */
import React from "react";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChatIcon from "@mui/icons-material/Chat";
import { ENERGY_OPTIONS } from "../constants/energy";
import { PALETTE } from "../theme";

export default function EnergyLevelPage({ onOpenChat, onBack, onContinue, selectedEnergy = "medium", onEnergyChange }) {
  return (
    <Box sx={{ minHeight: "100%", width: "100%", display: "flex", flexDirection: "column", px: 2.5, pt: 3, pb: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Button
          startIcon={<ChevronLeft />}
          onClick={onBack}
          sx={{ color: "text.secondary", minHeight: 44, "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}
        >
          Back
        </Button>
        <Typography variant="overline" sx={{ letterSpacing: 0.6, color: "text.secondary" }}>
          Energy check-in
        </Typography>
        <Box sx={{ width: 52 }} />
      </Stack>

      <Stack alignItems="center" spacing={1} sx={{ mt: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: PALETTE.sageLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>🥘</Typography>
        </Box>
        <Typography variant="body2" fontWeight={500} textAlign="center" color="text.secondary">
          How much energy do you have right now?
        </Typography>
        <Typography variant="caption" textAlign="center" color="text.disabled">
          Your kitchen will follow your pace.
        </Typography>
      </Stack>

      <Stack spacing={1.5} sx={{ flex: 1, pb: 2, pt: 1, justifyContent: "center" }}>
        {ENERGY_OPTIONS.map((option, index) => {
          const isActive = option.id === selectedEnergy;
          const isLow = option.id === "low";
          const isHigh = option.id === "high";
          return (
            <Box
              key={option.id}
              onClick={() => onEnergyChange?.(option.id)}
              sx={{
                minHeight: 52,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                border: "1px solid",
                borderColor: isActive ? PALETTE.sage : "transparent",
                bgcolor: isActive ? PALETTE.sageLight : "transparent",
                px: 1.5,
                py: 1,
                transition: "all 0.26s ease",
                "&:hover": {
                  bgcolor: isActive ? PALETTE.sageLight : "rgba(0,0,0,0.03)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: "100%" }}>
                <Box
                  sx={{
                    width: option.size,
                    height: option.size,
                    borderRadius: "50%",
                    bgcolor: "#fff",
                    border: "2px solid",
                    borderColor: isHigh ? PALETTE.sage : isLow ? PALETTE.sageLight : PALETTE.sage,
                    boxShadow: isActive ? "0 12px 28px rgba(0,0,0,0.08)" : "0 4px 14px rgba(0,0,0,0.04)",
                    transform: isActive ? "translateY(-2px) scale(1.03)" : "scale(1)",
                  }}
                />
                <Stack spacing={0}>
                  <Typography variant="body2" fontWeight={isActive ? 600 : 500} color="text.primary">
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          );
        })}
        <Typography variant="caption" textAlign="center" color="text.disabled" sx={{ pt: 0 }}>
          No right answer — this is just for right now.
        </Typography>
      </Stack>

      <Stack spacing={1} sx={{ pt: 2, pb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          size="medium"
          sx={{
            minHeight: 48,
            borderRadius: 2,
            fontWeight: 600,
            bgcolor: PALETTE.warmBrown,
            "&:hover": { bgcolor: PALETTE.warmBrown, opacity: 0.9 },
          }}
          onClick={() => onContinue?.(selectedEnergy)}
        >
          Continue
        </Button>
        <Button size="small" sx={{ color: "text.disabled" }}>
          Skip for now
        </Button>
      </Stack>

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
    </Box>
  );
}
