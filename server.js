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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});