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

    const token = process.env.HF_API_KEY || process.env.VITE_HF_API_KEY;
    if (!token) return res.status(500).json({ error: "Missing HF API key (HF_API_KEY)" });

    const hfResp = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [{ role: "user", content: prompt }],
        stream: false,
        max_tokens: 140,
        temperature: 0.5,
      }),
    });

    const data = await hfResp.json();

    if (!hfResp.ok) {
      console.log("[HF ERROR]", data);
      return res.status(hfResp.status).json({
        error: data?.error || data?.message || "HF request failed",
        raw: data,
      });
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      console.log("[HF UNEXPECTED RESPONSE]", data);
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