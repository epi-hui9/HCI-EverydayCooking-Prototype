import React from 'react'
import {
  Box,
  Heading,
  Container,
  SimpleGrid,
  Button,
  VStack,
  Text
} from '@chakra-ui/react'

export default function Homepage() {
  return (
    <Container maxW="container.md" py={12}>
      <VStack spacing={10} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="lg">
            Name of website
          </Heading>
          <Text mt={2} color="gray.600">
            Your Food Manager
          </Text>
        </Box>


        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Button height="120px" fontSize="xl" borderRadius="md" boxShadow="sm" bg="#547757">
            Your Food
          </Button>

          <Button height="120px" fontSize="xl" borderRadius="md" boxShadow="sm" bg="#86A76A">
            Recipes
          </Button>

          <Button height="120px" fontSize="xl" borderRadius="md" boxShadow="sm" bg="#BAD07B">
            History
          </Button>

          <Button height="120px" fontSize="xl" borderRadius="md" boxShadow="sm" bg="#BD645E">
            Weekly Plan
          </Button>
        </SimpleGrid>
      </VStack>
    </Container>
  )
}
