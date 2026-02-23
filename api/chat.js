export default async function handler(req, res) {
    try {
      const { prompt } = req.body;
  
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 120,
              temperature: 0.5,
            },
          }),
        }
      );
  
      const data = await response.json();
  
      res.status(200).json({
        text: data?.[0]?.generated_text || "No response",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }