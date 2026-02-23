import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body ?? {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const hfResp = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VITE_HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // 你可以先用这个模型；如果后面报 “model not supported”，我再帮你换成可用的
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

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});