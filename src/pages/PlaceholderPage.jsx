import React from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Spacer,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChatIcon } from "@chakra-ui/icons";

export default function PlaceholderPage({ title, onOpenChat }) {
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
        minH="100vh"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        position="relative"
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
              {title}
            </Heading>
            <Spacer />
            <Box w="52px" />
          </Flex>
        </Box>
        <Flex flex="1" align="center" justify="center" style={{ animation: "slideIn 0.4s ease-out 0.08s both" }}>
          <Text fontSize="sm" color="gray.500">
            Coming soon
          </Text>
        </Flex>

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
}
