/**
 * Stub for chatbot answers (prototype). Replace with real API when backend is ready.
 */
export async function getAnswer(question) {
  await new Promise((r) => setTimeout(r, 600));
  return `Here are some ideas for "${question.slice(0, 40)}${question.length > 40 ? '…' : ''}":\n\n**Quick options:** Try a stir-fry or soup with what you have. Check the Recipe tab for step-by-step ideas.`;
}
