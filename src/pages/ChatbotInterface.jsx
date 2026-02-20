/**
 * Chat tab: recipe Q&A and general cooking help. Content fits inside app frame.
 */
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import Send from "@mui/icons-material/Send";
import Chat from "@mui/icons-material/Chat";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { getAnswer } from "../utils/chatbotAnswers";
import { RECIPE_INSTRUCTIONS } from "../data/recipeInstructions";
import { SUGGESTED_QUESTIONS } from "../data/chatSuggestions";
import { PALETTE } from "../theme";

export default function ChatbotInterface({ onBack, instructionRecipe }) {
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
      setMessages([{ id: "recipe-instructions", text: RECIPE_INSTRUCTIONS[instructionRecipe.name], type: "bot" }]);
    } else if (instructionRecipe == null) {
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
          text: err.message || "Sorry, I couldn't get an answer right now.",
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

  const renderMessageContent = (text) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <Typography key={i} component="span" display="block" sx={{ mt: i > 0 ? 1 : 0, fontSize: "0.875rem", color: "text.secondary" }}>
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <Typography component="span" key={j} fontWeight={600}>
                {part.slice(2, -2)}
              </Typography>
            ) : (
              part
            )
          )}
        </Typography>
      );
    });
  };

  return (
    <Box sx={{ minHeight: "100%", display: "flex", flexDirection: "column", px: 2.5, pt: 3, pb: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Button
          startIcon={<ChevronLeft />}
          onClick={onBack}
          sx={{ color: "text.secondary", minHeight: 44, "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}
        >
          Back
        </Button>
        <Typography variant="overline" sx={{ letterSpacing: 0.6, color: "text.secondary" }}>
          Chat
        </Typography>
        <Box sx={{ width: 52 }} />
      </Stack>

      <Box
        sx={{
          flex: 1,
          minHeight: 280,
          overflowY: "auto",
          p: 1.5,
          bgcolor: PALETTE.sageLight,
          borderRadius: 2,
          border: "1px solid",
          borderColor: PALETTE.sage,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "action.hover", borderRadius: 1 },
        }}
      >
        {messages.length === 0 ? (
          <Stack spacing={2} sx={{ py: 4 }}>
            <Typography variant="body1" color="text.secondary" textAlign="center" fontWeight={500}>
              Let&apos;s make the most of what you have
            </Typography>
            <Typography variant="body2" color="text.disabled" textAlign="center">
              I&apos;ll help you use up ingredients—try a suggestion or ask your own
            </Typography>
            <Stack spacing={1} sx={{ maxWidth: 360, mx: "auto" }}>
              {SUGGESTED_QUESTIONS.map((question, i) => (
                <Button
                  key={i}
                  fullWidth
                  variant="outlined"
                  onClick={() => sendMessage(question)}
                  sx={{
                    minHeight: 48,
                    justifyContent: "space-between",
                    textAlign: "left",
                    borderRadius: 2,
                    borderColor: PALETTE.sage,
                    bgcolor: PALETTE.warmBeige,
                    color: "text.primary",
                    "&:hover": { borderColor: PALETTE.warmBrown, bgcolor: PALETTE.sageLight },
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {question}
                  </Typography>
                  <Typography color="primary" fontWeight={600}>
                    ›
                  </Typography>
                </Button>
              ))}
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={2}>
            {messages.map((msg) =>
              msg.type === "user" ? (
                <Stack key={msg.id} direction="row" justifyContent="flex-end">
                  <Box
                    sx={{
                      maxWidth: "85%",
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      borderTopRightRadius: 0.5,
                      bgcolor: PALETTE.warmBrown,
                      color: "#fff",
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {msg.text}
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Stack key={msg.id} direction="row" alignItems="flex-start" spacing={1}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: PALETTE.warmBrown,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    <Chat sx={{ color: "#fff", fontSize: 18 }} />
                  </Box>
                  <Box
                    sx={{
                      maxWidth: "85%",
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      borderTopLeftRadius: 0.5,
                      bgcolor: PALETTE.warmBeige,
                      border: "1px solid",
                      borderColor: PALETTE.sage,
                      boxShadow: 1,
                    }}
                  >
                    {renderMessageContent(msg.text)}
                  </Box>
                </Stack>
              )
            )}
            {isLoading && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: PALETTE.warmBrown,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Chat sx={{ color: "#fff", fontSize: 18 }} />
                </Box>
                <Box sx={{ px: 2, py: 1.5, borderRadius: 2, bgcolor: PALETTE.warmBeige, border: "1px solid", borderColor: PALETTE.sage }}>
                  <CircularProgress size={20} sx={{ color: PALETTE.warmBrown }} />
                </Box>
              </Stack>
            )}
            <Box ref={chatEndRef} />
          </Stack>
        )}
      </Box>

      <Stack direction="row" spacing={1} sx={{ pt: 1.5, pb: 1, alignItems: "center" }}>
        <TextField
          placeholder={instructionRecipe?.name ? "Ask a follow-up about this recipe..." : "What ingredients do you have? Ask me anything..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "9999px",
              bgcolor: PALETTE.warmBeige,
              "&.Mui-focused fieldset": { borderColor: PALETTE.warmBrown },
            },
          }}
        />
        <IconButton
          aria-label="Send message"
          onClick={handleSend}
          sx={{
            width: 44,
            height: 44,
            bgcolor: PALETTE.warmBrown,
            color: "#fff",
            "&:hover": { bgcolor: PALETTE.warmBrown, opacity: 0.9, transform: "scale(1.05)" },
          }}
        >
          <Send />
        </IconButton>
      </Stack>
    </Box>
  );
}
