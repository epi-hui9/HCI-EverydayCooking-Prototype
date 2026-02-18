import React, { useState } from "react";
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

const energyOptions = [
  {
    id: "low",
    label: "Low",
    description: "Reheat or assemble.",
    size: "50px",
  },
  {
    id: "medium",
    label: "Medium",
    description: "Simple, one-pan.",
    size: "68px",
  },
  {
    id: "high",
    label: "High",
    description: "Up for cooking.",
    size: "84px",
  },
];

const EnergyLevelPage = ({ onOpenChat, onBack }) => {
  const [selectedEnergy, setSelectedEnergy] = useState("medium");

  const handleContinue = () => {
    // Prototype phase: placeholder behavior before wiring the next page
    const current = energyOptions.find((e) => e.id === selectedEnergy);
    alert(`Energy level set to: ${current?.label ?? "Unknown"}`);
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
        {/* Header */}
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
            <Text
              fontSize="sm"
              fontWeight="500"
              color="gray.600"
              textAlign="center"
              lineHeight="1.4"
            >
              How much energy do you have right now?
            </Text>
            <Text fontSize="xs" color="gray.400" textAlign="center">
              Your kitchen will follow your pace.
            </Text>
          </VStack>
        </Box>

        {/* Content: Bubbles */}
        <VStack
          spacing={3}
          flex="1"
          pb={4}
          pt={2}
          align="stretch"
          justify="center"
        >
          {energyOptions.map((option) => {
            const isActive = option.id === selectedEnergy;
            const isLow = option.id === "low";
            const isHigh = option.id === "high";
            return (
              <Box
                key={option.id}
                onClick={() => setSelectedEnergy(option.id)}
                cursor="pointer"
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
              >
                <HStack spacing={3}>
                  <Circle
                    size={option.size}
                    bg="white"
                    borderWidth={2}
                    borderColor={
                      isHigh
                        ? "rgba(90, 122, 106, 0.7)"
                        : isLow
                          ? "rgba(90, 122, 106, 0.35)"
                          : "rgba(90, 122, 106, 0.5)"
                    }
                    boxShadow={
                      isActive
                        ? "0 12px 28px rgba(70, 100, 85, 0.18)"
                        : "0 4px 14px rgba(40, 55, 45, 0.06)"
                    }
                    transform={
                      isActive ? "translateY(-2px) scale(1.03)" : "scale(1)"
                    }
                    transition="transform 0.26s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.26s cubic-bezier(0.19, 1, 0.22, 1)"
                  />
                  <VStack align="start" spacing={0}>
                    <Text
                      fontSize="xs"
                      fontWeight={isActive ? "semibold" : "medium"}
                      color={isActive ? "gray.700" : "gray.600"}
                    >
                      {option.label}
                    </Text>
                    <Text
                      fontSize="11px"
                      color={isActive ? "gray.600" : "gray.500"}
                    >
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

        {/* Footer */}
        <Box pt={4} pb={2}>
          <VStack spacing={2} align="stretch">
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
              _hover={{ bg: "#4d6b5d" }}
              _active={{ bg: "#445d50" }}
              onClick={handleContinue}
            >
              Continue
            </Button>
            <Button
              variant="ghost"
              size="xs"
              color="gray.400"
              _hover={{ color: "gray.600", bg: "rgba(0,0,0,0.03)" }}
            >
              Skip for now
            </Button>
          </VStack>
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

export default EnergyLevelPage;

