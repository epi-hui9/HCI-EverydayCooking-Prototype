import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Stack, TextField, IconButton, Typography, Button } from "@mui/material";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import SmartToyRounded from "@mui/icons-material/SmartToyRounded";
import { streamAnswer } from "../utils/chatbotAnswers";
import { RECIPE_INSTRUCTIONS } from "../data/recipeInstructions";
import { SUGGESTED_QUESTIONS } from "../data/chatSuggestions";
import { PALETTE } from "../theme";

export default function ChatbotInterface({ onBack, instructionRecipe }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const recipeContext = instructionRecipe?.name
    ? `The user selected the recipe "${instructionRecipe.name}". Here are the instructions:\n${RECIPE_INSTRUCTIONS[instructionRecipe.name] ?? "No instructions available."}`
    : null;

  useEffect(() => {
    if (instructionRecipe?.name && RECIPE_INSTRUCTIONS[instructionRecipe.name]) {
      setMessages([{ id: "recipe-instructions", text: RECIPE_INSTRUCTIONS[instructionRecipe.name], type: "bot" }]);
    } else if (instructionRecipe == null) {
      setMessages([]);
    }
  }, [instructionRecipe?.name, instructionRecipe]);

  const sendMessage = useCallback(async (text) => {
    if (!text?.trim() || isStreaming) return;
    const userMsg = { id: Date.now(), text: text.trim(), type: "user" };
    const botId = Date.now() + 1;

    setMessages((prev) => [...prev, userMsg, { id: botId, text: "", type: "bot" }]);
    setInputValue("");
    setIsStreaming(true);

    try {
      const stream = streamAnswer(text.trim(), recipeContext);
      for await (const chunk of stream) {
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: m.text + chunk } : m)),
        );
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId && !m.text ? { ...m, text: "No response received. Please try again." } : m,
        ),
      );
    } catch (err) {
      console.error("[Chat error]", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId && !m.text
            ? { ...m, text: `Something went wrong: ${err.message || "unknown error"}` }
            : m,
        ),
      );
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming, recipeContext]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue); }
  };

  const renderText = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <Typography key={i} component="span" display="block" sx={{ mt: i > 0 ? 0.75 : 0, fontSize: "0.875rem", lineHeight: 1.55, color: "inherit" }}>
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j}>{part.slice(2, -2)}</strong>
              : part
          )}
        </Typography>
      );
    });
  };

  return (
    <Box sx={{ px: 2, pt: 1, pb: 1, display: "flex", flexDirection: "column", minHeight: "100%", animation: "fadeIn 0.25s ease" }}>
      {/* Nav */}
      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
        <IconButton onClick={onBack} sx={{ color: PALETTE.accent, ml: -1 }}>
          <ChevronLeftRounded />
        </IconButton>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
        <Box sx={{ flex: 1 }} />
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Chat</Typography>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ width: 40 }} />
      </Stack>

      {/* Messages */}
      <Box
        sx={{
          flex: 1, minHeight: 200, overflowY: "auto",
          borderRadius: "16px", bgcolor: PALETTE.surfaceTinted, p: 2,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {messages.length === 0 ? (
          <Stack spacing={2} sx={{ py: 3, animation: "fadeIn 0.4s ease" }}>
            <Box sx={{ textAlign: "center", mb: 1 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: "14px", bgcolor: PALETTE.sageLight, display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                <SmartToyRounded sx={{ fontSize: 24, color: PALETTE.ecoMedium }} />
              </Box>
              <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: PALETTE.textPrimary }}>
                How can I help?
              </Typography>
              <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, mt: 0.5 }}>
                Ask about ingredients, recipes, or cooking tips
              </Typography>
            </Box>
            <Stack spacing={1}>
              {SUGGESTED_QUESTIONS.map((question, i) => (
                <Button
                  key={i} fullWidth onClick={() => sendMessage(question)}
                  sx={{
                    justifyContent: "space-between", textAlign: "left",
                    borderRadius: "12px", border: `1px solid ${PALETTE.separator}`,
                    bgcolor: PALETTE.surface, color: PALETTE.textPrimary,
                    px: 2, py: 1.25, minHeight: 44,
                    "&:hover": { bgcolor: PALETTE.accentLight, borderColor: PALETTE.accentRaw },
                    transition: "all 0.15s",
                  }}
                >
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>{question}</Typography>
                  <Typography sx={{ color: PALETTE.accent, fontWeight: 600, fontSize: "1.125rem" }}>›</Typography>
                </Button>
              ))}
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {messages.map((msg) => {
              if (msg.type === "user") {
                return (
                  <Stack key={msg.id} direction="row" justifyContent="flex-end">
                    <Box sx={{ maxWidth: "80%", px: 2, py: 1.25, borderRadius: "18px 18px 4px 18px", bgcolor: PALETTE.accent, color: "#fff" }}>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.45 }}>{msg.text}</Typography>
                    </Box>
                  </Stack>
                );
              }

              const isEmpty = !msg.text;
              return (
                <Stack key={msg.id} direction="row" alignItems="flex-end" spacing={1}>
                  <Box sx={{ width: 28, height: 28, borderRadius: "8px", bgcolor: PALETTE.sageLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <SmartToyRounded sx={{ fontSize: 16, color: PALETTE.ecoMedium }} />
                  </Box>
                  <Box sx={{ maxWidth: "80%", px: 2, py: 1.25, borderRadius: "18px 18px 18px 4px", bgcolor: PALETTE.surface, color: PALETTE.textPrimary, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                    {isEmpty ? (
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ py: 0.25 }}>
                        {[0, 1, 2].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 6, height: 6, borderRadius: "50%", bgcolor: PALETTE.textTertiary,
                              animation: "pulse 1.2s ease-in-out infinite",
                              animationDelay: `${i * 0.15}s`,
                              "@keyframes pulse": {
                                "0%, 100%": { opacity: 0.3, transform: "scale(0.85)" },
                                "50%": { opacity: 1, transform: "scale(1)" },
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      renderText(msg.text)
                    )}
                  </Box>
                </Stack>
              );
            })}
            <Box ref={chatEndRef} />
          </Stack>
        )}
      </Box>

      {/* Input */}
      <Stack direction="row" spacing={1} sx={{ pt: 1.5, pb: 0.5, alignItems: "center" }}>
        <TextField
          placeholder={instructionRecipe?.name ? "Ask about this recipe..." : "Ask me anything..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small" fullWidth
          disabled={isStreaming}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "22px", bgcolor: PALETTE.surfaceSecondary,
              "& fieldset": { borderColor: PALETTE.separator },
              "&.Mui-focused fieldset": { borderColor: PALETTE.accent, borderWidth: 1.5 },
            },
          }}
        />
        <IconButton
          aria-label="Send message" onClick={() => sendMessage(inputValue)}
          disabled={!inputValue.trim() || isStreaming}
          sx={{
            width: 38, height: 38, bgcolor: PALETTE.accent, color: "#fff",
            "&:hover": { bgcolor: PALETTE.accentDark },
            "&.Mui-disabled": { bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textTertiary },
            transition: "all 0.15s",
          }}
        >
          <ArrowUpwardRounded sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
    </Box>
  );
}
