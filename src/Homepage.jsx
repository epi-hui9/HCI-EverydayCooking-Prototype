import React from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  Text,
  Flex,
  Spacer,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const PRIMARY_GREEN = "#5a7a6a";

export default function Homepage({ onNavigate }) {
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
      >
        {/* Header: same as Energy/Chat */}
        <Box pb={4}>
          <Flex align="center" mb={4}>
            <Button
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              color="gray.500"
              size="xs"
              _hover={{ bg: "rgba(0,0,0,0.04)" }}
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
              Home
            </Heading>
            <Spacer />
            <Box w="52px" />
          </Flex>

          <Box textAlign="center">
            <Heading as="h1" size="md" fontWeight="600" color="gray.800">
              Name of website
            </Heading>
            <Text mt={1} fontSize="sm" color="gray.600">
              Your Food Manager
            </Text>
          </Box>
        </Box>

        {/* 4 entry buttons – unified primary #5a7a6a */}
        <SimpleGrid columns={2} spacing={3} flex="1" alignContent="start" py={4}>
          <Button
            height="100px"
            fontSize="md"
            fontWeight="500"
            borderRadius="xl"
            boxShadow="0 8px 24px rgba(90, 122, 106, 0.18)"
            bg={PRIMARY_GREEN}
            color="white"
            _hover={{ bg: "#4d6b5d" }}
            _active={{ bg: "#445d50" }}
            onClick={() => onNavigate?.("Fridge")}
          >
            Your Food
          </Button>
          <Button
            height="100px"
            fontSize="md"
            fontWeight="500"
            borderRadius="xl"
            boxShadow="0 8px 24px rgba(90, 122, 106, 0.18)"
            bg={PRIMARY_GREEN}
            color="white"
            _hover={{ bg: "#4d6b5d" }}
            _active={{ bg: "#445d50" }}
            onClick={() => onNavigate?.("Recipe")}
          >
            Recipes
          </Button>
          <Button
            height="100px"
            fontSize="md"
            fontWeight="500"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="#e8e2d9"
            bg="#fdfbf8"
            color="gray.700"
            _hover={{ bg: "rgba(200, 220, 210, 0.3)", borderColor: "rgba(90, 122, 106, 0.4)" }}
            onClick={() => onNavigate?.("History")}
          >
            History
          </Button>
          <Button
            height="100px"
            fontSize="md"
            fontWeight="500"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="#e8e2d9"
            bg="#fdfbf8"
            color="gray.700"
            _hover={{ bg: "rgba(200, 220, 210, 0.3)", borderColor: "rgba(90, 122, 106, 0.4)" }}
            onClick={() => onNavigate?.("WeeklyPlan")}
          >
            Weekly Plan
          </Button>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
