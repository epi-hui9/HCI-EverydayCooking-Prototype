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

  const response = await fetch("http://localhost:3001/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: finalPrompt }),
  });

  const data = await response.json();
  return data.text;
}