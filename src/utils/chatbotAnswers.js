const API_TIMEOUT_MS = 28000;

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

  // Production: always same-origin /api/chat (Vercel serverless). Dev: use Express on localhost:3001.
  const base = import.meta.env.DEV
    ? (import.meta.env.VITE_API_BASE ?? "http://localhost:3001")
    : "";

  const url = base ? `${base}/api/chat` : "/api/chat";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: finalPrompt }),
      signal: controller.signal,
    });
  } catch (e) {
    if (e.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw new Error(
      "Unable to reach the server. Check your connection and try again."
    );
  } finally {
    clearTimeout(timeoutId);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server returned invalid response (${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(data?.error || `Server error (${response.status}).`);
  }
  return data.text;
}