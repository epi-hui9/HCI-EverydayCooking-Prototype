import { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Input,
  IconButton,
  Text,
  VStack,
  HStack,
  Spinner,
  Button,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import { ArrowForwardIcon, ChatIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { getAnswer } from "../utils/chatbotAnswers";
import { RECIPE_INSTRUCTIONS } from "../data/recipeInstructions";
import { SUGGESTED_QUESTIONS } from "../data/chatSuggestions";

function ChatbotInterface({ onBack, instructionRecipe }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (instructionRecipe?.name && RECIPE_INSTRUCTIONS[instructionRecipe.name]) {
      const text = RECIPE_INSTRUCTIONS[instructionRecipe.name];
      setMessages([{ id: "recipe-instructions", text, type: "bot" }]);
    } else if (instructionRecipe === null || instructionRecipe === undefined) {
      setMessages([]);
    }
  }, [instructionRecipe?.name, instructionRecipe]);

  const sendMessage = async (text) => {
    if (!text?.trim()) return;
    const userMessage = { id: Date.now(), text: text.trim(), type: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    try {
      const answer = await getAnswer(userMessage.text);
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: answer, type: "bot" }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: err.message || "Sorry, I couldn't get an answer right now. Make sure the server is running and OPENAI_API_KEY is set in server/.env",
          type: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(inputValue);
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handleSuggestionClick = (question) => sendMessage(question);

  const renderMessageContent = (text) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <Text key={i} display="block" mt={i > 0 ? 2 : 0} fontSize="sm" color="gray.700">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <Text as="span" key={j} fontWeight={600}>
                {part.slice(2, -2)}
              </Text>
            ) : (
              part
            )
          )}
        </Text>
      );
    });
  };

  const primaryGreen = "#5a7a6a";

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
      >
        <Box pb={4} style={{ animation: "slideIn 0.4s ease-out forwards" }}>
          <Flex align="center" mb={2}>
            <Button leftIcon={<ChevronLeftIcon />} variant="ghost" color="gray.500" size="sm" minH="44px" px={3} _hover={{ bg: "rgba(0,0,0,0.04)" }} _active={{ bg: "rgba(0,0,0,0.06)" }} onClick={onBack}>
              Back
            </Button>
            <Spacer />
            <Heading fontSize="11px" fontWeight="500" letterSpacing="0.06em" textTransform="uppercase" color="gray.500">
              Chat
            </Heading>
            <Spacer />
            <Box w="52px" />
          </Flex>
        </Box>

        <Box
          flex="1"
          minH="200px"
          overflowY="auto"
          p={3}
          bg="rgba(248, 246, 242, 0.6)"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="rgba(232, 226, 217, 0.8)"
          css={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { bg: "transparent" },
            "&::-webkit-scrollbar-thumb": { bg: "gray.300", borderRadius: "3px" },
          }}
        >
          {messages.length === 0 ? (
            <VStack spacing={6} py={8} align="stretch">
              <Text fontSize="lg" color="gray.600" textAlign="center" fontWeight="500">
                Let&apos;s make the most of what you have
              </Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                I&apos;ll help you use up ingredients—try a suggestion or ask your own
              </Text>
              <VStack spacing={3} align="stretch" maxW="md" mx="auto">
                {SUGGESTED_QUESTIONS.map((question, i) => (
                  <Box
                    key={i}
                    as="button"
                    onClick={() => handleSuggestionClick(question)}
                    textAlign="left"
                    minH="48px"
                    px={4}
                    py={3}
                    borderRadius="xl"
                    bg="var(--card-bg)"
                    borderWidth="1px"
                    borderColor="var(--card-border)"
                    boxShadow="sm"
                    transition="all 0.2s"
                    _hover={{ borderColor: "rgba(90, 122, 106, 0.4)", bg: "rgba(200, 220, 210, 0.3)", transform: "translateY(-1px)", boxShadow: "md" }}
                    _active={{ transform: "scale(0.98)" }}
                  >
                    <HStack justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.700" fontWeight="500">
                        {question}
                      </Text>
                      <Text color={primaryGreen} fontSize="lg" fontWeight="600">
                        ›
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </VStack>
          ) : (
            <VStack align="stretch" spacing={4}>
              {messages.map((msg) =>
                msg.type === "user" ? (
                  <Flex key={msg.id} justify="flex-end">
                    <Box maxW="85%" px={4} py={3} borderRadius="xl" borderTopRightRadius="md" bg={primaryGreen} color="white" boxShadow="sm">
                      <Text fontSize="sm" fontWeight="500">{msg.text}</Text>
                    </Box>
                  </Flex>
                ) : (
                  <Flex key={msg.id} justify="flex-start" align="flex-start" gap={3}>
                    <Flex w={8} h={8} borderRadius="lg" bg={primaryGreen} align="center" justify="center" flexShrink={0} mt={1}>
                      <ChatIcon color="white" boxSize={4} />
                    </Flex>
                    <Box maxW="85%" px={4} py={3} borderRadius="xl" borderTopLeftRadius="md" bg="#fdfbf8" borderWidth="1px" borderColor="#e8e2d9" boxShadow="sm">
                      <Box fontSize="sm" color="gray.700">{renderMessageContent(msg.text)}</Box>
                    </Box>
                  </Flex>
                )
              )}
              {isLoading && (
                <Flex justify="flex-start" align="center" gap={3}>
                  <Flex w={8} h={8} borderRadius="lg" bg={primaryGreen} align="center" justify="center" flexShrink={0}>
                    <ChatIcon color="white" boxSize={4} />
                  </Flex>
                  <Box px={4} py={3} borderRadius="xl" borderTopLeftRadius="md" bg="#fdfbf8" borderWidth="1px" borderColor="#e8e2d9">
                    <Spinner size="sm" color={primaryGreen} />
                  </Box>
                </Flex>
              )}
              <Box ref={chatEndRef} />
            </VStack>
          )}
        </Box>

        <Flex pt={3} gap={2} align="center" flexShrink={0} pb="env(safe-area-inset-bottom, 0)">
          <Input
            placeholder={instructionRecipe?.name ? "Ask a follow-up about this recipe..." : "What ingredients do you have? Ask me anything..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outline"
            borderRadius="full"
            borderColor="var(--card-border)"
            bg="var(--card-bg)"
            minH="44px"
            _hover={{ borderColor: "gray.300" }}
            _focus={{ borderColor: primaryGreen, boxShadow: `0 0 0 1px ${primaryGreen}`, bg: "var(--card-bg)" }}
            _placeholder={{ color: "gray.500" }}
            size="md"
          />
          <IconButton aria-label="Send message" icon={<ArrowForwardIcon />} bg={primaryGreen} color="white" borderRadius="full" size="md" minW="44px" minH="44px" _hover={{ bg: "#4d6b5d", transform: "scale(1.05)" }} _active={{ bg: "#445d50", transform: "scale(0.95)" }} onClick={handleSend} />
        </Flex>
      </Box>
    </Box>
  );
}

export default ChatbotInterface;
