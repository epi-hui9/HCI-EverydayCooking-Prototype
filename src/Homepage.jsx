import React from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  SimpleGrid,
  VStack,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

/* Katie 原版配色与样式保留 */
const BUTTON_COLORS = {
  yourFood: "#547757",
  recipes: "#86A76A",
  history: "#BAD07B",
  weeklyPlan: "#BD645E",
};

export default function Homepage({ onNavigate, onOpenChat }) {
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
        <VStack spacing={8} align="stretch" flex="1" pt={8}>
          <Box textAlign="center">
            <Heading as="h1" size="lg">
              Earthplate
            </Heading>
            <Text mt={2} color="gray.600">
              Your Food Manager
            </Text>
          </Box>

          <SimpleGrid columns={2} spacing={4} flex="1" alignContent="start">
            <Button
              height="100px"
              fontSize="xl"
              borderRadius="md"
              boxShadow="sm"
              bg={BUTTON_COLORS.yourFood}
              color="white"
              _hover={{ opacity: 0.9 }}
              onClick={() => onNavigate?.("Fridge")}
            >
              Your Food
            </Button>
            <Button
              height="100px"
              fontSize="xl"
              borderRadius="md"
              boxShadow="sm"
              bg={BUTTON_COLORS.recipes}
              color="white"
              _hover={{ opacity: 0.9 }}
              onClick={() => onNavigate?.("Recipe")}
            >
              Recipes
            </Button>
            <Button
              height="100px"
              fontSize="xl"
              borderRadius="md"
              boxShadow="sm"
              bg={BUTTON_COLORS.history}
              color="white"
              _hover={{ opacity: 0.9 }}
              onClick={() => onNavigate?.("History")}
            >
              History
            </Button>
            <Button
              height="100px"
              fontSize="xl"
              borderRadius="md"
              boxShadow="sm"
              bg={BUTTON_COLORS.weeklyPlan}
              color="white"
              _hover={{ opacity: 0.9 }}
              onClick={() => onNavigate?.("WeeklyPlan")}
            >
              Weekly Plan
            </Button>
          </SimpleGrid>
        </VStack>

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
}
