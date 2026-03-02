export default async function handler(req, res) {
  try {
    const { prompt } = req.body ?? {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || data?.message || "OpenAI request failed",
      });
    }

    const text = data?.choices?.[0]?.message?.content;
    res.status(200).json({ text: text || "No response" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}