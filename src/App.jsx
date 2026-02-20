/**
 * Root layout: outer background, app frame (phone-like), content area, bottom tab bar.
 * Navigation state and flow (Recipe → Energy → Recipe Details, Chat from anywhere).
 */
import { useState } from "react";
import { Box } from "@mui/material";
import {
  Homepage,
  RecipeSelectionPage,
  EnergyLevelPage,
  RecipeDetailsPage,
  FridgeContent,
  ChatbotInterface,
  PlaceholderPage,
} from "./pages";
import { BottomNav, BOTTOM_NAV_HEIGHT } from "./components/BottomNav";
import { ENERGY_BACKGROUNDS } from "./constants/energy";
import { PALETTE } from "./theme";

/** Phone frame: strict 393×852 rectangle, small corner radius so it looks like a phone, not an oval. */
const APP_FRAME_WIDTH = 393;
const APP_FRAME_HEIGHT = 852;
const APP_FRAME_BORDER_RADIUS = 4;
const OUTER_BG = "linear-gradient(160deg, #e8e4dc 0%, #d4cfc4 100%)";

function App() {
  const [page, setPage] = useState("Home");
  const [returnToOnChatBack, setReturnToOnChatBack] = useState("Home");
  const [selectedIngredientNames, setSelectedIngredientNames] = useState([]);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [selectedRecipeForInstructions, setSelectedRecipeForInstructions] = useState(null);

  const goToChat = () => {
    setReturnToOnChatBack(page);
    setSelectedRecipeForInstructions(null);
    setPage("Chat");
  };

  const goToChatWithRecipe = (recipe) => {
    setSelectedRecipeForInstructions(recipe ?? null);
    setReturnToOnChatBack("Recipe Details");
    setPage("Chat");
  };

  const handleIngredientsNext = (names) => {
    setSelectedIngredientNames(names ?? []);
    setSelectedEnergy((prev) => prev ?? "medium");
    setPage("Energy");
  };

  const handleEnergyContinue = (energy) => {
    setSelectedEnergy(energy ?? "medium");
    setPage("Recipe Details");
  };

  const handleBottomNavNavigate = (tab) => {
    if (tab === "Recipe") setPage("Recipe");
    else setPage(tab);
  };

  const pages = {
    Home: <Homepage onNavigate={setPage} onOpenChat={goToChat} />,
    Fridge: <FridgeContent onOpenChat={goToChat} onBack={() => setPage("Home")} />,
    Recipe: <RecipeSelectionPage onOpenChat={goToChat} onNext={handleIngredientsNext} onBack={() => setPage("Home")} />,
    Energy: (
      <EnergyLevelPage
        onOpenChat={goToChat}
        onBack={() => setPage("Recipe")}
        onContinue={handleEnergyContinue}
        selectedEnergy={selectedEnergy ?? "medium"}
        onEnergyChange={setSelectedEnergy}
      />
    ),
    "Recipe Details": (
      <RecipeDetailsPage
        onOpenChat={goToChat}
        onBack={() => setPage("Energy")}
        selectedIngredientNames={selectedIngredientNames}
        selectedEnergy={selectedEnergy}
        onNext={goToChatWithRecipe}
      />
    ),
    Chat: <ChatbotInterface onBack={() => setPage(returnToOnChatBack)} instructionRecipe={selectedRecipeForInstructions} />,
    History: <PlaceholderPage title="History" onOpenChat={goToChat} onBack={() => setPage("Home")} />,
    WeeklyPlan: <PlaceholderPage title="Weekly Plan" onOpenChat={goToChat} onBack={() => setPage("Home")} />,
  };

  const pageBg = page === "Energy" ? (ENERGY_BACKGROUNDS[selectedEnergy ?? "medium"] ?? PALETTE.cream) : PALETTE.cream;

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        background: OUTER_BG,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 2,
        px: 1,
        transition: "background 0.4s ease",
      }}
    >
      {/* App frame: no padding; content area has inset, nav bar is full-width to edges */}
      <Box
        sx={{
          width: APP_FRAME_WIDTH,
          height: APP_FRAME_HEIGHT,
          maxHeight: "calc(100dvh - 24px)",
          borderRadius: APP_FRAME_BORDER_RADIUS,
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
          bgcolor: pageBg,
          transition: "background-color 0.4s ease",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Scrollable content area: inset from edges so corners aren't clipped */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
            pt: 1.5,
            px: 1.5,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Box sx={{ pb: `${BOTTOM_NAV_HEIGHT}px` }}>
            {pages[page]}
          </Box>
        </Box>

        <BottomNav currentPage={page} onNavigate={handleBottomNavNavigate} />
      </Box>
    </Box>
  );
}

export default App;
