/**
 * Parse RECIPE_INSTRUCTIONS text into structured steps.
 * Format: "**Title**\n\n1. Step one\n2. Step two..."
 */
export function parseRecipeSteps(rawText) {
  if (!rawText || typeof rawText !== "string") return [];
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  const steps = [];
  for (const line of lines) {
    const match = line.match(/^(\d+)\.\s+(.+)$/);
    if (match) steps.push({ num: parseInt(match[1], 10), text: match[2] });
  }
  return steps;
}
