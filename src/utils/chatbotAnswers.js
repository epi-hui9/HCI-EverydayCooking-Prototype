import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are Earthplate's cooking assistant — a warm, calm friend helping someone cook.

RESPONSE RULES (follow strictly):
- MAX 2–3 short sentences for simple questions.
- For recipes: short ingredient list, then numbered steps. Each step = ONE sentence, ONE action.
- Use bullet points, not paragraphs. Never write essays.
- Be warm but brief. Think "kitchen post-it note," not "food blog."
- If the user sends a recipe name, give the steps immediately — no preamble.
- Match the user's language (if they write Chinese, reply in Chinese).
- Use emoji sparingly — one per message at most.
- If unsure, say "I'm not sure" in one sentence. Don't guess at food safety.`;

let chatSession = null;
let sessionContext = null;

function resetChat(context) {
  if (!API_KEY) return;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const history = [];
  if (context) {
    history.push(
      { role: "user", parts: [{ text: `[System context — do not repeat this to the user]\n${context}` }] },
      { role: "model", parts: [{ text: "Got it. I'll keep this in mind." }] },
    );
  }

  chatSession = model.startChat({ history });
  sessionContext = context;
}

function ensureChat(context) {
  if (!chatSession || context !== sessionContext) resetChat(context);
  return chatSession;
}

/**
 * Stream an answer from Gemini. Yields text chunks.
 * Falls back to a stub if no API key is configured.
 */
export async function* streamAnswer(userMessage, context) {
  if (!API_KEY) {
    yield "No AI key configured. Add VITE_GEMINI_API_KEY to your .env file.";
    return;
  }
  try {
    const chat = ensureChat(context);
    const result = await chat.sendMessageStream(userMessage);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  } catch (err) {
    console.error("[Earthplate AI]", err);
    if (err.message?.includes("SAFETY")) {
      yield "I can only help with cooking-related questions. What would you like to cook today? 🍳";
    } else if (err.message?.includes("API_KEY") || err.status === 400) {
      yield "API key issue — please check that your VITE_GEMINI_API_KEY in .env is valid.";
    } else {
      yield `Something went wrong: ${err.message || "unknown error"}. Please try again.`;
    }
  }
}

/**
 * Non-streaming fallback (kept for compatibility).
 */
export async function getAnswer(userMessage, context) {
  if (!API_KEY) return "No AI key configured. Add VITE_GEMINI_API_KEY to your .env file.";
  const chat = ensureChat(context);
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
