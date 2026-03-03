import { useState, useRef } from "react";
import { Box } from "@mui/material";
import {
  Homepage,
  RecipeRecommendationPage,
  EnergyLevelPage,
  RecipeDetailsPage,
  RecipePreviewPage,
  FridgeContent,
  ChatbotInterface,
  PlaceholderPage,
  HistoryPage,
  WeeklyPlanPage,
} from "./pages";
import { BottomNav, BOTTOM_NAV_HEIGHT } from "./components/BottomNav";
import { ENERGY_BACKGROUNDS } from "./constants/energy";
import { PALETTE } from "./theme";

const FRAME_W = 393;
const FRAME_H = 852;

const FLEX_PAGES = ["Home", "Fridge", "Recipe", "RecipeRecommendation", "Chat"];

function App() {
  const [page, setPage] = useState("Home");
  const [returnToOnChatBack, setReturnToOnChatBack] = useState("Home");
  const [selectedIngredientNames, setSelectedIngredientNames] = useState([]);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [selectedRecipeForInstructions, setSelectedRecipeForInstructions] = useState(null);
  const [recipeFromRecipesTab, setRecipeFromRecipesTab] = useState(null);
  const [fromBrowseMore, setFromBrowseMore] = useState(false);

  const goToChat = () => {
    setReturnToOnChatBack(page);
    setSelectedRecipeForInstructions(null);
    setPage("Chat");
  };

  const goToRecipePreview = (recipe) => {
    setSelectedRecipeForInstructions(recipe ?? null);
    setPage("Recipe Preview");
  };

  const goToChatFromPreview = () => {
    setReturnToOnChatBack("Recipe Preview");
    setPage("Chat");
  };

  const handleIngredientsNext = (names) => {
    setSelectedIngredientNames(names ?? []);
    setSelectedEnergy((prev) => prev ?? "medium");
    setPage("Energy");
  };

  const handleEnergyContinueFromFridge = (energy) => {
    setSelectedEnergy(energy ?? "medium");
    setRecipeFromRecipesTab(null);
    setPage("Recipe Details");
  };

  const handleEnergyContinueFromRecipesTab = (energy) => {
    setSelectedEnergy(energy ?? "medium");
    setPage("RecipeRecommendation");
  };

  const handleRecipeFromRecipesTab = (recipe) => {
    setSelectedIngredientNames([]);
    setRecipeFromRecipesTab(recipe);
    setFromBrowseMore(false);
    setSelectedRecipeForInstructions(recipe);
    setPage("Recipe Preview");
  };

  const handleBrowseMoreRecipes = () => {
    setRecipeFromRecipesTab(null);
    setFromBrowseMore(true);
    setPage("Recipe Details");
  };

  const handleBottomNavNavigate = (tab) => {
    if (tab === "Recipe") setPage("Recipe");
    else if (tab === "Chat") {
      setSelectedRecipeForInstructions(null);
      setPage("Chat");
    } else setPage(tab);
  };

  const phoneFrameRef = useRef(null);

  const pages = {
    Home: <Homepage onNavigate={setPage} onOpenChat={goToChat} />,
    Fridge: (
      <FridgeContent
        onOpenChat={goToChat}
        onBack={() => setPage("Home")}
        onNext={handleIngredientsNext}
      />
    ),
    Recipe: (
      <EnergyLevelPage
        onOpenChat={goToChat}
        onBack={() => setPage("Home")}
        onContinue={handleEnergyContinueFromRecipesTab}
        selectedEnergy={selectedEnergy ?? "medium"}
        onEnergyChange={setSelectedEnergy}
      />
    ),
    RecipeRecommendation: (
      <RecipeRecommendationPage
        selectedEnergy={selectedEnergy ?? "medium"}
        onSelectRecipe={handleRecipeFromRecipesTab}
        onBack={() => setPage("Recipe")}
        onBrowseMore={handleBrowseMoreRecipes}
      />
    ),
    Energy: (
      <EnergyLevelPage
        onOpenChat={goToChat}
        onBack={() => setPage("Fridge")}
        onContinue={handleEnergyContinueFromFridge}
        selectedEnergy={selectedEnergy ?? "medium"}
        onEnergyChange={setSelectedEnergy}
      />
    ),
    "Recipe Preview": (
      <RecipePreviewPage
        recipe={selectedRecipeForInstructions}
        onBack={() => {
          if (recipeFromRecipesTab) {
            setRecipeFromRecipesTab(null);
            setPage("RecipeRecommendation");
          } else {
            setPage("Recipe Details");
          }
        }}
        onStartCooking={goToChatFromPreview}
      />
    ),
    "Recipe Details": (
      <RecipeDetailsPage
        onOpenChat={goToChat}
        onBack={() => {
          if (recipeFromRecipesTab) {
            setRecipeFromRecipesTab(null);
            setPage("RecipeRecommendation");
          } else if (fromBrowseMore) {
            setFromBrowseMore(false);
            setPage("RecipeRecommendation");
          } else {
            setPage("Energy");
          }
        }}
        selectedIngredientNames={selectedIngredientNames}
        selectedEnergy={selectedEnergy}
        initialRecipe={recipeFromRecipesTab}
        onNext={goToRecipePreview}
      />
    ),
    Chat: (
      <ChatbotInterface
        onBack={() => setPage(returnToOnChatBack)}
        onGoHome={() => {
          setSelectedRecipeForInstructions(null);
          setPage("Home");
        }}
        instructionRecipe={selectedRecipeForInstructions}
        returnToOnChatBack={returnToOnChatBack}
        bottomNavHeight={BOTTOM_NAV_HEIGHT}
      />
    ),
    History: <HistoryPage onBack={() => setPage("Home")} onNavigate={setPage} />,
    WeeklyPlan: <WeeklyPlanPage onBack={() => setPage("Home")} onNavigate={setPage} modalContainerRef={phoneFrameRef} />,
  };

  const pageBg =
    ["Energy", "Recipe"].includes(page)
      ? (ENERGY_BACKGROUNDS[selectedEnergy ?? "medium"] ?? PALETTE.background)
      : PALETTE.background;

  const isFlex = FLEX_PAGES.includes(page);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        background: {
          xs: pageBg,
          sm: "linear-gradient(160deg, #E2DFD9 0%, #D6D3CC 50%, #CBC7BF 100%)",
        },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: { xs: 0, sm: 2 },
        px: { xs: 0, sm: 1 },
      }}
    >
      <Box
        ref={phoneFrameRef}
        sx={{
          width: { xs: "100vw", sm: FRAME_W },
          height: { xs: "100dvh", sm: FRAME_H },
          maxHeight: { xs: "100dvh", sm: "calc(100dvh - 24px)" },
          borderRadius: { xs: 0, sm: "44px" },
          overflow: "hidden",
          position: "relative",
          transform: "translateZ(0)",
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
        {/* Dynamic Island */}
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

        {/* Content area */}
        <Box
          sx={{
            flex: 1,
            overflowY: isFlex ? "hidden" : "auto",
            overflowX: "hidden",
            minHeight: 0,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Box
            sx={{
              minHeight: "100%",
              ...(isFlex
                ? { height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }
                : { display: "block", pb: `${BOTTOM_NAV_HEIGHT + 8}px` }),
            }}
          >
            {pages[page]}
          </Box>
        </Box>

        <BottomNav currentPage={page} onNavigate={handleBottomNavNavigate} />
      </Box>
    </Box>
  );
}

export default App;
