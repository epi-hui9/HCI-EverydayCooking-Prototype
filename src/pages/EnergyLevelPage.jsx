import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Flex,
  Spacer,
  Circle,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChatIcon } from "@chakra-ui/icons";
import { ENERGY_OPTIONS } from "../constants/energy";

const EnergyLevelPage = ({ onOpenChat, onBack, onContinue, selectedEnergy = "medium", onEnergyChange }) => {
  const handleContinue = () => {
    onContinue?.(selectedEnergy);
  };

  return (
    <Box minH="100vh" w="100%" display="flex" flexDirection="column" alignItems="stretch">
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
              Energy check-in
            </Heading>
            <Spacer />
            <Box w="52px" />
          </Flex>

          <VStack align="center" spacing={2} mt={2}>
            <Box
              w="40px"
              h="40px"
              borderRadius="full"
              bg="rgba(230, 218, 200, 0.6)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="md">🥘</Text>
            </Box>
            <Text fontSize="sm" fontWeight="500" color="gray.600" textAlign="center" lineHeight="1.4">
              How much energy do you have right now?
            </Text>
            <Text fontSize="xs" color="gray.400" textAlign="center">
              Your kitchen will follow your pace.
            </Text>
          </VStack>
        </Box>

        <VStack spacing={3} flex="1" pb={4} pt={2} align="stretch" justify="center">
          {ENERGY_OPTIONS.map((option, index) => {
            const isActive = option.id === selectedEnergy;
            const isLow = option.id === "low";
            const isHigh = option.id === "high";
            return (
              <Box
                key={option.id}
                onClick={() => onEnergyChange?.(option.id)}
                cursor="pointer"
                minH="52px"
                style={{ animation: `slideIn 0.4s ease-out ${0.06 + index * 0.05}s both` }}
                display="flex"
                alignItems="center"
                borderRadius="2xl"
                borderWidth={isActive ? 1 : 0}
                borderColor={isActive ? "rgba(90, 122, 106, 0.4)" : "transparent"}
                bg={isActive ? "rgba(200, 220, 210, 0.4)" : "transparent"}
                px={3}
                py={2}
                transition="background-color 0.26s cubic-bezier(0.19, 1, 0.22, 1), border-color 0.26s cubic-bezier(0.19, 1, 0.22, 1), transform 0.26s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.26s cubic-bezier(0.19, 1, 0.22, 1)"
                _hover={{
                  bg: isActive ? "rgba(200, 220, 210, 0.4)" : "rgba(0,0,0,0.03)",
                  transform: "translateY(-2px)",
                }}
                _active={{ transform: "scale(0.98)" }}
              >
                <HStack spacing={3}>
                  <Circle
                    size={option.size}
                    bg="white"
                    borderWidth={2}
                    borderColor={
                      isHigh ? "rgba(90, 122, 106, 0.7)" : isLow ? "rgba(90, 122, 106, 0.35)" : "rgba(90, 122, 106, 0.5)"
                    }
                    boxShadow={
                      isActive ? "0 12px 28px rgba(70, 100, 85, 0.18)" : "0 4px 14px rgba(40, 55, 45, 0.06)"
                    }
                    transform={isActive ? "translateY(-2px) scale(1.03)" : "scale(1)"}
                    transition="transform 0.26s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.26s cubic-bezier(0.19, 1, 0.22, 1)"
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" fontWeight={isActive ? "semibold" : "medium"} color={isActive ? "gray.700" : "gray.600"}>
                      {option.label}
                    </Text>
                    <Text fontSize="11px" color={isActive ? "gray.600" : "gray.500"}>
                      {option.description}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            );
          })}

          <Box pt={0}>
            <Text fontSize="11px" textAlign="center" color="gray.400">
              No right answer — this is just for right now.
            </Text>
          </Box>
        </VStack>

        <Box pt={4} pb={2}>
          <VStack spacing={2} align="stretch">
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
              _hover={{ bg: "var(--primary-hover)" }}
              _active={{ bg: "var(--primary-active)", transform: "scale(0.98)" }}
              onClick={handleContinue}
            >
              Continue
            </Button>
            <Button variant="ghost" size="xs" color="gray.400" _hover={{ color: "gray.600", bg: "rgba(0,0,0,0.03)" }}>
              Skip for now
            </Button>
          </VStack>
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

export default EnergyLevelPage;
