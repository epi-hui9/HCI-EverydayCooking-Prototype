import React from "react";
import { Box, Heading, Text, Flex, Button, Spacer } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

export default function PlaceholderPage({ title }) {
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
              {title}
            </Heading>
            <Spacer />
            <Box w="52px" />
          </Flex>
        </Box>
        <Flex flex="1" align="center" justify="center">
          <Text fontSize="sm" color="gray.500">
            Coming soon
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
