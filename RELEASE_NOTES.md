# Earthplate — Release Notes

**Demo:** https://hci-everyday-cooking-prototype.vercel.app

## Current (2026-03)

- **28 recipes** + **AI generation** when no matches: 2 recipes strict (selected only) + 1 with fridge extras
- **Stricter matching:** Strict = recipe uses ONLY selected ingredients; Good = selected + up to 2 extras from fridge
- **Dietary restrictions:** On Energy page (Fridge flow), optional chips: **No meat**, **No dairy**. Filters recipes and AI generation to exclude those ingredients
- **Star / save recipes:** Tap star on any recipe to save; **Saved** tile on Home shows count
- **15 default fridge items** — reset for all users via new storage key
- **Energy limits:** Low 30 min, Medium 50 min, High 999 min
- **Chat:** OpenAI (gpt-4o-mini); requires `OPENAI_API_KEY` in Vercel env for production
- **Gamification:** CO₂ saved, points, level, streak, achievements, $ saved from waste
