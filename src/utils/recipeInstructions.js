/**
 * Parse recipe instructions into structured steps.
 * Supports:
 * - Line-based: "1. Step one\n2. Step two..."
 * - Inline (AI): "1. Step one. 2. Step two. 3. Step three..." (all in one block)
 */
export function parseRecipeSteps(rawText) {
  if (!rawText || typeof rawText !== "string") return [];
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  const steps = [];
  for (const line of lines) {
    const match = line.match(/^(\d+)\.\s+(.+)$/);
    if (match) steps.push({ num: parseInt(match[1], 10), text: match[2] });
  }
  if (steps.length > 1) return steps;

  // Fallback: AI often returns "1. A. 2. B. 3. C" or "A. 2. B. 3. C" in one block — split by lookahead for "N. "
  const parts = rawText.trim().split(/\s*(?=\d+\.\s)/).filter(Boolean);
  const inlineSteps = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const m = part.match(/^(\d+)\.\s+(.+)$/s);
    if (m) {
      inlineSteps.push({ num: parseInt(m[1], 10), text: m[2].trim() });
    } else if (i === 0 && part.trim()) {
      inlineSteps.push({ num: 1, text: part.trim() });
    }
  }
  return inlineSteps.length > 0 ? inlineSteps : steps;
}
