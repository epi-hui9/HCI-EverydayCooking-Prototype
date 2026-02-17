import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Checkbox,
  Heading,
  Container,
  Flex,
  Spacer,
  Badge,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeftIcon, UpDownIcon } from "@chakra-ui/icons";

const initialIngredients = [
  { id: 1, name: "Spinach", emoji: "🥬", daysLeft: 2 },
  { id: 2, name: "Garlic", emoji: "🧄", daysLeft: 14 },
  { id: 3, name: "Ground Beef", emoji: "🐂", daysLeft: 1 },
  { id: 4, name: "Onions", emoji: "🧅", daysLeft: 7 },
  { id: 5, name: "Eggs", emoji: "🥚", daysLeft: 10 },
  { id: 6, name: "Milk", emoji: "🥛", daysLeft: 3 },
  { id: 7, name: "Chicken Breast", emoji: "🍗", daysLeft: 2 },
  { id: 8, name: "Tomato", emoji: "🍅", daysLeft: 5 },
  { id: 10, name: "Broccoli", emoji: "🥦", daysLeft: 4 },
  { id: 12, name: "Cheese", emoji: "🧀", daysLeft: 20 },
];

const RecipeSelectionPage = () => {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorted, setIsSorted] = useState(false);

  // Toggle selection
  const toggleIngredient = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Sorting Logic
  const handleSort = () => {
    const newSortedState = !isSorted;
    setIsSorted(newSortedState);

    const sortedList = [...ingredients].sort((a, b) => {
      return newSortedState ? a.daysLeft - b.daysLeft : a.id - b.id;
    });
    setIngredients(sortedList);
  };

  // Simulated Loading Function
  const handleFindRecipe = () => {
    setIsSearching(true);
    // Simulate 1.5 seconds of searching
    setTimeout(() => {
      setIsSearching(false);
      const selectedNames = ingredients
        .filter((item) => selectedIds.includes(item.id))
        .map((item) => item.name);
      alert(`Found 3 recipes for: ${selectedNames.join(", ")}`);
    }, 1500);
  };

  return (
    <Container maxW="md" p={0} h="100vh" centerContent>
      <Box
        w="full"
        h="full"
        bg="white"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Header Section */}
        <Box pt={12} pb={4} px={6}>
          <Flex align="center" mb={4}>
            <Button
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              color="green.600"
              size="sm"
            >
              Back
            </Button>
            <Spacer />
            <Heading size="md" fontWeight="bold">
              Storage
            </Heading>
            <Spacer />
            <Box w="60px" />
          </Flex>

          <Flex justify="space-between" align="center">
            {/* Sort Button in Top Left */}
            <Button
              leftIcon={<UpDownIcon />}
              size="xs"
              variant="outline"
              colorScheme={isSorted ? "green" : "gray"}
              onClick={handleSort}
            >
              {isSorted ? "Original Order" : "Sort by Expire"}
            </Button>
            <Text fontSize="xs" color="gray.500" fontWeight="bold">
              {selectedIds.length} items selected
            </Text>
          </Flex>
        </Box>

        {/* Scrollable List with Active State Feedback */}
        <VStack
          spacing={3}
          align="stretch"
          flex="1"
          overflowY="auto"
          px={8}
          pb={4}
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            WebkitOverflowScrolling: "touch",
          }}
        >
          {ingredients.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <HStack
                key={item.id}
                py={3}
                px={4}
                bg={isSelected ? "green.50" : "white"}
                borderRadius="xl"
                border="1px solid"
                borderColor={isSelected ? "green.300" : "gray.100"}
                justify="space-between"
                onClick={() => toggleIngredient(item.id)}
                cursor="pointer"
                /* Active State Feedback */
                transition="all 0.1s cubic-bezier(0.4, 0, 0.2, 1)"
                _active={{ transform: "scale(0.96)", bg: "gray.50" }}
                boxShadow={isSelected ? "sm" : "none"}
              >
                <HStack spacing={4}>
                  <Text fontSize="xl">{item.emoji}</Text>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="sm" color="gray.700">
                      {item.name}
                    </Text>
                    <Badge
                      colorScheme={item.daysLeft <= 3 ? "red" : "green"}
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      fontSize="10px"
                    >
                      {item.daysLeft} days left
                    </Badge>
                  </VStack>
                </HStack>
                <Checkbox
                  colorScheme="green"
                  isChecked={isSelected}
                  pointerEvents="none"
                />
              </HStack>
            );
          })}
        </VStack>

        {/* Footer with Loading Animation */}
        <Box
          p={8}
          pt={6}
          pb={12}
          bg="white"
          borderTop="1px solid"
          borderColor="gray.50"
        >
          <Button
            w="full"
            colorScheme="green"
            size="lg"
            h="60px"
            borderRadius="2xl"
            fontSize="lg"
            fontWeight="bold"
            boxShadow="0 4px 12px rgba(72, 187, 120, 0.2)"
            onClick={handleFindRecipe}
            isDisabled={selectedIds.length === 0}
            /* Loading State Implementation */
            isLoading={isSearching}
            loadingText="Searching..."
            _hover={{ bg: "green.500" }}
          >
            Find Recipe
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RecipeSelectionPage;
