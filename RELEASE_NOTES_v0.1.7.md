# Earthplate — v0.1.7 (Prototype) Release Notes

Release date: 2026-03-02
Public demo URL: https://hci-everyday-cooking-prototype.vercel.app

## What this release accomplishes

This release fixes **"only 1 recipe"** regardless of ingredients or energy selection:

* **Relaxed energy limits:** Low 15→30 min, Medium 40→50 min — more recipes fit each energy level
* **Fallback when few matches:** If fewer than 4 recipes match, show more options (recipes using selected ingredients or fridge-matching, even if they exceed energy slightly)

## Key fixes

### 1) Energy limits

| Level | Before | After |
|-------|--------|-------|
| Low | 15 min | **30 min** |
| Medium | 40 min | **50 min** |
| High | 999 min | 999 min |

### 2) Fallback logic

| When | Fallback |
|------|----------|
| Selected ingredients + &lt; 4 matches | Add recipes that use selected ingredients (may exceed energy) |
| No selection (Browse more) + &lt; 4 matches | Add recipes that match fridge well |

Ensures 4–6 recipe options in most cases.

## Files touched (high level)

* `src/constants/energy.js` (MAX_MINUTES_BY_ENERGY)
* `src/pages/RecipeDetailsPage.jsx` (fallback logic)

## Known limitations

* Recipe Recommendation uses mock/sample logic.
* Weekly Plan does not yet suggest recipes based on expiring ingredients.
* Chat requires `OPENAI_API_KEY` in Vercel environment variables for production.
