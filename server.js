import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple health check (useful for deployment debugging)
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body ?? {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OpenAI API key. Add OPENAI_API_KEY to .env for local dev." });

    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.6,
      }),
    });

    const data = await openaiResp.json();

    if (!openaiResp.ok) {
      console.log("[OpenAI ERROR]", data);
      const errMsg = data?.error?.message || data?.message || "OpenAI request failed";
      return res.status(openaiResp.status).json({ error: errMsg, raw: data });
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      console.log("[OpenAI UNEXPECTED RESPONSE]", data);
      return res.status(500).json({ error: "Unexpected response shape", raw: data });
    }

    return res.json({ text });
  } catch (error) {
    console.log("[SERVER ERROR]", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
});

// AI recipe generation (matches api/recipes.js for Vercel)
const RECIPES_SYSTEM = `You are a helpful cooking assistant. Generate exactly 3 recipes as a JSON array.
Each recipe must have: name, ingredients (array of strings), prepTime (e.g. "5 min"), cookTime (e.g. "15 min"), calories (number), instructions (string with numbered steps like "1. Do X. 2. Do Y.").
Keep recipes simple and practical. Total prep+cook time must not exceed the maxMinutes given.
Return ONLY valid JSON, no markdown or extra text.`;

app.post("/api/recipes", async (req, res) => {
  try {
    const { fridgeItems = [], selectedItems = [], maxMinutes = 50 } = req.body ?? {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const fridge = (fridgeItems || []).map((f) => (typeof f === "string" ? f : f?.name)).filter(Boolean).join(", ");
    const selected = (selectedItems || []).join(", ");
    const prompt = `User SELECTED: ${selected || "none"}\nFridge: ${fridge || "none"}\nMax time: ${maxMinutes} min.\nGenerate 3 recipes. Prioritize selected. Return JSON array.`;

    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "system", content: RECIPES_SYSTEM }, { role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });

    const data = await openaiResp.json();
    if (!openaiResp.ok) return res.status(openaiResp.status).json({ error: data?.error?.message || "OpenAI failed" });

    const text = (data?.choices?.[0]?.message?.content || "[]").trim().replace(/```json\s*/g, "").replace(/```/g, "").trim();
    let recipes;
    try { recipes = JSON.parse(text); } catch { return res.status(500).json({ error: "Parse failed" }); }
    if (!Array.isArray(recipes)) recipes = [];

    const normalized = recipes.slice(0, 3).map((r, i) => {
      const ing = Array.isArray(r.ingredients) ? r.ingredients : [];
      const qty = {}; ing.forEach((n) => { qty[n] = 1; });
      return {
        id: `ai-${Date.now()}-${i}`,
        name: String(r.name || "AI Recipe").trim(),
        ingredients: ing,
        ingredientQuantities: r.ingredientQuantities || qty,
        prepTime: String(r.prepTime || "5 min").trim(),
        cookTime: String(r.cookTime || "10 min").trim(),
        calories: Math.max(0, parseInt(r.calories, 10) || 250),
        instructions: String(r.instructions || "").trim(),
        isAiGenerated: true,
      };
    });

    return res.json({ recipes: normalized });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});