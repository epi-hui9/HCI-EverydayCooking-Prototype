# Earthplate — Release Notes

**Demo:** https://hci-everyday-cooking-prototype.vercel.app

## Current (2026-03)

- **27 recipes** (removed Broccoli Milk Soup) + **AI generation** when no matches: 2 recipes strict (selected only) + 1 with fridge extras
- **Stricter matching:** Recipe must use at least (N−2) of N selected ingredients; Strict = selected only; Good = selected + up to 2 extras. Triggers AI generation when many ingredients selected.
- **AI recipe steps:** Steps parser now handles inline format ("1. A. 2. B. 3. C") so AI-generated instructions render as separate steps
- **Dietary restrictions:** On Energy page (Fridge flow), optional chips: **No meat**, **No dairy**. Filters recipes and AI generation to exclude those ingredients
- **Star / save recipes:** Tap star on any recipe to save; **Saved** tile on Home shows count
- **15 default fridge items** — reset for all users via new storage key
- **Energy limits:** Low 30 min, Medium 50 min, High 999 min
- **Chat:** OpenAI (gpt-4o-mini); requires `OPENAI_API_KEY` in Vercel env for production
- **Gamification:** CO₂ saved with **relatable references** (km by car, drive time; UK Gov 2022 data), points, level, streak, achievements, $ saved from waste
- **Achievements:** Tap badges to open dialog with full list (unlocked + locked) and descriptions
- **Homepage:** Scrollable on small screens; compact impact card
- **Weekly Plan:** **Chicago timezone** (America/Chicago) for consistent dates; **multiple meals per day**; **Start Cooking** begins with today’s first planned meal
