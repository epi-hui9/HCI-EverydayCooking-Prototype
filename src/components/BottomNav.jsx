import { Box, Typography } from "@mui/material";
import HomeRounded from "@mui/icons-material/HomeRounded";
import KitchenRounded from "@mui/icons-material/KitchenRounded";
import RestaurantRounded from "@mui/icons-material/RestaurantRounded";
import ChatRounded from "@mui/icons-material/ChatRounded";
import { BOTTOM_NAV_TABS, getNavLabel, getActiveTabForPage } from "../constants/navigation";
import { PALETTE } from "../theme";

const ICONS = {
  Home: HomeRounded,
  Fridge: KitchenRounded,
  Recipe: RestaurantRounded,
  Chat: ChatRounded,
};

const TAB_HEIGHT = 56;

export function BottomNav({ currentPage, onNavigate }) {
  const activeTab = getActiveTabForPage(currentPage);

  return (
    <Box
      className="glass-heavy"
      sx={{
        flexShrink: 0,
        height: TAB_HEIGHT,
        pb: "max(env(safe-area-inset-bottom, 0px), 4px)",
        pt: "6px",
        borderTop: `0.5px solid ${PALETTE.separator}`,
        display: "flex",
        alignItems: "stretch",
        position: "relative",
        zIndex: 15,
      }}
    >
      {BOTTOM_NAV_TABS.map((tab) => {
        const isActive = activeTab === tab;
        const Icon = ICONS[tab];
        return (
          <Box
            key={tab}
            component="button" type="button"
            onClick={() => onNavigate(tab === "Recipe" ? "Recipe" : tab)}
            aria-label={getNavLabel(tab)}
            aria-current={isActive ? "page" : undefined}
            sx={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "2px",
              border: "none", background: "transparent", cursor: "pointer",
              color: isActive ? PALETTE.accent : PALETTE.textTertiary,
              transition: "color 0.2s ease", minWidth: 0, p: 0,
              "&:hover": { color: isActive ? PALETTE.accent : PALETTE.textSecondary },
              "&:active": { transform: "scale(0.92)", transition: "transform 0.1s" },
            }}
          >
            <Icon sx={{ fontSize: 24, color: "inherit" }} />
            <Typography sx={{ fontWeight: isActive ? 600 : 500, fontSize: "0.625rem", color: "inherit", letterSpacing: "0.01em" }}>
              {getNavLabel(tab)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export const BOTTOM_NAV_HEIGHT = TAB_HEIGHT;
