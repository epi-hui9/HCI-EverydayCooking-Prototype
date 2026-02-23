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

- **Home:** Gamification dashboard (CO₂ saved, level, points, streak, progress to next level, achievements) and quick access to Fridge, Recipes, History, and Weekly Plan.
- **Fridge (Your Food):** List items with expiry dates; add and delete items; sort by expiring soon.
- **Recipes flow:** Select ingredients → set energy level → pick a recipe → open Chat for instructions.
- **Chat:** Ask questions about ingredients and recipes; suggested prompts; optional recipe context when coming from Recipe Details.
- **Navigation:** Four-tab bottom bar (Home, Fridge, Recipes, Chat), like a native mobile app. The active tab reflects the current (or logical) page; stack screens (Energy, Recipe Details) keep Recipes selected.

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
│   └── BottomNav.jsx          # Four-tab bottom navigation (Home, Fridge, Recipes, Chat)
├── context/
│   └── GamificationContext.jsx  # Food waste points, CO₂, level, streak, achievements
├── constants/
│   ├── navigation.js         # BOTTOM_NAV_TABS, getNavLabel, getActiveTabForPage
│   ├── energy.js             # MAX_MINUTES_BY_ENERGY, ENERGY_OPTIONS, ENERGY_BACKGROUNDS
│   └── theme.js              # HOMEPAGE_BUTTON_COLORS
├── data/
│   ├── ingredients.js        # INITIAL_INGREDIENTS
│   ├── recipes.js            # ALL_RECIPES
│   ├── recipeInstructions.js # RECIPE_INSTRUCTIONS (for chat)
│   └── chatSuggestions.js    # SUGGESTED_QUESTIONS
├── utils/
│   ├── recipe.js             # parseMinutes
│   └── chatbotAnswers.js     # Gemini AI streaming chat (+ fallback stub)
└── pages/
    ├── index.js              # Barrel export
    ├── Homepage.jsx          # Gamification + quick nav tiles
    ├── FridgeContent.jsx     # Fridge list and add form
    ├── RecipeSelectionPage.jsx   # Ingredient selection
    ├── EnergyLevelPage.jsx   # Energy check-in
    ├── RecipeDetailsPage.jsx # Recipe list and continue to chat
    ├── ChatbotInterface.jsx  # Chat UI
    └── PlaceholderPage.jsx   # History, Weekly Plan (coming soon)

docs/
└── GAMIFICATION.md            # Gamification design documentation
```

## Setup

```bash
npm install
```

### AI chat (Gemini — free tier)

The chatbot uses **Google Gemini 2.0 Flash** (free: 1,500 requests/day, 15 req/min).

1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) and create a free API key.
2. Create a `.env` file in the project root:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
3. Restart the dev server. The chat will stream real AI responses.

If no key is set the chat still works — it shows a setup reminder instead of crashing.

## Scripts

| Command           | Description              |
|-------------------|--------------------------|
| `npm run dev`     | Start development server |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build|
| `npm run lint`    | Run ESLint               |

## Main user flow

1. **Home** → Tap Fridge, Recipes, History, or Weekly Plan; or open Chat from the header.
2. **Fridge** → Add/remove items; Back goes to Home.
3. **Recipes** → Select ingredients → Next → **Energy** → **Recipe Details** → Next opens **Chat** with that recipe context. Back at each step goes to the previous screen.
4. **Chat** → Back returns to the page you came from (or Home).
5. Bottom bar is always visible; on Energy or Recipe Details, the **Recipes** tab stays selected.

## Gamification (food waste impact)

- **CO₂ saved:** Shown in kg for the current week (using food before it expires reduces waste-related emissions).
- **Level & points:** Points from “saved meals”; level increases every 100 points.
- **Streak:** Consecutive days with activity.
- **Achievements:** Badges (e.g. First Save, Eco Starter, streaks, levels); unlocked ones appear on the home card.

Logic lives in `GamificationContext`; the home page consumes it for the impact card and achievement badges. See **docs/GAMIFICATION.md** for full design documentation.
