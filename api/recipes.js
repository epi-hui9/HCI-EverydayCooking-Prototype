/**
 * AI recipe generation: 3 recipes based on fridge + selected ingredients.
 * Focus on selected items; can use other fridge items for better recipes.
 */
const SYSTEM_PROMPT = `You are a helpful cooking assistant. Generate exactly 3 recipes as a JSON array.
Each recipe must have: name, ingredients (array of strings), prepTime (e.g. "5 min"), cookTime (e.g. "15 min"), calories (number), instructions (string with numbered steps like "1. Do X. 2. Do Y.").
Keep recipes simple and practical. Total prep+cook time must not exceed the maxMinutes given.
Return ONLY valid JSON, no markdown or extra text.`;

function buildPrompt(fridgeItems, selectedItems, maxMinutes) {
  const fridge = (fridgeItems || []).map((f) => (typeof f === "string" ? f : f?.name)).filter(Boolean).join(", ");
  const selected = (selectedItems || []).join(", ");
  return `User SELECTED these ingredients (MUST use these — user may have dietary restrictions, so respect their choice): ${selected || "none"}
Available in fridge (can use for variety): ${fridge || "none"}
Max total time: ${maxMinutes} minutes.

Generate exactly 3 recipes:
- Recipe 1: Use ONLY the selected ingredients. No other ingredients.
- Recipe 2: Use ONLY the selected ingredients. No other ingredients. (Different dish from Recipe 1.)
- Recipe 3: Use the selected ingredients as the main focus, but you may add 1–2 extra ingredients from the fridge for a better recipe.

Return JSON array:
[{"name":"...","ingredients":["..."],"prepTime":"...","cookTime":"...","calories":123,"instructions":"1. Step one. 2. Step two."}, ...]`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { fridgeItems = [], selectedItems = [], maxMinutes = 50 } = req.body ?? {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Recipe generation requires OPENAI_API_KEY. Add it in Vercel Environment Variables.",
      });
    }

    const prompt = buildPrompt(fridgeItems, selectedItems, maxMinutes);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || data?.message || "OpenAI request failed",
      });
    }

    const text = data?.choices?.[0]?.message?.content?.trim() || "[]";
    let recipes;
    try {
      const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      recipes = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI recipe response" });
    }

    if (!Array.isArray(recipes)) recipes = [];
    const normalized = recipes.slice(0, 3).map((r, i) => {
      const ing = Array.isArray(r.ingredients) ? r.ingredients : [];
      const qty = {};
      ing.forEach((name) => { qty[name] = 1; });
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

    return res.status(200).json({ recipes: normalized });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
