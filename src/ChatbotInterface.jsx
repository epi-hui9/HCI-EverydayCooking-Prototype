import { useState, useRef, useEffect } from 'react'
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
} from '@chakra-ui/react'
import { ArrowForwardIcon, ChatIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import { getAnswer } from './utils/chatbotAnswers'

const SUGGESTED_QUESTIONS = [
  'What can I cook with chicken and carrots?',
  'How do I store kale to keep it fresh longer?',
  'What can I make with my leftover rice?',
  'What recipes use ingredients from my pantry?',
]

function ChatbotInterface({ onBack }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (text) => {
    if (!text?.trim()) return
    const userMessage = { id: Date.now(), text: text.trim(), type: 'user' }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const answer = await getAnswer(userMessage.text)
      const botMessage = {
        id: Date.now() + 1,
        text: answer,
        type: 'bot',
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: err.message || "Sorry, I couldn't get an answer right now. Make sure the server is running and OPENAI_API_KEY is set in server/.env",
          type: 'bot',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = () => sendMessage(inputValue)

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (question) => {
    sendMessage(question)
  }

  const renderMessageContent = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g)
      return (
        <Text key={i} display="block" mt={i > 0 ? 2 : 0} fontSize="sm" color="gray.700">
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <Text as="span" key={j} fontWeight={600}>
                {part.slice(2, -2)}
              </Text>
            ) : (
              part
            )
          )}
        </Text>
      )
    })
  }

  const primaryGreen = '#5a7a6a'

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
        sx={{ aspectRatio: '393 / 852' }}
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
        {/* Header: Back + centered title (same as Energy) */}
        <Box pb={4}>
          <Flex align="center" mb={2}>
            <Button
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              color="gray.500"
              size="xs"
              _hover={{ bg: 'rgba(0,0,0,0.04)' }}
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
              Chat
            </Heading>
            <Spacer />
            <Box w="52px" />
          </Flex>
        </Box>

        {/* Chat area */}
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
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { bg: 'transparent' },
            '&::-webkit-scrollbar-thumb': { bg: 'gray.300', borderRadius: '3px' },
          }}
        >
          {messages.length === 0 ? (
            <VStack spacing={6} py={8} align="stretch">
              <Text
                fontSize="lg"
                color="gray.600"
                textAlign="center"
                fontWeight="500"
              >
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
                    px={4}
                    py={3}
                    borderRadius="xl"
                    bg="#fdfbf8"
                    borderWidth="1px"
                    borderColor="#e8e2d9"
                    boxShadow="sm"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: 'rgba(90, 122, 106, 0.4)',
                      bg: 'rgba(200, 220, 210, 0.3)',
                      transform: 'translateY(-1px)',
                      boxShadow: 'md',
                    }}
                    _active={{ transform: 'translateY(0)' }}
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
                msg.type === 'user' ? (
                  <Flex key={msg.id} justify="flex-end">
                    <Box
                      maxW="85%"
                      px={4}
                      py={3}
                      borderRadius="xl"
                      borderTopRightRadius="md"
                      bg={primaryGreen}
                      color="white"
                      boxShadow="sm"
                    >
                      <Text fontSize="sm" fontWeight="500">
                        {msg.text}
                      </Text>
                    </Box>
                  </Flex>
                ) : (
                  <Flex key={msg.id} justify="flex-start" align="flex-start" gap={3}>
                    <Flex
                      w={8}
                      h={8}
                      borderRadius="lg"
                      bg={primaryGreen}
                      align="center"
                      justify="center"
                      flexShrink={0}
                      mt={1}
                    >
                      <ChatIcon color="white" boxSize={4} />
                    </Flex>
                    <Box
                      maxW="85%"
                      px={4}
                      py={3}
                      borderRadius="xl"
                      borderTopLeftRadius="md"
                      bg="#fdfbf8"
                      borderWidth="1px"
                      borderColor="#e8e2d9"
                      boxShadow="sm"
                    >
                      <Box fontSize="sm" color="gray.700">
                        {renderMessageContent(msg.text)}
                      </Box>
                    </Box>
                  </Flex>
                )
              )}
              {isLoading && (
                <Flex justify="flex-start" align="center" gap={3}>
                  <Flex
                    w={8}
                    h={8}
                    borderRadius="lg"
                    bg={primaryGreen}
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <ChatIcon color="white" boxSize={4} />
                  </Flex>
                  <Box
                    px={4}
                    py={3}
                    borderRadius="xl"
                    borderTopLeftRadius="md"
                    bg="#fdfbf8"
                    borderWidth="1px"
                    borderColor="#e8e2d9"
                  >
                    <Spinner size="sm" color={primaryGreen} />
                  </Box>
                </Flex>
              )}
              <Box ref={chatEndRef} />
            </VStack>
          )}
        </Box>

        {/* Input bar */}
        <Flex
          pt={3}
          gap={2}
          align="center"
          flexShrink={0}
        >
          <Input
            placeholder="What ingredients do you have? Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outline"
            borderRadius="full"
            borderColor="#e8e2d9"
            bg="#fdfbf8"
            _hover={{ borderColor: 'gray.300' }}
            _focus={{
              borderColor: primaryGreen,
              boxShadow: `0 0 0 1px ${primaryGreen}`,
              bg: '#fdfbf8',
            }}
            _placeholder={{ color: 'gray.500' }}
            size="sm"
          />
          <IconButton
            aria-label="Send message"
            icon={<ArrowForwardIcon />}
            bg={primaryGreen}
            color="white"
            borderRadius="full"
            size="sm"
            minW={9}
            minH={9}
            _hover={{ bg: '#4d6b5d' }}
            _active={{ bg: '#445d50' }}
            onClick={handleSend}
          />
        </Flex>
      </Box>
    </Box>
  )
}

export default ChatbotInterface
