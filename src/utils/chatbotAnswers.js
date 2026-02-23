export async function streamAnswer(prompt, recipeContext) {
  const finalPrompt = `
You are a calm minimalist cooking assistant.
Respond in under 80 words.
Use short sentences.
No essays.
Be clear and helpful.

${recipeContext ? recipeContext : ""}

User question:
${prompt}
`;

  const base = import.meta.env.VITE_API_BASE || "http://localhost:3001";

  let response;
  try {
    response = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: finalPrompt }),
    });
  } catch (e) {
    throw new Error(`Network error. Can't reach API. (${base})`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`API returned non-JSON (status ${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(data?.error || `API error ${response.status}`);
  }
  return data.text;
}