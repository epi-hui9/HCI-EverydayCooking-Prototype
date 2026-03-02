import { Box, Typography } from "@mui/material";
import { PALETTE } from "../theme";

export default function PageHeader({ title, leftAction, rightAction }) {
  return (
    <Box
      sx={{
        pt: 0.5,
        pb: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 44,
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, flex: 1 }}>
        {leftAction}
        <Typography
          sx={{
            fontSize: leftAction ? "1.25rem" : "1.75rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: PALETTE.textPrimary,
            ...(leftAction && { ml: 0.5 }),
          }}
        >
          {title}
        </Typography>
      </Box>
      {rightAction}
    </Box>
  );
}
