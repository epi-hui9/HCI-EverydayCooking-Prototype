/**
 * Mobile-style bottom tab bar: Home, Fridge, Recipes, Chat.
 * Placed inside the app frame; active tab reflects current (or logical) page.
 */
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

const TAB_HEIGHT = 64;

export function BottomNav({ currentPage, onNavigate }) {
  const activeTab = getActiveTabForPage(currentPage);

  return (
    <Box
      sx={{
        flexShrink: 0,
        height: TAB_HEIGHT,
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)",
        paddingTop: 8,
        background: "#fff",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 -1px 0 rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {BOTTOM_NAV_TABS.map((tab) => {
        const isActive = activeTab === tab;
        const Icon = ICONS[tab];
        return (
          <Box
            key={tab}
            component="button"
            type="button"
            onClick={() => onNavigate(tab === "Recipe" ? "Recipe" : tab)}
            aria-label={getNavLabel(tab)}
            aria-current={isActive ? "page" : undefined}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.25,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: isActive ? PALETTE.warmBrown : "text.secondary",
              transition: "color 0.2s ease",
              minWidth: 0,
              "&:hover": { color: isActive ? PALETTE.warmBrown : "text.primary" },
              "&:active": { opacity: 0.85 },
            }}
          >
            <Icon
              sx={{
                fontSize: 26,
                color: "inherit",
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: isActive ? 600 : 500, fontSize: "0.7rem", color: "inherit" }}>
              {getNavLabel(tab)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export const BOTTOM_NAV_HEIGHT = TAB_HEIGHT;
