import React, { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Flex,
  Heading,
  Button,
  Spacer,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChatIcon } from "@chakra-ui/icons";
import { ALL_RECIPES } from "../data/recipes";
import { MAX_MINUTES_BY_ENERGY } from "../constants/energy";
import { parseMinutes } from "../utils/recipe";

const RecipeDetailsPage = ({ onOpenChat, onBack, selectedIngredientNames = [], selectedEnergy, onNext }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const selectedSet = new Set(selectedIngredientNames.map((n) => n.trim()));

  let recipes =
    selectedSet.size === 0
      ? [...ALL_RECIPES]
      : ALL_RECIPES.filter((r) => r.ingredients.every((ing) => selectedSet.has(ing)));

  if (selectedEnergy && MAX_MINUTES_BY_ENERGY[selectedEnergy] != null) {
    const maxMin = MAX_MINUTES_BY_ENERGY[selectedEnergy];
    recipes = recipes.filter((r) => {
      const total = parseMinutes(r.prepTime) + parseMinutes(r.cookTime);
      return total <= maxMin;
    });
  }

  const handleNext = () => {
    if (selectedRecipe) onNext?.(selectedRecipe);
  };

  return (
    <Box minH="100vh" bg="#f5f2ed" display="flex" flexDirection="column" alignItems="stretch">
      <Box
        flex="1"
        w="100%"
        maxW="420px"
        mx="auto"
        pt={6}
        pb={8}
        px={5}
        bg="#fdfbf8"
        borderRadius="2xl"
        boxShadow="0 4px 24px rgba(55, 45, 35, 0.06)"
        position="relative"
        minH="100vh"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <Box pb={4} style={{ animation: "slideIn 0.4s ease-out forwards" }}>
          <Flex align="center" mb={4}>
            <Button
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              color="gray.500"
              size="sm"
              minH="44px"
              px={3}
              _hover={{ bg: "rgba(0,0,0,0.04)" }}
              _active={{ bg: "rgba(0,0,0,0.06)" }}
              onClick={onBack}
            >
              Back
            </Button>
            <Spacer />
            <Heading
              fontSize="11px"
              fontWeight="500"
              letterSpacing="0.06em"
              textTransform="uppercase"
              color="gray.500"
            >
              Recipe Details
            </Heading>
            <Spacer />
            <Box w="52px" />
          </Flex>
        </Box>

        <VStack
          spacing={3}
          align="stretch"
          flex="1"
          overflowY="auto"
          pb={4}
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            WebkitOverflowScrolling: "touch",
          }}
        >
          {recipes.length === 0 ? (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={6}>
              No recipes match your ingredients{selectedEnergy ? " and energy level" : ""}. Try different ingredients or energy on the previous steps.
            </Text>
          ) : (
            recipes.map((recipe, index) => {
              const isSelected = selectedRecipe?.id === recipe.id;
              return (
                <Flex
                  key={recipe.id}
                  align="flex-start"
                  justify="space-between"
                  minH="52px"
                  style={{ animation: `slideIn 0.4s ease-out ${index * 0.04}s both` }}
                  py={3}
                  px={4}
                  bg={isSelected ? "rgba(200, 220, 210, 0.4)" : "rgba(255,255,255,0.6)"}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={isSelected ? "rgba(90, 122, 106, 0.3)" : "rgba(0,0,0,0.06)"}
                  transition="all 0.2s ease"
                  _hover={{ bg: isSelected ? "rgba(200, 220, 210, 0.5)" : "rgba(0,0,0,0.02)" }}
                  cursor="pointer"
                  onClick={() => setSelectedRecipe(recipe)}
                  _active={{ transform: "scale(0.98)" }}
                >
                  <VStack align="start" spacing={1} flex="1" minW={0}>
                    <Text fontWeight="600" fontSize="sm" color="gray.600">
                      {recipe.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {recipe.prepTime} prep / {recipe.cookTime} cook
                    </Text>
                  </VStack>
                  <Text fontSize="sm" color="gray.600" flexShrink={0} pt={0}>
                    {recipe.calories} cal
                  </Text>
                </Flex>
              );
            })
          )}
        </VStack>

        {onNext && (
          <Box pt={4} pb={2}>
            <Button
              w="full"
              size="md"
              minH="48px"
              h="48px"
              borderRadius="xl"
              fontSize="sm"
              fontWeight="600"
              bg="var(--primary)"
              color="white"
              boxShadow="0 8px 24px rgba(90, 122, 106, 0.22)"
              onClick={handleNext}
              isDisabled={!selectedRecipe}
              _hover={{ bg: "var(--primary-hover)" }}
              _active={{ bg: "var(--primary-active)", transform: "scale(0.98)" }}
            >
              Next
            </Button>
          </Box>
        )}

        {onOpenChat && (
          <Tooltip label="Chat" placement="left">
            <IconButton
              aria-label="Open Chat"
              icon={<ChatIcon color="white" boxSize={6} />}
              size="md"
              minW="44px"
              minH="44px"
              borderRadius="full"
              bg="#5a7a6a"
              color="white"
              position="absolute"
              bottom="calc(16px + var(--safe-bottom))"
              right="16px"
              boxShadow="0 4px 16px rgba(90, 122, 106, 0.4)"
              _hover={{ bg: "#4d6b5d", transform: "scale(1.05)" }}
              _active={{ bg: "#445d50", transform: "scale(0.95)" }}
              onClick={onOpenChat}
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default RecipeDetailsPage;
