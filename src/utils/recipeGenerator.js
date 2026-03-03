const API_TIMEOUT_MS = 35000;

export async function generateRecipes(fridgeItems, selectedItems, maxMinutes, excludeIngredients = []) {
  const base = import.meta.env.DEV
    ? (import.meta.env.VITE_API_BASE ?? "http://localhost:3001")
    : "";
  const url = base ? `${base}/api/recipes` : "/api/recipes";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fridgeItems: (fridgeItems || []).map((f) => (typeof f === "object" ? f?.name : f)),
        selectedItems: selectedItems || [],
        maxMinutes: maxMinutes ?? 50,
        excludeIngredients: excludeIngredients || [],
      }),
      signal: controller.signal,
    });
  } catch (e) {
    if (e.name === "AbortError") throw new Error("Request timed out. Please try again.");
    throw new Error("Unable to reach the server. Check your connection.");
  } finally {
    clearTimeout(timeoutId);
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || `Server error (${response.status})`);
  return data.recipes || [];
}
