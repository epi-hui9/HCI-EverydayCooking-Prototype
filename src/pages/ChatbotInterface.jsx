import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Stack, TextField, IconButton, Typography, Button } from "@mui/material";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import SmartToyRounded from "@mui/icons-material/SmartToyRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import { streamAnswer } from "../utils/chatbotAnswers";
import { RECIPE_INSTRUCTIONS } from "../data/recipeInstructions";
import { SUGGESTED_QUESTIONS } from "../data/chatSuggestions";
import { PALETTE, PRIMARY_CTA_SX } from "../theme";
import PageHeader from "../components/PageHeader";
import { useGamification } from "../context/GamificationContext";
import { useLocalStorageState } from "../utils/useLocalStorageState";
import { DEFAULT_FRIDGE, toCanonicalIngredient, getEmoji } from "../data/ingredients";

const FRIDGE_KEY = "ep.foods.v2";

export default function ChatbotInterface({ onBack, onGoHome, instructionRecipe, returnToOnChatBack, bottomNavHeight = 56 }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  const chatEndRef = useRef(null);
  const { addSavedMeal, addToHistory, getAchievements } = useGamification();
  const [foods, setFoods] = useLocalStorageState(FRIDGE_KEY, DEFAULT_FRIDGE);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const recipeContext = instructionRecipe?.name
    ? `The user selected the recipe "${instructionRecipe.name}". Here are the instructions:\n${RECIPE_INSTRUCTIONS[instructionRecipe.name] ?? "No instructions available."}`
    : null;

  useEffect(() => {
    setMessages([]);
  }, [instructionRecipe?.name, instructionRecipe]);

  const sendMessage = useCallback(async (text) => {
    if (!text?.trim() || isStreaming) return;
    const userMsg = { id: Date.now(), text: text.trim(), type: "user" };
    const botId = Date.now() + 1;
    setMessages((prev) => [...prev, userMsg, { id: botId, text: "", type: "bot" }]);
    setInputValue("");
    setIsStreaming(true);
    try {
      const responseText = await streamAnswer(text.trim(), recipeContext);
      setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, text: responseText } : m)));
    } catch (err) {
      console.error("[Chat error]", err);
      setMessages((prev) => prev.map((m) => m.id === botId ? { ...m, text: `Something went wrong: ${err.message || "unknown error"}` } : m));
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
          {parts.map((part, j) => part.startsWith("**") && part.endsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : part)}
        </Typography>
      );
    });
  };

  const [unlockedBefore, setUnlockedBefore] = useState(() => new Set(getAchievements().filter((a) => a.unlocked).map((a) => a.id)));
  const [deductionDetails, setDeductionDetails] = useState([]);

  const getDaysUntilExpiry = useCallback((expiryDate) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(expiryDate) - today) / (1000 * 60 * 60 * 24));
  }, []);

  const handleCompleteCooking = () => {
    const before = new Set(getAchievements().filter((a) => a.unlocked).map((a) => a.id));
    setUnlockedBefore(before);
    const prev = Array.isArray(foods) ? foods : [];
    const recipe = instructionRecipe;
    const details = [];
    if (recipe?.ingredientQuantities) {
      const remaining = {};
      for (const [name, qty] of Object.entries(recipe.ingredientQuantities)) remaining[toCanonicalIngredient(name)] = qty;
      const sorted = [...prev].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
      for (const item of sorted) {
        const canon = toCanonicalIngredient(item.name);
        const need = remaining[canon];
        if (need == null || need <= 0) continue;
        const qty = item.quantity ?? 1;
        const deduct = Math.min(need, qty);
        remaining[canon] -= deduct;
        const daysLeft = getDaysUntilExpiry(item.expiryDate);
        details.push({ name: item.name, used: deduct, before: qty, after: qty - deduct, daysLeft, savedFromWaste: daysLeft <= 3 && deduct > 0 });
      }
    }
    setFoods((p) => {
      if (!Array.isArray(p)) return p;
      const remaining = {};
      for (const [name, qty] of Object.entries(recipe?.ingredientQuantities || {})) remaining[toCanonicalIngredient(name)] = qty;
      const sorted = [...p].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
      const result = [];
      for (const item of sorted) {
        const canon = toCanonicalIngredient(item.name);
        const need = remaining[canon];
        if (need == null || need <= 0) { result.push(item); continue; }
        const qty = item.quantity ?? 1;
        const deduct = Math.min(need, qty);
        remaining[canon] -= deduct;
        const newQty = qty - deduct;
        if (newQty > 0) result.push({ ...item, quantity: newQty });
      }
      return result;
    });
    setDeductionDetails(details);
    addSavedMeal?.(1);
    addToHistory?.({
      recipeName: recipe?.name ?? "Meal",
      co2Saved: 0.5,
      pointsEarned: 10,
      savedFromWaste: details.some((d) => d.savedFromWaste),
    });
    setIsCompleteOpen(true);
  };

  const newlyUnlocked = (() => {
    const after = getAchievements().filter((a) => a.unlocked).map((a) => a.id);
    const newOnes = after.filter((id) => !unlockedBefore.has(id));
    return getAchievements().filter((a) => newOnes.includes(a.id));
  })();

  const showBackButton = onBack && instructionRecipe && returnToOnChatBack === "Recipe Preview";

  return (
    <Box sx={{ px: 2, pt: 1, pb: 0, flex: 1, display: "flex", flexDirection: "column", minHeight: 0, animation: "fadeIn 0.25s ease", position: "relative" }}>
      {/* Header: Back on own row when in recipe flow — matches RecipeDetailsPage/EnergyLevelPage pattern */}
      {showBackButton ? (
        <Stack sx={{ mb: 0.5, flexShrink: 0 }}>
          <Stack direction="row" alignItems="center" component="button" type="button" onClick={onBack} sx={{ border: "none", background: "none", cursor: "pointer", p: 0, m: 0, alignSelf: "flex-start" }}>
            <IconButton sx={{ color: PALETTE.accent, ml: -1, p: 0.5 }}>
              <ChevronLeftRounded sx={{ fontSize: 24 }} />
            </IconButton>
            <Typography sx={{ fontSize: "1.0625rem", fontWeight: 600, color: PALETTE.accent }}>Back</Typography>
          </Stack>
          <PageHeader title="Chat" />
        </Stack>
      ) : (
        <PageHeader title="Chat" />
      )}

      {/* Messages */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", borderRadius: "14px", bgcolor: PALETTE.surfaceTinted, p: 2, "&::-webkit-scrollbar": { display: "none" } }}>
        {messages.length === 0 ? (
          <Stack spacing={2} sx={{ py: 3, animation: "fadeIn 0.4s ease" }}>
            <Box sx={{ textAlign: "center", mb: 1 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: "14px", bgcolor: PALETTE.sageLight, display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                <SmartToyRounded sx={{ fontSize: 24, color: PALETTE.ecoMedium }} />
              </Box>
              {instructionRecipe?.name ? (
                <>
                  <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: PALETTE.textPrimary }}>Ask me anything</Typography>
                  <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, mt: 0.5 }}>
                    Questions about {instructionRecipe.name}? Substitutions, timing, or tips — I&apos;m here to help.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: PALETTE.textPrimary }}>How can I help?</Typography>
                  <Typography sx={{ fontSize: "0.8125rem", color: PALETTE.textSecondary, mt: 0.5 }}>Ask about ingredients, recipes, or cooking tips</Typography>
                </>
              )}
            </Box>
            {!instructionRecipe && (
              <Stack spacing={1}>
                {SUGGESTED_QUESTIONS.map((question, i) => (
                  <Button
                    key={i} fullWidth onClick={() => sendMessage(question)}
                    sx={{
                      justifyContent: "space-between", textAlign: "left", borderRadius: "12px",
                      border: `1px solid ${PALETTE.separator}`, bgcolor: PALETTE.surface, color: PALETTE.textPrimary,
                      px: 2, py: 1.25, minHeight: 44,
                      "&:hover": { bgcolor: PALETTE.accentLight, borderColor: PALETTE.accentRaw }, transition: "all 0.15s",
                    }}
                  >
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>{question}</Typography>
                    <Typography sx={{ color: PALETTE.accent, fontWeight: 600, fontSize: "1.125rem" }}>›</Typography>
                  </Button>
                ))}
              </Stack>
            )}
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
                          <Box key={i} sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: PALETTE.textTertiary, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.15}s`, "@keyframes pulse": { "0%, 100%": { opacity: 0.3, transform: "scale(0.85)" }, "50%": { opacity: 1, transform: "scale(1)" } } }} />
                        ))}
                      </Stack>
                    ) : renderText(msg.text)}
                  </Box>
                </Stack>
              );
            })}
            <Box ref={chatEndRef} />
          </Stack>
        )}
      </Box>

      {/* Input area */}
      <Box sx={{ flexShrink: 0, pt: 0.75, pb: 0.5, mx: -2, px: 2, bgcolor: PALETTE.surface, borderTop: `0.5px solid ${PALETTE.separator}` }}>
        {instructionRecipe?.name && (
          <Button
            fullWidth onClick={handleCompleteCooking}
            startIcon={<LocalFireDepartmentRounded />}
            sx={{
              mb: 0.75, borderRadius: "14px", height: 44,
              bgcolor: PALETTE.ecoDeep, color: "#fff", fontWeight: 700, textTransform: "none",
              "&:hover": { bgcolor: PALETTE.ecoDark },
              "&.Mui-disabled": { bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textTertiary },
            }}
          >
            Complete cooking
          </Button>
        )}
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            placeholder={instructionRecipe?.name ? "Ask about this recipe..." : "Ask me anything..."}
            value={inputValue} onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress} size="small" fullWidth disabled={isStreaming}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "22px", bgcolor: PALETTE.surfaceSecondary, "& fieldset": { borderColor: PALETTE.separator }, "&.Mui-focused fieldset": { borderColor: PALETTE.accent, borderWidth: 1.5 } } }}
          />
          <IconButton
            aria-label="Send message" onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isStreaming}
            sx={{ width: 38, height: 38, bgcolor: PALETTE.accent, color: "#fff", "&:hover": { bgcolor: PALETTE.accentDark }, "&.Mui-disabled": { bgcolor: PALETTE.surfaceSecondary, color: PALETTE.textTertiary }, transition: "all 0.15s" }}
          >
            <ArrowUpwardRounded sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* Complete cooking overlay */}
      {isCompleteOpen && (
        <Box
          sx={{
            position: "absolute", inset: 0, zIndex: 30,
            background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 100%)",
            backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            overflowY: "auto",
            pt: "max(calc(env(safe-area-inset-top, 0px) + 24px), 32px)",
            px: 2, pb: 4,
            animation: "completeOverlayIn 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onClick={() => setIsCompleteOpen(false)}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: "100%", maxWidth: 360, borderRadius: "20px", bgcolor: "#fff", p: 2,
              boxShadow: "0 24px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
              animation: "completeModalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <Stack spacing={1.25} alignItems="center" sx={{ textAlign: "center" }}>
              <Box sx={{ width: 54, height: 54, borderRadius: "16px", bgcolor: PALETTE.sageLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>🏆</Box>
              <Typography sx={{ fontSize: "1.125rem", fontWeight: 800, color: PALETTE.textPrimary }}>Nice work 🌿</Typography>
              <Typography sx={{ fontSize: "0.875rem", color: PALETTE.textSecondary, lineHeight: 1.45 }}>+10 pts · +0.5 kg CO₂ saved</Typography>

              {deductionDetails.length > 0 && (
                <Box sx={{ width: "100%", mt: 0.5 }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: PALETTE.textSecondary, mb: 1, textAlign: "left" }}>What you used</Typography>
                  <Stack spacing={0.75}>
                    {deductionDetails.map((d, i) => (
                      <Box key={i} sx={{ borderRadius: "12px", border: d.savedFromWaste ? `2px solid ${PALETTE.ecoMedium}` : `1px solid ${PALETTE.separator}`, bgcolor: d.savedFromWaste ? PALETTE.sageLight : PALETTE.surface, px: 1.5, py: 1.25, textAlign: "left", position: "relative", overflow: "hidden" }}>
                        {d.savedFromWaste && (
                          <Box sx={{ position: "absolute", top: 0, right: 0, px: 1, py: 0.25, bgcolor: PALETTE.ecoMedium, color: "#fff", fontSize: "0.625rem", fontWeight: 800, borderRadius: "0 10px 0 8px", letterSpacing: "0.04em" }}>SAVED</Box>
                        )}
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{ fontSize: "1.125rem" }}>{getEmoji(d.name)}</Typography>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: PALETTE.textPrimary }}>{d.name}</Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary }}>{d.before} → used {d.used} → {d.after} left</Typography>
                          </Box>
                        </Stack>
                        {d.savedFromWaste && (
                          <Typography sx={{ fontSize: "0.6875rem", color: PALETTE.ecoDeep, fontWeight: 600, mt: 0.5 }}>
                            {d.daysLeft <= 0 ? "Was expired!" : `Expiring in ${d.daysLeft}d`} — saved from waste!
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {newlyUnlocked.length > 0 && (
                <Box sx={{ width: "100%", mt: 0.5 }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: PALETTE.textSecondary, mb: 1 }}>New achievement</Typography>
                  <Stack spacing={0.75}>
                    {newlyUnlocked.slice(0, 2).map((a) => (
                      <Box key={a.id} sx={{ borderRadius: "14px", border: `1px solid ${PALETTE.separator}`, bgcolor: PALETTE.surface, px: 1.5, py: 1.25, display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 34, height: 34, borderRadius: "12px", bgcolor: PALETTE.sageLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>{a.icon}</Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: "0.875rem", fontWeight: 800, color: PALETTE.textPrimary }}>{a.name}</Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: PALETTE.textSecondary }}>{a.desc}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              <Button
                fullWidth variant="contained"
                onClick={() => { setIsCompleteOpen(false); setDeductionDetails([]); onGoHome?.(); }}
                sx={{ mt: 0.75, ...PRIMARY_CTA_SX }}
              >
                Done
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
