import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Flex,
  Spacer,
  Circle,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const energyOptions = [
  {
    id: "low",
    label: "Low",
    description: "Reheat or assemble.",
    size: "64px",
  },
  {
    id: "medium",
    label: "Medium",
    description: "Simple, one-pan.",
    size: "88px",
  },
  {
    id: "high",
    label: "High",
    description: "Up for cooking.",
    size: "112px",
  },
];

const EnergyLevelPage = () => {
  const [selectedEnergy, setSelectedEnergy] = useState("medium");

  const handleContinue = () => {
    // 课堂原型阶段：先用 alert 占位，后续可接到下一个页面
    const current = energyOptions.find((e) => e.id === selectedEnergy);
    alert(`Energy level set to: ${current?.label ?? "Unknown"}`);
  };

  return (
    <Container
      maxW="full"
      p={0}
      minH="100vh"
      bg="#f8f5f0"
      centerContent
      py={10}
    >
      <Box
        w="100%"
        maxW="430px"
        minH="720px"
        bg="#fdfaf6"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        borderRadius="2xl"
        border="1px solid"
        borderColor="#efe3d4"
        boxShadow="0 24px 60px rgba(70, 50, 30, 0.12)"
      >
        {/* Header */}
        <Box pt={8} pb={2} px={6}>
          <Flex align="center" mb={2}>
            <Button
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              color="gray.500"
              size="sm"
            >
              Back
            </Button>
            <Spacer />
            <Heading
              size="sm"
              fontWeight="500"
              letterSpacing="0.08em"
              textTransform="uppercase"
              color="gray.500"
            >
              Energy check-in
            </Heading>
            <Spacer />
            <Box w="60px" />
          </Flex>

          <VStack align="center" spacing={2} mt={6}>
            <Box
              w="46px"
              h="46px"
              borderRadius="full"
              bg="#f3e3cc"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={1}
            >
              <Text fontSize="lg">🥘</Text>
            </Box>
            <Text
              fontSize="lg"
              fontWeight="500"
              color="gray.700"
              textAlign="center"
            >
              How much energy do you have right now?
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Your kitchen will follow your pace.
            </Text>
          </VStack>
        </Box>

        {/* Content: Bubbles */}
        <VStack
          spacing={4}
          flex="1"
          px={6}
          pb={6}
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
                borderColor={isActive ? "green.400" : "transparent"}
                bg={isActive ? "green.50" : "transparent"}
                px={4}
                py={3}
                transition="background-color 0.26s cubic-bezier(0.19, 1, 0.22, 1), border-color 0.26s cubic-bezier(0.19, 1, 0.22, 1), transform 0.26s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.26s cubic-bezier(0.19, 1, 0.22, 1)"
                _hover={{
                  bg: isActive ? "green.50" : "gray.50",
                  transform: "translateY(-2px)",
                }}
              >
                <HStack spacing={4}>
                  <Circle
                    size={option.size}
                    bg="white"
                    borderWidth={2}
                    borderColor={
                      isHigh
                        ? "green.500"
                        : isLow
                          ? "green.200"
                          : "green.400"
                    }
                    boxShadow={
                      isActive
                        ? "0 14px 32px rgba(72, 187, 120, 0.26)"
                        : "0 6px 18px rgba(15, 30, 20, 0.06)"
                    }
                    transform={
                      isActive ? "translateY(-2px) scale(1.03)" : "scale(1)"
                    }
                    transition="transform 0.26s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.26s cubic-bezier(0.19, 1, 0.22, 1)"
                  />
                  <VStack align="start" spacing={0}>
                    <Text
                      fontSize="sm"
                      fontWeight={isActive ? "semibold" : "medium"}
                      color={isActive ? "green.700" : "gray.800"}
                    >
                      {option.label}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={isActive ? "gray.600" : "gray.500"}
                    >
                      {option.description}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            );
          })}

          <Box pt={1}>
            <Text fontSize="xs" textAlign="center" color="gray.400">
              No right answer — this is just for right now.
            </Text>
          </Box>
        </VStack>

        {/* Footer */}
        <Box
          p={8}
          pt={6}
          pb={12}
          bg="white"
          borderTop="1px solid"
          borderColor="gray.50"
        >
          <VStack spacing={3}>
            <Button
              w="full"
              size="lg"
              h="56px"
              borderRadius="2xl"
              fontSize="md"
              fontWeight="semibold"
              bg="#4f7b63"
              color="white"
              boxShadow="0 10px 26px rgba(29, 54, 40, 0.30)"
              _hover={{ bg: "#446755" }}
              _active={{ bg: "#3a5747" }}
              onClick={handleContinue}
            >
              Continue
            </Button>
            <Button
              variant="ghost"
              size="sm"
              color="gray.500"
              _hover={{ color: "gray.700", bg: "gray.50" }}
            >
              Skip for now
            </Button>
          </VStack>
        </Box>
      </Box>
    </Container>
  );
};

export default EnergyLevelPage;

