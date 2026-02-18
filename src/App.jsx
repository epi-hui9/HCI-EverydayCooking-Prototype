import { useState } from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import RecipeSelectionPage from "./RecipeSelectionPage";
import EnergyLevelPage from "./EnergyLevelPage";
import FridgeContent from "./FridgeContent";
import ChatbotInterface from "./ChatbotInterface";
import Homepage from "./Homepage";
import PlaceholderPage from "./PlaceholderPage";

function App() {
  const [page, setPage] = useState("Home");
  const [returnToOnChatBack, setReturnToOnChatBack] = useState("Home");

  const goToChat = () => {
    setReturnToOnChatBack(page);
    setPage("Chat");
  };

  const pages = {
    Home: <Homepage onNavigate={setPage} onOpenChat={goToChat} />,
    Fridge: <FridgeContent onOpenChat={goToChat} onBack={() => setPage("Home")} />,
    Recipe: <RecipeSelectionPage onOpenChat={goToChat} onNext={() => setPage("Energy")} onBack={() => setPage("Home")} />,
    Energy: <EnergyLevelPage onOpenChat={goToChat} onBack={() => setPage("Recipe")} />,
    Chat: <ChatbotInterface onBack={() => setPage(returnToOnChatBack)} />,
    History: <PlaceholderPage title="History" onOpenChat={goToChat} />,
    WeeklyPlan: <PlaceholderPage title="Weekly Plan" onOpenChat={goToChat} />,
  };

  return (
    <>
      <Box position="fixed" top="12px" left="50%" transform="translateX(-50%)" zIndex={50}>
        <HStack
          spacing={2}
          bg="rgba(255, 255, 255, 0.9)"
          border="1px solid rgba(0,0,0,0.06)"
          borderRadius="full"
          px={2}
          py={2}
          boxShadow="0 10px 30px rgba(0,0,0,0.08)"
          backdropFilter="blur(10px)"
        >
          {["Home", "Fridge", "Recipe", "Energy", "Chat"].map((key) => (
            <Button
              key={key}
              size="sm"
              borderRadius="full"
              variant={page === key ? "solid" : "ghost"}
              colorScheme={page === key ? "green" : "gray"}
              onClick={() => setPage(key)}
            >
              {key}
            </Button>
          ))}
        </HStack>
      </Box>

      {pages[page]}
    </>
  );
}

export default App;
