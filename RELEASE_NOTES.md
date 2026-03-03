# Earthplate — Release Notes

**Demo:** https://hci-everyday-cooking-prototype.vercel.app

## Current (2026-03)

- **28 recipes** with step-by-step instructions + **AI recipe generation** when no matches (3 recipes from fridge + selected ingredients)
- **Stricter matching:** Perfect (all in fridge) or Good (up to 2 missing); must use selected ingredients
- **Star / save recipes:** Tap star on any recipe to save; **Saved** tile on Home shows count
- **15 default fridge items** — reset for all users via new storage key
- **Energy limits:** Low 30 min, Medium 50 min, High 999 min
- **Chat:** OpenAI (gpt-4o-mini); requires `OPENAI_API_KEY` in Vercel env for production
- **Gamification:** CO₂ saved, points, level, streak, achievements, $ saved from waste
