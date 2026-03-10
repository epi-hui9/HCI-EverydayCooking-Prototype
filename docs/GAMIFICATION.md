# Gamification Design Documentation

This document describes the **food waste gamification** system in Earthplate: goals, metrics, rules, and implementation.

---

## 1. Purpose and Goals

The gamification layer encourages users to **reduce food waste** by:

- Making the **environmental impact** visible (CO₂ saved).
- Providing **progress feedback** (points, levels, streaks).
- Offering **achievements** as milestones and rewards.

Design goals:

- **Clarity:** Users quickly understand “what I did” and “what I get.”
- **Consistency:** All numbers and levels follow simple, predictable rules.
- **Extensibility:** Logic lives in one place (`GamificationContext`) so new triggers (e.g. “used an ingredient,” “completed a recipe”) can be hooked in later.

---

## 2. Core Metrics

| Metric | Description | Unit / Format |
|--------|-------------|----------------|
| **CO₂ saved** | Estimated CO₂ equivalent avoided by using food before it expires (instead of wasting it). Shown with **relatable references** (e.g. "≈ 74 km drive (≈ 1 hr)") based on UK Gov 2022 / Our World in Data. | kg (e.g. 12.4 kg) |
| **Points** | Earned for “saved meals” (or equivalent actions). Used for level progression. | Integer |
| **Level** | Derived from total points. Increases every `POINTS_PER_LEVEL` (100). | Integer (1, 2, 3, …) |
| **Streak** | Consecutive days with at least one “saving” action. | Days (integer) |
| **Meals saved** | Count of meals (or equivalent) the user has “saved” from waste. | Integer |

All of these are exposed by `GamificationContext` and consumed by the Homepage (and can be used elsewhere).

---

## 3. Rules and Constants

Defined in `src/context/GamificationContext.jsx`:

| Constant | Value | Meaning |
|----------|--------|--------|
| `CO2_PER_MEAL_SAVED_KG` | 0.5 | kg CO₂ credited per saved meal. |
| `POINTS_PER_MEAL_SAVED` | 10 | Points awarded per saved meal. |
| `POINTS_PER_LEVEL` | 100 | Points required to advance one level (level = floor(points / 100) + 1). |

**Level formula:**  
`level = Math.floor(points / POINTS_PER_LEVEL) + 1`

**Points within current level:**  
`pointsInCurrentLevel = points % POINTS_PER_LEVEL`  
`pointsToNextLevel = POINTS_PER_LEVEL - pointsInCurrentLevel`

**Streak logic (conceptual):**

- If the user has activity **today**, and last activity was **yesterday** → streak increments.
- If last activity was **today** → streak unchanged.
- Otherwise → streak resets to 1 (or 0, depending on product choice).

The context uses `lastActivityDate` and the current date to compute this when `addSavedMeal()` is called.

---

## 4. Achievements

Achievements are fixed in the code and marked as unlocked via `unlockedAchievements` (array of achievement ids).

| Id | Name | Description | Icon |
|----|------|-------------|------|
| `first_save` | First Save | Logged first saved meal | 🌱 |
| `eco_10` | Eco Starter | Saved 10 kg CO₂ | 🍃 |
| `streak_3` | On a Roll | 3-day streak | 🔥 |
| `streak_7` | Week Warrior | 7-day streak | ⭐ |
| `level_3` | Planet Helper | Reached Level 3 | 🌍 |
| `level_5` | Waste Fighter | Reached Level 5 | 🏆 |

The Homepage shows a short list of **unlocked** achievements (e.g. first four). **Achievements are clickable** — tapping the row or any badge opens a dialog with the full list (unlocked + locked) and descriptions. Unlocked show their icon; locked show a lock icon.

---

## 5. User Actions and Hooks

**Current:**

- **`addSavedMeal(count = 1)`**  
  - Increases `mealsSaved` by `count`.  
  - Adds `count * CO2_PER_MEAL_SAVED_KG` to `co2SavedKg` (rounded to 1 decimal).  
  - Adds `count * POINTS_PER_MEAL_SAVED` to `points`.  
  - Updates `lastActivityDate` to today and refreshes `streakDays` (as in §3).

**Future integration points (not yet wired):**

- When the user marks an ingredient as “used” (e.g. in Fridge or after a recipe).
- When the user completes a recipe (e.g. from Recipe Details or Chat).
- Optional: daily check-in or “no waste today” confirmation.

Calling `addSavedMeal(n)` from those flows will keep points, CO₂, and streak in sync.

---

## 6. UI Presentation (Homepage)

- **“Your impact this week”** card (green gradient):
  - **CO₂ saved** (e.g. “12.4 kg CO₂ saved”).
  - **Relatable reference** (e.g. "≈ 74 km drive (≈ 1 hr)") — car: ~0.17 kg/km; flight comparison only when ≥50 kg.
  - **Level** and **Points** in one pill; **Streak** (with flame icon) in another.
  - **Next level** progress bar: `pointsInCurrentLevel / POINTS_PER_LEVEL`, with “X pts to go” label.
- **Achievements** row: trophy icon + up to four unlocked achievement icons; **tap to open dialog** with full list (unlocked + locked) and descriptions.

All data is read from `useGamification()`; no gamification logic lives in the page component.

---

## 7. Implementation Notes

- **File:** `src/context/GamificationContext.jsx`
- **Provider:** Wrap the app in `GamificationProvider` (done in `main.jsx`).
- **Consumption:** Any component can call `useGamification()` to read state and `addSavedMeal`.
- **Persistence:** Current implementation is in-memory only. For a real app, persist `points`, `co2SavedKg`, `mealsSaved`, `streakDays`, `lastActivityDate`, and `unlockedAchievements` (e.g. localStorage or backend) and rehydrate on load.

---

## 8. Summary

| Item | Detail |
|------|--------|
| **Theme** | Food waste reduction → CO₂ and points. |
| **Metrics** | CO₂ saved, points, level, streak, meals saved. |
| **Rules** | 0.5 kg CO₂ and 10 pts per saved meal; 100 pts per level; streak by consecutive days. |
| **Achievements** | Six predefined badges; unlock state in context. |
| **API** | `useGamification()` and `addSavedMeal(count)`. |
| **UI** | Homepage impact card + achievements row; extensible to other screens. |

For code-level details, see `src/context/GamificationContext.jsx` and `src/pages/Homepage.jsx`.
