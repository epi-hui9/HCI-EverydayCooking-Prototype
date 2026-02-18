import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  IconButton,
  Badge,
  Flex,
  Spacer,
  extendTheme,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ChevronLeftIcon, CloseIcon } from '@chakra-ui/icons';

// Same fonts as app theme so Fridge matches Recipe/Energy; only override body bg
const fridgeTheme = extendTheme({
  fonts: {
    heading: '"Nunito", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"Nunito", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: "#f5f2ed",
        color: "#2D3319",
      },
    },
  },
});

const FoodExpirationTracker = () => {
  const [foods, setFoods] = useState([
    { id: 1, name: 'Tomatoes', expiryDate: '2026-02-17', category: 'Produce' },
    { id: 2, name: 'Eggplant', expiryDate: '2026-02-20', category: 'Produce' },
    { id: 3, name: 'Corn', expiryDate: '2026-02-20', category: 'Produce' },
    { id: 4, name: 'Chips', expiryDate: '2026-07-01', category: 'Snacks' },
    { id: 5, name: 'Twizzlers', expiryDate: '2027-07-01', category: 'Snacks' },
  ]);

  const [newFood, setNewFood] = useState({ name: '', expiryDate: '', category: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date('2026-02-16');
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get color based on expiry status
  const getExpiryColor = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return { bg: '#8B7E74', text: '#FFF', label: 'Expired' };
    if (days <= 1) return { bg: '#E8958E', text: '#5C1F1B', label: 'Expiring Today!' };
    if (days <= 4) return { bg: '#F4C6A3', text: '#6B3E1F', label: 'Expiring Soon' };
    if (days <= 14) return { bg: '#E8D99F', text: '#5C5220', label: 'Use This Week' };
    if (days <= 90) return { bg: '#C8E6C9', text: '#2D5016', label: 'Fresh' };
    return { bg: '#B3E5B7', text: '#1B4D1F', label: 'Very Fresh' };
  };

  const handleAddFood = () => {
    if (newFood.name && newFood.expiryDate) {
      setFoods([
        ...foods,
        {
          id: Date.now(),
          name: newFood.name,
          expiryDate: newFood.expiryDate,
          category: newFood.category || 'Other',
        },
      ]);
      setNewFood({ name: '', expiryDate: '', category: '' });
      onClose();
    }
  };

  const handleDeleteFood = (id) => {
    setFoods(foods.filter((food) => food.id !== id));
  };

  // Sort foods by expiry date
  const sortedFoods = [...foods].sort((a, b) => {
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });

  return (
    <ChakraProvider theme={fridgeTheme}>
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
          borderRadius="24px"
          border="1px solid"
          borderColor="#e8e2d9"
          boxShadow="0 20px 50px rgba(55, 45, 35, 0.08)"
          overflow="hidden"
          pt={6}
          pb={5}
          px={5}
          position="relative"
        >
          {/* In-card overlay: Add New Food (stays inside phone frame) */}
          {isOpen && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="#fdfbf8"
              zIndex={10}
              overflowY="auto"
              px={5}
              pt={6}
              pb={6}
            >
              <Flex align="center" mb={4}>
                <Button
                  leftIcon={<ChevronLeftIcon />}
                  variant="ghost"
                  color="gray.500"
                  size="xs"
                  _hover={{ bg: "rgba(0,0,0,0.04)" }}
                  onClick={onClose}
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
                  Add food
                </Heading>
                <Spacer />
                <Box w="52px" display="flex" justifyContent="flex-end">
                  <IconButton
                    aria-label="Close"
                    icon={<CloseIcon />}
                    variant="ghost"
                    size="xs"
                    color="gray.500"
                    _hover={{ bg: "rgba(0,0,0,0.04)" }}
                    onClick={onClose}
                  />
                </Box>
              </Flex>
              <VStack spacing={4} align="stretch" mt={2}>
                <FormControl isRequired>
                  <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                    Food Name
                  </FormLabel>
                  <Input
                    placeholder="e.g., Strawberries"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    bg="white"
                    borderColor="rgba(0,0,0,0.1)"
                    borderWidth="1px"
                    _focus={{ borderColor: "rgba(90, 122, 106, 0.6)", boxShadow: "0 0 0 1px rgba(90, 122, 106, 0.3)" }}
                    size="md"
                    borderRadius="xl"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                    Expiry Date
                  </FormLabel>
                  <Input
                    type="date"
                    value={newFood.expiryDate}
                    onChange={(e) =>
                      setNewFood({ ...newFood, expiryDate: e.target.value })
                    }
                    bg="white"
                    borderColor="rgba(0,0,0,0.1)"
                    borderWidth="1px"
                    _focus={{ borderColor: "rgba(90, 122, 106, 0.6)", boxShadow: "0 0 0 1px rgba(90, 122, 106, 0.3)" }}
                    size="md"
                    borderRadius="xl"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                    Category
                  </FormLabel>
                  <Input
                    placeholder="e.g., Produce, Dairy, Snacks"
                    value={newFood.category}
                    onChange={(e) =>
                      setNewFood({ ...newFood, category: e.target.value })
                    }
                    bg="white"
                    borderColor="rgba(0,0,0,0.1)"
                    borderWidth="1px"
                    _focus={{ borderColor: "rgba(90, 122, 106, 0.6)", boxShadow: "0 0 0 1px rgba(90, 122, 106, 0.3)" }}
                    size="md"
                    borderRadius="xl"
                  />
                </FormControl>
                <Button
                  onClick={handleAddFood}
                  bg="#5a7a6a"
                  color="white"
                  size="md"
                  width="full"
                  mt={2}
                  h="46px"
                  borderRadius="xl"
                  fontWeight="500"
                  _hover={{ bg: "#4d6b5d" }}
                  _active={{ bg: "#445d50" }}
                >
                  Add to Fridge
                </Button>
              </VStack>
            </Box>
          )}

          <Container maxW="full" h="100%" py={0} px={0} overflowY="auto">
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
              Fridge
            </Heading>
            <Spacer />
            <Box w="52px" />
          </Flex>

          {/* Header */}
          <VStack spacing={2} align="stretch" mb={5}>
            <HStack justify="space-between" align="flex-start">
              <Box>
                <Heading
                  fontSize="lg"
                  fontWeight="700"
                  color="gray.700"
                  letterSpacing="-0.01em"
                  mb={1}
                >
                  Expiring Soon
                </Heading>
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  Keep track of your food freshness
                </Text>
              </Box>
              <IconButton
                icon={<AddIcon />}
                onClick={onOpen}
                size="md"
                bg="#5a7a6a"
                color="white"
                _hover={{ bg: "#4d6b5d", transform: "scale(1.04)" }}
                _active={{ transform: "scale(0.98)" }}
                transition="all 0.2s"
                aria-label="Add food"
                borderRadius="full"
                boxShadow="0 8px 24px rgba(90, 122, 106, 0.22)"
              />
            </HStack>
          </VStack>

          {/* Food List */}
          <VStack spacing={3} align="stretch">
            {sortedFoods.map((food, index) => {
              const colorScheme = getExpiryColor(food.expiryDate);
              const daysLeft = getDaysUntilExpiry(food.expiryDate);

              return (
                <Box
                  key={food.id}
                  bg={colorScheme.bg}
                  borderRadius="xl"
                  p={4}
                  border="1px solid"
                  borderColor="rgba(0,0,0,0.06)"
                  boxShadow="0 2px 10px rgba(50, 45, 35, 0.06)"
                  transition="all 0.2s ease"
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 14px rgba(50, 45, 35, 0.08)",
                  }}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animation: 'slideIn 0.4s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <Box flex="1">
                      <HStack spacing={3} mb={2}>
                        <Text
                          fontSize="xl"
                          fontWeight="700"
                          color={colorScheme.text}
                        >
                          {food.name}
                        </Text>
                        <Badge
                          colorScheme="whiteAlpha"
                          bg="rgba(255, 255, 255, 0.4)"
                          color={colorScheme.text}
                          px={2}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="700"
                        >
                          {food.category}
                        </Badge>
                      </HStack>
                      <HStack spacing={4}>
                        <Text
                          fontSize="md"
                          color={colorScheme.text}
                          fontWeight="600"
                          opacity={0.9}
                        >
                          {new Date(food.expiryDate).toLocaleDateString('en-US', {
                            month: 'numeric',
                            day: 'numeric',
                            year: '2-digit',
                          })}
                        </Text>
                        <Badge
                          bg="rgba(0, 0, 0, 0.15)"
                          color={colorScheme.text}
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="700"
                        >
                          {daysLeft < 0
                            ? `Expired ${Math.abs(daysLeft)} days ago`
                            : daysLeft === 0
                            ? 'Expires today'
                            : daysLeft === 1
                            ? 'Expires tomorrow'
                            : `${daysLeft} days left`}
                        </Badge>
                      </HStack>
                    </Box>
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => handleDeleteFood(food.id)}
                      size="sm"
                      variant="ghost"
                      color={colorScheme.text}
                      _hover={{
                        bg: 'rgba(0, 0, 0, 0.1)',
                        transform: 'scale(1.1)',
                      }}
                      aria-label="Delete food"
                    />
                  </Flex>
                </Box>
              );
            })}
          </VStack>

          </Container>
        </Box>

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </Box>
    </ChakraProvider>
  );
};

export default FoodExpirationTracker;
