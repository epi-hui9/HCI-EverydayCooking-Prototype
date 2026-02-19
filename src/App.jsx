import { useState } from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import {
  Homepage,
  RecipeSelectionPage,
  EnergyLevelPage,
  RecipeDetailsPage,
  FridgeContent,
  ChatbotInterface,
  PlaceholderPage,
} from "./pages";
import { NAV_ORDER, getNavLabel } from "./constants/navigation";
import { ENERGY_BACKGROUNDS } from "./constants/energy";

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
    History: <PlaceholderPage title="History" onOpenChat={goToChat} />,
    WeeklyPlan: <PlaceholderPage title="Weekly Plan" onOpenChat={goToChat} />,
  };

  const pageBg = page === "Energy" ? (ENERGY_BACKGROUNDS[selectedEnergy ?? "medium"] ?? "#f5f2ed") : "#f5f2ed";

  return (
    <Box minH="100vh" h="100%" w="100%" style={{ backgroundColor: pageBg, transition: "background-color 0.4s ease" }}>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={50}
        pt="calc(12px + env(safe-area-inset-top, 0px))"
        px={2}
        pb={2}
        style={{ background: `linear-gradient(to bottom, ${pageBg} 0%, ${pageBg} 60%, transparent)` }}
        pointerEvents="none"
      >
        <Box
          pointerEvents="auto"
          maxW="min(96vw, 420px)"
          mx="auto"
          overflowX="auto"
          overflowY="hidden"
          borderRadius="full"
          bg="rgba(255, 255, 255, 0.95)"
          border="1px solid rgba(0,0,0,0.06)"
          boxShadow="0 10px 30px rgba(0,0,0,0.08)"
          backdropFilter="blur(12px)"
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <HStack spacing={1} py={1.5} px={1.5} flexWrap="nowrap" display="inline-flex">
            {NAV_ORDER.map((key) => (
              <Button
                key={key}
                size="sm"
                minH="40px"
                minW="max-content"
                px={4}
                borderRadius="full"
                variant={page === key ? "solid" : "ghost"}
                colorScheme={page === key ? "green" : "gray"}
                onClick={() => setPage(key)}
                _active={{ transform: "scale(0.97)" }}
                transition="transform 0.15s ease, background 0.2s"
                fontWeight={page === key ? "600" : "500"}
              >
                {getNavLabel(key)}
              </Button>
            ))}
          </HStack>
        </Box>
      </Box>

      <Box
        pt="56px"
        pb="env(safe-area-inset-bottom, 0)"
        height="calc(100dvh - 56px)"
        maxHeight="calc(100vh - 56px)"
        overflowY="auto"
        overflowX="hidden"
        w="100%"
        bg="transparent"
        css={{
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {pages[page]}
      </Box>
    </Box>
  );
}

export default App;
