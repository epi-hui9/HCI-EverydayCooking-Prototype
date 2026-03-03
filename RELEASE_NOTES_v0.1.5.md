# Earthplate — v0.1.5 (Prototype) Release Notes

Release date: 2026-03-03
Public demo URL: https://hci-everyday-cooking-prototype.vercel.app

## What this release accomplishes

This release refines the cooking flow based on user feedback, adds **monetary savings** tracking, and improves the Add Food experience with **auto-fill**:

* **Ingredient-first flow:** Start Cooking → My Fridge (pick ingredients) → Energy → Recipe Details
* **Tap recipe → go directly** to ingredients + steps (Recipe Preview)
* **Recipe steps in Chat** when coming from recipe flow
* **Monetary savings:** Track $ saved when using ingredients within 3 days of expiry
* **Add Food auto-fill:** Type ingredient name → category and expiry date auto-populate
* **Chat reset:** After completing cooking, Chat returns to generic state (no Complete button, 4 suggested questions)
* **UI cleanup:** Removed redundant My Fridge and Recipes tiles from homepage

## Key features shipped

### 1) Flow improvements

| Change | Description |
|--------|-------------|
| Start Cooking → Fridge | Hero tile now goes to ingredient selection first (was Energy) |
| Tap recipe = go | In "Choose a Recipe", tapping a recipe goes directly to Recipe Preview (no extra Start Cooking step) |
| Recipe steps in Chat | When entering Chat from recipe, steps appear as initial bot message |
| Chat reset | After Complete cooking, or when entering Chat from nav bar → generic Chat (suggested questions, no Complete button) |
| Weekly Plan Start | "Start" on each day card goes directly to that recipe; "Start today's meal" when today has a plan |

### 2) Monetary savings

* **Logic:** When user uses ingredients within 3 days of expiry, estimated $ saved is calculated (per-ingredient price × quantity).
* **Display:** Subtle line below impact card: "That's about $X.X saved from waste"; History summary; Complete overlay when applicable.
* **Storage:** `ep.moneySavedTotal` in localStorage; `moneySaved` per history entry.

### 3) Add Food auto-fill

* **Autocomplete:** Type ingredient name → suggestions with emoji, category, shelf life.
* **Auto-fill:** Select or match → category and expiry date (today + typical shelf life) auto-populate.
* **Editable:** All fields remain editable.
* **Knowledge base:** 30+ ingredients with category and typical fridge shelf life.

### 4) Bug fixes

| Issue | Fix |
|-------|-----|
| Complete cooking button greyed out | Removed disabled state; always clickable for demo |
| Chatbot Object error | Fixed error handling when API returns object |
| Weekly planner asks to choose again | Start from day card goes directly to that recipe |

### 5) UI cleanup

* Removed My Fridge tile (redundant with Start Cooking hero)
* Removed Recipes tile from homepage (access via bottom nav)
* Homepage Quick access: Start Cooking (hero) + History + Weekly Plan

## Files touched (high level)

* **Flow:** `src/App.jsx`, `src/pages/Homepage.jsx`, `src/pages/RecipeDetailsPage.jsx`, `src/pages/WeeklyPlanPage.jsx`
* **Chat:** `src/pages/ChatbotInterface.jsx`, `src/utils/chatbotAnswers.js`
* **Add Food:** `src/pages/FridgeContent.jsx`, `src/data/ingredients.js`
* **Gamification:** `src/context/GamificationContext.jsx`
* **History:** `src/pages/HistoryPage.jsx`

## Known limitations

* Recipe Recommendation uses mock/sample logic.
* Weekly Plan does not yet suggest recipes based on expiring ingredients.
* Ingredient prices are estimated (US market averages).
