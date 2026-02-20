/**
 * Placeholder for History and Weekly Plan. Content fits inside app frame.
 */
import React from "react";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChatIcon from "@mui/icons-material/Chat";
import { PALETTE } from "../theme";

export default function PlaceholderPage({ title, onOpenChat, onBack }) {
  return (
    <Box sx={{ minHeight: "100%", display: "flex", flexDirection: "column", px: 2.5, pt: 3, pb: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Button startIcon={<ChevronLeft />} onClick={onBack} sx={{ color: "text.secondary", minHeight: 44 }}>
          Back
        </Button>
        <Typography variant="overline" sx={{ letterSpacing: 0.6, color: "text.secondary" }}>
          {title}
        </Typography>
        <Box sx={{ width: 52 }} />
      </Stack>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Coming soon
        </Typography>
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
    </Box>
  );
}
