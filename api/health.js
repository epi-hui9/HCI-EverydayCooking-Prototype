/** Diagnostic: check if OPENAI_API_KEY is available. Visit /api/health from phone to verify. */
export default async function handler(req, res) {
  const configured = !!process.env.OPENAI_API_KEY;
  res.status(200).json({
    ok: true,
    chatConfigured: configured,
    hint: configured ? "Chat should work." : "Add OPENAI_API_KEY in Vercel → Settings → Environment Variables, enable Production, then Redeploy.",
  });
}
