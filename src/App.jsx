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

const FRAME_W = 393;
const FRAME_H = 852;

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

  const pageBg =
    page === "Energy"
      ? (ENERGY_BACKGROUNDS[selectedEnergy ?? "medium"] ?? PALETTE.background)
      : PALETTE.background;

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        background: {
          xs: pageBg, // 手机端：不要外层背景渐变，直接用 app 背景
          sm: "linear-gradient(160deg, #E2DFD9 0%, #D6D3CC 50%, #CBC7BF 100%)", // 桌面端：保留展示背景
        },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: { xs: 0, sm: 2 },
        px: { xs: 0, sm: 1 },
      }}
    >
      {/* iPhone shell (desktop only) / Fullscreen app (mobile) */}
      <Box
        sx={{
          width: { xs: "100vw", sm: FRAME_W },
          height: { xs: "100dvh", sm: FRAME_H },
          maxHeight: { xs: "100dvh", sm: "calc(100dvh - 24px)" },
          borderRadius: { xs: 0, sm: "44px" },
          overflow: "hidden",
          boxShadow: {
            xs: "none",
            sm:
              "0 0 0 1px rgba(0,0,0,0.08), 0 30px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.10), inset 0 0 0 1.5px rgba(255,255,255,0.15)",
          },
          bgcolor: pageBg,
          transition: "background-color 0.5s cubic-bezier(.4,0,.2,1)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* Status bar area (hide on mobile) */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            height: 54,
            flexShrink: 0,
            alignItems: "flex-end",
            justifyContent: "center",
            pb: 0.5,
            px: 4,
            position: "relative",
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              width: 126,
              height: 34,
              borderRadius: "20px",
              bgcolor: "#000",
              position: "absolute",
              top: 10,
            }}
          />
        </Box>

        {/* Scrollable content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Box sx={{ pb: `${BOTTOM_NAV_HEIGHT + 8}px`, minHeight: "100%" }}>
            {pages[page]}
          </Box>
        </Box>

        {/* Bottom nav */}
        <BottomNav currentPage={page} onNavigate={handleBottomNavNavigate} />

        {/* Home indicator (hide on mobile) */}
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 134,
            height: 5,
            borderRadius: 3,
            bgcolor: "rgba(0,0,0,0.18)",
            zIndex: 20,
          }}
        />
      </Box>
    </Box>
  );
}

export default App;