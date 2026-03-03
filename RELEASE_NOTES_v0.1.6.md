# Earthplate — v0.1.6 (Prototype) Release Notes

Release date: 2026-03-02
Public demo URL: https://hci-everyday-cooking-prototype.vercel.app

## What this release accomplishes

This release fixes **recipe filtering** so results match the user's selected ingredients, and resolves **Chat on mobile** deployment issues:

* **Recipe filtering:** Choose a Recipe now shows recipes that use the selected ingredients (not just any fridge match)
* **Chat production fix:** Production always uses same-origin `/api/chat`; ignores `VITE_API_BASE` to avoid wrong backend
* **Diagnostic endpoint:** `/api/health` returns `chatConfigured` to verify OpenAI API key on Vercel
* **Build fixes:** Removed duplicate `position` key in App.jsx; raised `chunkSizeWarningLimit` to 600

## Key fixes

### 1) Recipe filtering (Choose a Recipe)

| Before | After |
|--------|-------|
| Always showed same 2 recipes (Tomato Cheese Bake, Eggs & Cheese Scramble) regardless of selection | Shows recipes that **use** the selected ingredients |
| Matched against entire fridge only | Filters by selected ingredients first; sorts by how many selected ingredients each recipe uses |

**Example:** Select Chicken + Broccoli → Chicken Broccoli Stir-fry, Chicken Spinach Bowl. Select Tomato + Cheese → Tomato Cheese Bake, Veggie Omelette.

### 2) Chat on mobile / Vercel

| Issue | Fix |
|-------|-----|
| "Missing OpenAI API key" even after adding key | Production now always uses same-origin `/api/chat`; `VITE_API_BASE` no longer overrides in prod |
| No way to verify API key | Added `/api/health` → returns `{ chatConfigured: true/false }` |

### 3) Build

| Issue | Fix |
|-------|-----|
| Duplicate key `position` in App.jsx (red error in Vercel logs) | Removed duplicate |
| Chunk size warning (500 kB) | `chunkSizeWarningLimit: 600` in vite.config.js |

## Files touched (high level)

* **Recipe filtering:** `src/pages/RecipeDetailsPage.jsx` (selectedOverlapCount, filter by selected ingredients)
* **Chat:** `src/utils/chatbotAnswers.js` (production always same-origin)
* **API:** `api/chat.js`, `api/health.js` (new)
* **Build:** `src/App.jsx`, `vite.config.js`

## Known limitations

* Recipe Recommendation uses mock/sample logic.
* Weekly Plan does not yet suggest recipes based on expiring ingredients.
* Chat requires `OPENAI_API_KEY` in Vercel environment variables for production.
