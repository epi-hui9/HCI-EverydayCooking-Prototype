# Earthplate — Release Notes

**Demo:** https://hci-everyday-cooking-prototype.vercel.app

## Current (2026-03)

- **28 recipes** with step-by-step instructions (Egg Fried Rice, Pasta with Spinach & Garlic, Mushroom Garlic Sauté, Chicken Carrot Stir-fry, etc.)
- **15 default fridge items** (Spinach, Garlic, Beef, Onions, Eggs, Milk, Chicken, Tomato, Broccoli, Cheese, Rice, Pasta, Butter, Carrots, Mushrooms) — reset for all users via new storage key
- **Recipe filtering** by selected ingredients; fallback when &lt; 4 matches
- **Energy limits:** Low 30 min, Medium 50 min, High 999 min
- **Chat:** OpenAI (gpt-4o-mini); requires `OPENAI_API_KEY` in Vercel env for production
- **Gamification:** CO₂ saved, points, level, streak, achievements, $ saved from waste
