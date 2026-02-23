import { Box, Stack, Typography, IconButton } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ConstructionRounded from "@mui/icons-material/ConstructionRounded";
import { PALETTE } from "../theme";

export default function PlaceholderPage({ title, onBack }) {
  return (
    <Box sx={{ px: 2, pt: 1, pb: 3, display: "flex", flexDirection: "column", minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
      </Stack>

      <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", mb: 4 }}>
        {title}
      </Typography>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pb: 8 }}>
        <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: PALETTE.surfaceSecondary, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
          <ConstructionRounded sx={{ fontSize: 28, color: PALETTE.textTertiary }} />
        </Box>
        <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: PALETTE.textPrimary, mb: 0.5 }}>
          Coming Soon
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, textAlign: "center", maxWidth: 200 }}>
          We're working on this feature. Check back later!
        </Typography>
      </Box>
    </Box>
  );
}
