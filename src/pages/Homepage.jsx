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
import { HOMEPAGE_BUTTON_COLORS } from "../constants/theme";

export default function Homepage({ onNavigate, onOpenChat }) {
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
      >
        <VStack spacing={0} align="stretch" flex="1" pt={8} style={{ animation: "slideIn 0.4s ease-out forwards" }}>
          <Box textAlign="center" flexShrink={0} style={{ animation: "slideIn 0.4s ease-out 0.05s both" }}>
            <Heading as="h1" size="lg" letterSpacing="-0.02em">
              Earthplate
            </Heading>
            <Text mt={2} color="gray.600" fontSize="sm">
              Your Food Manager
            </Text>
          </Box>

          <Box flex="1" display="flex" alignItems="center" justifyContent="center" w="100%" py={6}>
            <SimpleGrid columns={2} spacing={4} w="100%">
              {[
                { label: "Your Food", color: HOMEPAGE_BUTTON_COLORS.yourFood, nav: "Fridge" },
                { label: "Recipes", color: HOMEPAGE_BUTTON_COLORS.recipes, nav: "Recipe" },
                { label: "History", color: HOMEPAGE_BUTTON_COLORS.history, nav: "History" },
                { label: "Weekly Plan", color: HOMEPAGE_BUTTON_COLORS.weeklyPlan, nav: "WeeklyPlan" },
              ].map((item, index) => (
                <Button
                  key={item.label}
                  height="100px"
                  minH="100px"
                  fontSize="lg"
                  fontWeight="600"
                  borderRadius="xl"
                  boxShadow="sm"
                  bg={item.color}
                  color="white"
                  _hover={{ opacity: 0.92, transform: "translateY(-1px)" }}
                  _active={{ transform: "scale(0.98)", opacity: 1 }}
                  transition="transform 0.2s ease, opacity 0.2s"
                  onClick={() => onNavigate?.(item.nav)}
                  style={{ animation: `slideIn 0.4s ease-out ${0.1 + index * 0.05}s both` }}
                >
                  {item.label}
                </Button>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>

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
              bottom="calc(4px + var(--safe-bottom))"
              right="16px"
              boxShadow="0 4px 16px rgba(90, 122, 106, 0.4)"
              _hover={{ bg: "#4d6b5d", transform: "scale(1.05)" }}
              _active={{ bg: "#445d50", transform: "scale(0.95)" }}
              transition="transform 0.2s ease"
              onClick={onOpenChat}
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
