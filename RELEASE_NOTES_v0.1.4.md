# Earthplate — v0.1.4 (Prototype) Release Notes

Release date: 2026-03-01
Public demo URL: https://hci-everyday-cooking-prototype.vercel.app

## What this release accomplishes

This release adds **History** and **Weekly Plan** as full features, plus several UX and bug fixes:

* History page: cooking journey timeline with impact stats
* Weekly Plan: plan meals per day for the current week
* Recipe Details: steps now visible in single-recipe view
* Flow simplification: Recipe Recommendation → Recipe Preview directly (no duplicate layer)
* Modal fix: Weekly Plan recipe picker stays inside phone frame on desktop

## Key features shipped

### 1) History page

* **Cooking journey:** Timeline of completed meals with recipe name, date, CO₂ saved, points earned.
* **Impact summary:** Meals saved, kg CO₂ saved, "from waste" count.
* **Saved from waste badge:** Entries that used soon-expiring ingredients show a "Saved" chip.
* **Empty state:** "Start your journey" with Start Cooking CTA when no history.
* **Persistence:** Logged via `addToHistory` when user completes cooking in Chat.

### 2) Weekly Plan page

* **Week view:** Mon–Sun for current week; each day shows planned meal or "Add meal".
* **Recipe picker:** Tap a day → bottom sheet modal with full recipe list; select to assign.
* **Summary:** "X of 7 meals planned"; "X expiring soon" from fridge when applicable.
* **Today highlight:** Current day has accent border and "Today" chip.
* **Persistence:** `ep.weeklyPlan` in localStorage.

### 3) Bug fixes & UX improvements

| Issue | Fix |
|-------|-----|
| Steps not visible in Recipe Details | Added STEPS section with parseRecipeSteps in single-recipe view |
| Duplicate ingredients+steps layer | Recipe Recommendation → Recipe Preview directly; skip Recipe Details |
| Modal outside phone frame on desktop | Modal `container` = phone frame ref; `transform: translateZ(0)` for fixed positioning |

## Files touched (high level)

* **History:** `src/pages/HistoryPage.jsx`, `src/context/GamificationContext.jsx` (addToHistory, getCookingHistory), `src/pages/ChatbotInterface.jsx`
* **Weekly Plan:** `src/pages/WeeklyPlanPage.jsx`, `src/App.jsx` (modalContainerRef)
* **Recipe Details:** `src/pages/RecipeDetailsPage.jsx` (steps section)
* **Flow:** `src/App.jsx` (handleRecipeFromRecipesTab → Recipe Preview)

## Known limitations

* Recipe Recommendation uses mock/sample logic.
* Weekly Plan does not yet suggest recipes based on expiring ingredients.
