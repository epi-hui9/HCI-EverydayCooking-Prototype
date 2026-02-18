import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Flex,
  Input,
  IconButton,
  Avatar,
  Text,
  VStack,
  HStack,
  useBreakpointValue,
  Spinner,
} from '@chakra-ui/react'
import { ArrowForwardIcon, ChatIcon } from '@chakra-ui/icons'
import { getAnswer } from '../utils/chatbotAnswers'

const SUGGESTED_QUESTIONS = [
  'What can I cook with chicken and carrots?',
  'How do I store kale to keep it fresh longer?',
  'What can I make with my leftover rice?',
  'What recipes use ingredients from my pantry?',
]

function ChatbotInterface() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)
  const avatarSize = useBreakpointValue({ base: 'md', md: 'sm' })
  const inputPadding = useBreakpointValue({ base: 4, md: 3 })

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

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #f1f5f9 100%)"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      justifyContent="stretch"
      p={{ base: 3, md: 6 }}
    >
      <Box
        w="full"
        maxW="4xl"
        flex="1"
        minH={{ base: '90vh', md: '85vh' }}
        alignSelf="center"
        bg="white"
        borderRadius={{ base: 'xl', md: '2xl' }}
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)"
        overflow="hidden"
        borderWidth="1px"
        borderColor="blackAlpha.100"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <Flex
          px={{ base: 4, md: 6 }}
          py={4}
          align="center"
          gap={3}
          bg="white"
          borderBottomWidth="1px"
          borderColor="blackAlpha.100"
        >
          <Flex
            w={10}
            h={10}
            borderRadius="xl"
            bg="brand.500"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <ChatIcon color="white" boxSize={5} />
          </Flex>
          <Box>
            <Text fontWeight="600" fontSize="lg" color="gray.800">
              Kitchen Assistant
            </Text>
            <Text fontSize="sm" color="gray.500">
              Ideas for what you have on hand
            </Text>
          </Box>
        </Flex>

        {/* Chat area */}
        <Box
          flex="1"
          minH="300px"
          overflowY="auto"
          p={{ base: 4, md: 6 }}
          bg="gray.50"
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
                    px={5}
                    py={4}
                    borderRadius="xl"
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    boxShadow="sm"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: 'brand.300',
                      bg: 'brand.50',
                      transform: 'translateY(-1px)',
                      boxShadow: 'md',
                    }}
                    _active={{ transform: 'translateY(0)' }}
                  >
                    <HStack justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.700" fontWeight="500">
                        {question}
                      </Text>
                      <Text color="brand.500" fontSize="lg" fontWeight="600">
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
                      bg="brand.500"
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
                      bg="brand.500"
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
                      bg="white"
                      borderWidth="1px"
                      borderColor="gray.200"
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
                    bg="brand.500"
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
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Spinner size="sm" color="brand.500" />
                  </Box>
                </Flex>
              )}
              <Box ref={chatEndRef} />
            </VStack>
          )}
        </Box>

        {/* Input bar */}
        <Flex
          p={inputPadding}
          gap={3}
          align="center"
          borderTopWidth="1px"
          borderColor="blackAlpha.100"
          bg="white"
        >
          <Avatar
            size={avatarSize}
            name="User"
            bg="brand.400"
            color="white"
            flexShrink={0}
          />
          <Input
            placeholder="What ingredients do you have? Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outline"
            borderRadius="full"
            borderColor="gray.200"
            bg="gray.50"
            _hover={{ borderColor: 'gray.300' }}
            _focus={{
              borderColor: 'brand.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
              bg: 'white',
            }}
            _placeholder={{ color: 'gray.500' }}
            size="md"
          />
          <IconButton
            aria-label="Send message"
            icon={<ArrowForwardIcon />}
            colorScheme="brand"
            borderRadius="full"
            size="md"
            minW={10}
            minH={10}
            onClick={handleSend}
          />
        </Flex>
      </Box>
    </Box>
  )
}

export default ChatbotInterface
