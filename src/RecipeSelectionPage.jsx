import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Checkbox,
  Heading,
  Flex,
  Spacer,
  Badge,
  useDisclosure,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronLeftIcon, UpDownIcon, ChatIcon } from "@chakra-ui/icons";

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

const RecipeSelectionPage = ({ onOpenChat, onNext, onBack }) => {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [selectedIds, setSelectedIds] = useState([]);
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

  return (
    <Box
      minH="100vh"
      bg="#f5f2ed"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={6}
    >
      <Box
        w="min(88vw, 330px)"
        sx={{ aspectRatio: "393 / 852" }}
        bg="#fdfbf8"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        borderRadius="24px"
        border="1px solid"
        borderColor="#e8e2d9"
        boxShadow="0 20px 50px rgba(55, 45, 35, 0.08)"
        pt={6}
        pb={5}
        px={5}
        position="relative"
      >
        {/* Header Section */}
        <Box pb={4}>
          <Flex align="center" mb={4}>
            <Button
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              color="gray.500"
              size="xs"
              _hover={{ bg: "rgba(0,0,0,0.04)" }}
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
              Ingredients
            </Heading>
            <Spacer />
            <Box w="52px" />
          </Flex>

          <Flex justify="space-between" align="center">
            <Button
              leftIcon={<UpDownIcon />}
              size="xs"
              variant="outline"
              borderColor={isSorted ? "rgba(90, 122, 106, 0.5)" : "gray.200"}
              color={isSorted ? "gray.600" : "gray.500"}
              onClick={handleSort}
              _hover={{ bg: "rgba(0,0,0,0.03)" }}
            >
              {isSorted ? "Original Order" : "Sort by Expire"}
            </Button>
            <Text fontSize="xs" color="gray.400" fontWeight="500">
              {selectedIds.length} items selected
            </Text>
          </Flex>
        </Box>

        {/* Scrollable List */}
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
          {ingredients.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <HStack
                key={item.id}
                py={3}
                px={4}
                bg={isSelected ? "rgba(200, 220, 210, 0.4)" : "rgba(255,255,255,0.6)"}
                borderRadius="xl"
                border="1px solid"
                borderColor={isSelected ? "rgba(90, 122, 106, 0.3)" : "rgba(0,0,0,0.06)"}
                justify="space-between"
                onClick={() => toggleIngredient(item.id)}
                cursor="pointer"
                transition="all 0.2s ease"
                _active={{ transform: "scale(0.98)" }}
                _hover={{ bg: isSelected ? "rgba(200, 220, 210, 0.5)" : "rgba(0,0,0,0.02)" }}
              >
                <HStack spacing={4}>
                  <Text fontSize="xl">{item.emoji}</Text>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600" fontSize="sm" color="gray.600">
                      {item.name}
                    </Text>
                    <Badge
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      fontSize="10px"
                      bg={item.daysLeft <= 3 ? "rgba(180, 100, 90, 0.2)" : "rgba(90, 122, 106, 0.15)"}
                      color={item.daysLeft <= 3 ? "gray.600" : "gray.600"}
                    >
                      {item.daysLeft} days left
                    </Badge>
                  </VStack>
                </HStack>
                <Checkbox
                  colorScheme="green"
                  isChecked={isSelected}
                  pointerEvents="none"
                  sx={{ "& .chakra-checkbox__control": { borderColor: "rgba(90, 122, 106, 0.5)" } }}
                />
              </HStack>
            );
          })}
        </VStack>

        {/* Footer */}
        <Box pt={4} pb={2}>
          <Button
            w="full"
            size="md"
            h="46px"
            borderRadius="xl"
            fontSize="sm"
            fontWeight="500"
            bg="#5a7a6a"
            color="white"
            boxShadow="0 8px 24px rgba(90, 122, 106, 0.22)"
            onClick={onNext}
            isDisabled={selectedIds.length === 0}
            _hover={{ bg: "#4d6b5d" }}
            _active={{ bg: "#445d50" }}
          >
            Next
          </Button>
        </Box>

        {onOpenChat && (
          <Tooltip label="Chat" placement="left">
            <IconButton
              aria-label="Open Chat"
              icon={<ChatIcon />}
              size="sm"
              borderRadius="full"
              bg="#5a7a6a"
              color="white"
              position="absolute"
              bottom="16px"
              right="16px"
              boxShadow="0 2px 8px rgba(90, 122, 106, 0.35)"
              _hover={{ bg: "#4d6b5d" }}
              _active={{ bg: "#445d50" }}
              onClick={onOpenChat}
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default RecipeSelectionPage;
