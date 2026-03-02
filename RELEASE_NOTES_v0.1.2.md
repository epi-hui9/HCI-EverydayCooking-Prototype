# Earthplate — v0.1.2 (Prototype) Release Notes

Release date: 2026-03-01
Public demo URL: https://hci-everyday-cooking-prototype.vercel.app

## What this release accomplishes

This release focuses on **clearer workflows**, **mobile reliability**, and **food waste visibility**:

* A redesigned Recipes flow with Energy-first entry and Recipe Preview before Chat
* Chat API fix for mobile (same-origin in production — no more "Something went wrong" on phones)
* Home page "Start Cooking" hero tile for a single, obvious entry point
* Food waste indicators on recipes and ingredients ("Uses soon-expiring", "Use soon")
* Complete cooking overlay improvements (top padding, entrance animation, Done → Home)

## Key features shipped

### 1) Recipes flow redesign

* **Energy first (Recipes tab):** Tap Recipes or Start Cooking → Energy level → Recipe Recommendation (3 AI-suggested recipes) → pick one or **Browse more recipes** → Recipe Details.
* **Recipe Preview page:** New step between Recipe Details and Chat. Shows ingredients + parsed steps before "Start Cooking with AI".
* **Browse more recipes:** From Recipe Recommendation or single-recipe view, users can access the full recipe list.
* **Two entry paths:** Fridge flow (ingredients → Energy → Recipe Details) and Recipes flow (Energy → Recommendation) — both converge at Recipe Details → Recipe Preview → Chat.

### 2) Chat API fix for mobile (bug fix)

* **Problem:** On Vercel, the frontend was calling `http://localhost:3001`, which fails on mobile (no local server).
* **Fix:** Production uses same-origin `/api/chat`; dev still uses `http://localhost:3001`. `import.meta.env.DEV` drives the choice.
* **Additional:** 28s timeout, clearer error messages ("Unable to reach the server", "Request timed out").

### 3) Home page Start Cooking hero tile

* **Primary CTA:** Full-width hero tile in Quick access grid, styled with eco palette (sage gradient, left accent bar).
* **Subtitle:** "Energy level → recipes" to clarify the flow.
* **Visual balance:** Integrated into the grid instead of a floating button; matches tile language and spacing.

### 4) Food waste indicators

* **Recipe cards:** "Uses soon-expiring" badge when recipe uses ingredients expiring soon.
* **Ingredient lists:** "Use soon" highlight for items within 3 days of expiry.
* **Complete cooking overlay:** "SAVED" badge for ingredients that were expiring soon and were used.

### 5) Complete cooking overlay improvements

* Top padding for safe area / notch.
* Entrance animation (`completeOverlayIn`, `completeModalIn`).
* **Done** button returns to Home (no longer stays on Chat).

### 6) Vercel deployment configuration

* `vercel.json`: SPA rewrites, `api/chat.js` serverless function (maxDuration: 30s).
* Single project: frontend + API on same domain; `OPENAI_API_KEY` in Vercel env.

## Bug fixes

| Issue | Fix |
|-------|-----|
| Chat "Something went wrong" on mobile | Same-origin API in production; timeout + clearer errors |
| Complete cooking Done stayed on Chat | Done now calls `onGoHome()` → Home |
| Recipe flow unclear (Fridge vs Recipes) | Start Cooking hero tile; Energy-first Recipes flow |

## Files touched (high level)

* **Flow / routing:** `src/App.jsx`, `src/pages/RecipeRecommendationPage.jsx`, `src/pages/RecipePreviewPage.jsx`, `src/pages/RecipeDetailsPage.jsx`
* **Chat:** `src/utils/chatbotAnswers.js`, `src/pages/ChatbotInterface.jsx`
* **Home:** `src/pages/Homepage.jsx`
* **Food waste:** `src/data/ingredients.js` (getDaysUntilExpiry, isExpiringSoon, getExpiryStyle)
* **Deployment:** `vercel.json`, `api/chat.js`
* **Shared:** `src/components/PageHeader.jsx`, `src/utils/recipeInstructions.js` (parseRecipeSteps)

## Known limitations / next fixes

* Recipe Recommendation uses mock/sample logic; full AI recipe suggestion integration is future work.
* History and Weekly Plan remain placeholders.
