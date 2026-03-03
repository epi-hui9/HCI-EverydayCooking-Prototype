# Earthplate — HCI Everyday Cooking Prototype

## Overview

**Earthplate** is a mobile-first prototype for everyday cooking and reducing food waste. It helps users use what they have on hand, choose recipes that match their energy level, and get step-by-step support via an in-app chatbot. The app includes a **food waste gamification** system: users see their impact (CO₂ saved, points, level, streak) and achievements.

This repo is a **team prototype** for the course **Human Computer Interaction (HCI), Winter 2026**.

## Design Principle — Comfort First

> **Every interaction should feel comfortable, not impressive.**

This is the #1 rule for every design and engineering decision in Earthplate.

- **Short over thorough.** A 2-sentence answer the user actually reads beats a 10-paragraph essay they ignore. The AI assistant replies like a friend in the kitchen — warm, brief, actionable.
- **Obvious over clever.** If a user has to wonder "where do I tap?", we failed. Navigation, buttons, and flow should be self-evident.
- **Calm over exciting.** No flashy animations, no notification spam, no dark patterns. The app should feel like a quiet Sunday morning, not a Friday night.

This principle applies to code too: when in doubt, choose the simpler solution that's easier for users — even if it's less technically elegant.

## Features

- **Home:** Gamification dashboard (CO₂ saved, level, points, streak, progress to next level, achievements). **Start Cooking** hero tile (primary entry → Fridge) plus quick access to History, Weekly Plan, **Saved** (starred recipes). Money saved from waste shown subtly below the impact card.
- **Fridge (Your Food):** 15 default ingredients (expandable). Add/delete items; sort by expiring soon. **Add Food** with autocomplete and auto-fill (category, expiry from ingredient name). **Next** → Energy → Recipe Details (filtered by selected ingredients).
- **Recipes flow (two entry points):**
  - **From bottom nav Recipes tab:** Energy level first → Recipe Recommendation (3 recipes) → tap recipe → **Recipe Preview** (ingredients + steps) → **Start Cooking with AI** → Chat.
  - **From Start Cooking / Fridge:** Select ingredients → Energy → Recipe Details (strict = selected only; good = selected + up to 2 fridge extras; if none, **Generate 3 AI recipes**) → Recipe Preview → Chat. Star any recipe to save.
- **Food waste indicators:** Recipes and ingredients show "Uses soon-expiring" / "Use soon" when they help reduce waste.
- **History:** Cooking journey timeline — meals saved, CO₂ impact, $ saved. Each completed meal logs recipe, date, and impact. Empty state with Start Cooking CTA.
- **Weekly Plan:** Plan meals for the week (Mon–Sun). Tap a day to add/change recipe; modal stays inside phone frame on desktop. Shows "X expiring soon" from fridge.
- **Chat:** OpenAI-powered assistant; suggested prompts when no recipe selected; recipe context when cooking; **Complete cooking** overlay with Done → Home.
- **Navigation:** Four-tab bottom bar (Home, Fridge, Recipes, Chat). Back buttons return to previous screen; Chat Back returns to Recipe Preview when in cooking flow.

## Design

- **Layout:** The UI is inside an **iPhone-style app frame** (393×852 px, 44px corner radius) with a Dynamic Island notch and home indicator bar, on a subtle gradient outer background. Content scrolls beneath a frosted-glass bottom tab bar. Scrollbar is hidden.
- **Typography:** Apple system fonts (SF Pro Display / SF Pro Text via `-apple-system`).
- **Stack:** React 19, **Material UI (MUI) 7** (deeply customized for iOS aesthetics), Vite 7, Framer Motion.

### Brand color palette

The design uses **3 colors** chosen from the original 5-color Earthplate swatch, plus derived variants for accessibility and depth.

| Role | Hex | Name | Usage |
|------|-----|------|-------|
| **Primary action** | `#B8864F` | Bronze (dark) | All CTA buttons, active tab, links, selected-state borders, checkmarks. Derived from Light Bronze for white-text readability. |
| **Brand warmth** | `#D4A373` | Light Bronze | Decorative highlights, fire/streak icon, achievement trophy tint, progress accents. |
| **Eco / nature** | `#CCD5AE` | Tea Green | Impact card gradient base, achievement badge backgrounds, bot avatar, selected-row tints. |
| **Warm surface** | `#FEFAE0` | Cornsilk | Chat area background, tinted surfaces. |

Derived system colors (not brand — generated from the above):

| Token | Hex | Purpose |
|-------|-----|---------|
| `background` | `#FAFAF5` | App content background |
| `surface` | `#FFFFFF` | Cards, list containers |
| `surfaceSecondary` | `#F5F3EE` | Input fields, inactive cards |
| `ecoDeep` | `#5C6E48` | Impact card gradient mid |
| `ecoDark` | `#3D4E30` | Impact card gradient dark end |
| `textPrimary` | `#1C1C1E` | Headings, body text (iOS standard) |
| `textSecondary` | `#6E6E73` | Descriptions, metadata (iOS standard) |
| `textTertiary` | `#AEAEB2` | Placeholders, disabled (iOS standard) |
| `separator` | `rgba(60,60,67,0.12)` | 0.5px dividers (iOS standard) |

All colors are defined in `src/theme.js` → `PALETTE` and consumed app-wide.

## Project structure

```
src/
├── App.jsx                    # Root: app frame, navigation state, bottom bar
├── main.jsx                   # Entry: ThemeProvider, GamificationProvider, App
├── index.css                  # Global styles and CSS variables
├── theme.js                   # MUI theme and PALETTE
├── components/
│   ├── BottomNav.jsx         # Four-tab bottom navigation (Home, Fridge, Recipes, Chat)
│   └── PageHeader.jsx        # Shared page header component
├── context/
│   └── GamificationContext.jsx  # Food waste points, CO₂, level, streak, achievements
├── constants/
│   ├── navigation.js         # BOTTOM_NAV_TABS, getNavLabel, getActiveTabForPage
│   ├── energy.js             # MAX_MINUTES_BY_ENERGY, ENERGY_OPTIONS, ENERGY_BACKGROUNDS
│   └── theme.js              # HOMEPAGE_BUTTON_COLORS
├── data/
│   ├── ingredients.js       # INITIAL_INGREDIENTS, getDaysUntilExpiry, isExpiringSoon
│   ├── recipes.js            # ALL_RECIPES
│   ├── recipeInstructions.js # RECIPE_INSTRUCTIONS (for chat)
│   └── chatSuggestions.js    # SUGGESTED_QUESTIONS
├── utils/
│   ├── recipe.js             # parseMinutes
│   ├── recipeInstructions.js # parseRecipeSteps (step parsing)
│   ├── chatbotAnswers.js     # Chat → backend API (prompt + recipe context)
│   ├── recipeGenerator.js    # AI recipe generation (fridge + selected)
│   └── useSavedRecipes.js    # Star/save recipes (localStorage)
└── pages/
    ├── index.js              # Barrel export
    ├── Homepage.jsx          # Gamification + Start Cooking hero + quick nav tiles
    ├── FridgeContent.jsx     # Fridge list and add form
    ├── EnergyLevelPage.jsx   # Energy check-in (shared by both flows)
    ├── RecipeRecommendationPage.jsx  # 3 recommended recipes + Browse more
    ├── RecipeDetailsPage.jsx # Recipe list/details + Start Cooking
    ├── RecipePreviewPage.jsx # Ingredients + steps preview before Chat
    ├── ChatbotInterface.jsx  # Chat UI + Complete cooking overlay
    ├── HistoryPage.jsx       # Cooking journey, impact timeline
    ├── WeeklyPlanPage.jsx    # Week view, plan meals per day
    ├── SavedRecipesPage.jsx  # Starred recipes list
    └── PlaceholderPage.jsx   # Placeholder for future features

api/
├── chat.js                   # Vercel serverless (OpenAI chat)
└── recipes.js                # Vercel serverless (AI recipe generation)

docs/
└── GAMIFICATION.md           # Gamification design documentation
```

## Setup

```bash
npm install
```

### AI chat (backend + OpenAI)

The chatbot uses **OpenAI** (gpt-4o-mini by default) via:

- **Local dev:** Express backend (`server.js`) on port 3001
- **Vercel production:** Serverless function `api/chat.js` on the same domain

1. Get an OpenAI API key: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a `.env` file in the project root:
   ```
   OPENAI_API_KEY=sk-your_openai_key_here
   ```
3. **Local dev:** Start backend `npm run start` (port 3001), then frontend `npm run dev`. The frontend uses `VITE_API_BASE` (default `http://localhost:3001`).
4. **Vercel deploy:** Set `OPENAI_API_KEY` in Vercel project environment variables:
   - Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
   - Add `OPENAI_API_KEY` with your key, enable **Production**, **Preview**, **Development**
   - Redeploy after adding. Without it, Chat shows an error.

Optional: set `OPENAI_MODEL=gpt-4o` or `gpt-3.5-turbo` in `.env` (or Vercel env) to change the model.

Error handling: timeout (28s), clearer messages for network/server errors.

## Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start Vite dev server          |
| `npm run dev:all` | Start both backend + frontend (concurrently) |
| `npm run build`   | Production build (output: dist)|
| `npm run start`   | Start Express backend (port 3001) for local chat API |
| `npm run preview` | Preview production build       |
| `npm run lint`    | Run ESLint                     |

## Main user flow

1. **Home** → **Start Cooking** (hero tile) or History, Weekly Plan; or open Chat from the header. **Bottom nav** for Fridge, Recipes, Chat.
2. **Recipes flow (from bottom nav):** Energy → Recipe Recommendation (3 recipes) → tap recipe → Recipe Preview → Start Cooking with AI → Chat.
3. **Fridge flow:** Add/remove items → Next → Energy → Recipe Details (filtered by fridge) → Recipe Preview → Chat.
4. **Chat** → Back returns to Recipe Preview (when cooking) or previous page; **Complete cooking** → Done → Home.
5. Bottom bar is always visible; Recipes tab stays selected through Energy, Recipe Recommendation, Recipe Details.

## Gamification (food waste impact)

- **CO₂ saved:** Shown in kg for the current week (using food before it expires reduces waste-related emissions).
- **Money saved:** Estimated $ saved when using ingredients within 3 days of expiry; shown subtly below impact card and in History.
- **Level & points:** Points from “saved meals”; level increases every 100 points.
- **Streak:** Consecutive days with activity.
- **Achievements:** Badges (e.g. First Save, Eco Starter, streaks, levels); unlocked ones appear on the home card.

Logic lives in `GamificationContext`; the home page consumes it for the impact card and achievement badges. See **docs/GAMIFICATION.md** for full design documentation.

---

## For new contributors

**Quick start:** `npm install` → add `OPENAI_API_KEY` to `.env` → `npm run start` (terminal 1) → `npm run dev` (terminal 2) → open http://localhost:5173

**Key files:**
- `src/App.jsx` — routing, page state
- `src/theme.js` — colors, typography (PALETTE)
- `src/utils/chatbotAnswers.js` — chat → backend API (same-origin in prod)
- `server.js` — Express backend (local); `api/chat.js` — Vercel serverless
- `src/context/GamificationContext.jsx` — points, CO₂, streak

**Design:** Follow "Comfort First" (see above). Use PALETTE from `theme.js` for all colors. No new colors without updating README palette table.

---

## Deployment (Vercel)

- **Frontend + API:** Single Vercel project. `vercel.json` configures SPA rewrites and `api/chat.js` as a serverless function.
- **Environment:** Set `OPENAI_API_KEY` in Vercel project settings.
- **Build:** `npm run build` → `dist/`; API at `/api/chat` on the same domain.

## Release notes

See [RELEASE_NOTES.md](RELEASE_NOTES.md) for current features and updates.
