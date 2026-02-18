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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Badge,
  Flex,
  extendTheme,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

// Custom theme with organic, fresh aesthetic
const theme = extendTheme({
  fonts: {
    heading: '"Fraunces", serif',
    body: '"DM Sans", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: '#FEFAF5',
        color: '#2D3319',
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
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="#FEFAF5">
        <Container maxW="container.md" py={8}>
          {/* Header */}
          <VStack spacing={2} align="stretch" mb={8}>
            <HStack justify="space-between" align="flex-start">
              <Box>
                <Heading
                  fontSize={{ base: '3xl', md: '5xl' }}
                  fontWeight="900"
                  color="#2D3319"
                  letterSpacing="-0.02em"
                  mb={1}
                >
                  Expiring Soon!
                </Heading>
                <Text fontSize="md" color="#6B7354" fontWeight="500">
                  Keep track of your food freshness
                </Text>
              </Box>
              <IconButton
                icon={<AddIcon />}
                onClick={onOpen}
                size="lg"
                colorScheme="green"
                bg="#5C7C3C"
                color="white"
                _hover={{ bg: '#4A6530', transform: 'scale(1.05)' }}
                _active={{ transform: 'scale(0.95)' }}
                transition="all 0.2s"
                aria-label="Add food"
                borderRadius="full"
                boxShadow="0 4px 12px rgba(92, 124, 60, 0.3)"
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
                  borderRadius="16px"
                  p={5}
                  border="3px solid"
                  borderColor="rgba(45, 51, 25, 0.15)"
                  boxShadow="0 2px 8px rgba(0, 0, 0, 0.08)"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
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
                          fontSize="2xl"
                          fontWeight="800"
                          color={colorScheme.text}
                          fontFamily="heading"
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

          {/* Add Food Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay bg="rgba(45, 51, 25, 0.4)" backdropFilter="blur(4px)" />
            <ModalContent
              bg="#FEFAF5"
              borderRadius="24px"
              border="3px solid"
              borderColor="rgba(92, 124, 60, 0.2)"
              boxShadow="0 12px 40px rgba(0, 0, 0, 0.15)"
            >
              <ModalHeader
                fontFamily="heading"
                fontSize="2xl"
                fontWeight="900"
                color="#2D3319"
                pt={6}
              >
                Add New Food
              </ModalHeader>
              <ModalCloseButton mt={2} />
              <ModalBody pb={6}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontWeight="600" color="#2D3319">
                      Food Name
                    </FormLabel>
                    <Input
                      placeholder="e.g., Strawberries"
                      value={newFood.name}
                      onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                      bg="white"
                      borderColor="#C8E6C9"
                      borderWidth="2px"
                      _hover={{ borderColor: '#5C7C3C' }}
                      _focus={{ borderColor: '#5C7C3C', boxShadow: '0 0 0 1px #5C7C3C' }}
                      size="lg"
                      borderRadius="12px"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="600" color="#2D3319">
                      Expiry Date
                    </FormLabel>
                    <Input
                      type="date"
                      value={newFood.expiryDate}
                      onChange={(e) =>
                        setNewFood({ ...newFood, expiryDate: e.target.value })
                      }
                      bg="white"
                      borderColor="#C8E6C9"
                      borderWidth="2px"
                      _hover={{ borderColor: '#5C7C3C' }}
                      _focus={{ borderColor: '#5C7C3C', boxShadow: '0 0 0 1px #5C7C3C' }}
                      size="lg"
                      borderRadius="12px"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="600" color="#2D3319">
                      Category
                    </FormLabel>
                    <Input
                      placeholder="e.g., Produce, Dairy, Snacks"
                      value={newFood.category}
                      onChange={(e) =>
                        setNewFood({ ...newFood, category: e.target.value })
                      }
                      bg="white"
                      borderColor="#C8E6C9"
                      borderWidth="2px"
                      _hover={{ borderColor: '#5C7C3C' }}
                      _focus={{ borderColor: '#5C7C3C', boxShadow: '0 0 0 1px #5C7C3C' }}
                      size="lg"
                      borderRadius="12px"
                    />
                  </FormControl>

                  <Button
                    onClick={handleAddFood}
                    bg="#5C7C3C"
                    color="white"
                    size="lg"
                    width="full"
                    mt={4}
                    borderRadius="12px"
                    fontWeight="700"
                    _hover={{
                      bg: '#4A6530',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(92, 124, 60, 0.4)',
                    }}
                    _active={{ transform: 'translateY(0)' }}
                    transition="all 0.2s"
                  >
                    Add to Fridge
                  </Button>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Container>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

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
