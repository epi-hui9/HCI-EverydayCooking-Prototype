import React, { useState } from "react";
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
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronLeftIcon, UpDownIcon, ChatIcon } from "@chakra-ui/icons";
import { INITIAL_INGREDIENTS } from "../data/ingredients";

const RecipeSelectionPage = ({ onOpenChat, onNext, onBack }) => {
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSorted, setIsSorted] = useState(false);

  const toggleIngredient = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSort = () => {
    const newSortedState = !isSorted;
    setIsSorted(newSortedState);
    const sortedList = [...ingredients].sort((a, b) =>
      newSortedState ? a.daysLeft - b.daysLeft : a.id - b.id,
    );
    setIngredients(sortedList);
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
            <Heading fontSize="11px" fontWeight="500" letterSpacing="0.06em" textTransform="uppercase" color="gray.500">
              Ingredients
            </Heading>
            <Spacer />
            <Box w="52px" />
          </Flex>

          <Flex justify="space-between" align="center">
            <Button
              leftIcon={<UpDownIcon />}
              size="sm"
              minH="40px"
              variant="outline"
              borderColor={isSorted ? "rgba(90, 122, 106, 0.5)" : "gray.200"}
              color={isSorted ? "gray.600" : "gray.500"}
              onClick={handleSort}
              _hover={{ bg: "rgba(0,0,0,0.03)" }}
              _active={{ bg: "rgba(0,0,0,0.05)" }}
            >
              {isSorted ? "Original Order" : "Sort by Expire"}
            </Button>
            <Text fontSize="xs" color="gray.400" fontWeight="500">
              {selectedIds.length} items selected
            </Text>
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
          {ingredients.map((item, index) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <HStack
                key={item.id}
                minH="52px"
                style={{ animation: `slideIn 0.4s ease-out ${index * 0.04}s both` }}
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
                      color="gray.600"
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

        <Box pt={4} pb={2}>
          <Button
            w="full"
            size="md"
            minH="48px"
            h="48px"
            borderRadius="xl"
            fontSize="sm"
            fontWeight="600"
            bg="#5a7a6a"
            color="white"
            boxShadow="0 8px 24px rgba(90, 122, 106, 0.22)"
            onClick={() => {
              const selectedNames = ingredients
                .filter((i) => selectedIds.includes(i.id))
                .map((i) => i.name);
              onNext?.(selectedNames);
            }}
            isDisabled={selectedIds.length === 0}
            _hover={{ bg: "#4d6b5d" }}
            _active={{ bg: "#445d50", transform: "scale(0.98)" }}
            _disabled={{ bg: "gray.300", color: "gray.700", opacity: 1 }}
            transition="transform 0.2s ease"
          >
            Next
          </Button>
        </Box>

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

export default RecipeSelectionPage;
