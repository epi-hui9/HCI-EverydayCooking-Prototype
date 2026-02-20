# Earthplate — HCI Everyday Cooking Prototype

## Overview

**Earthplate** is a mobile-first prototype for everyday cooking and reducing food waste. It helps users use what they have on hand, choose recipes that match their energy level, and get step-by-step support via an in-app chatbot. The app includes a **food waste gamification** system: users see their impact (CO₂ saved, points, level, streak) and achievements.

This repo is a **team prototype** for the course **Human Computer Interaction (HCI), Winter 2026**.

## Features

- **Home:** Gamification dashboard (CO₂ saved, level, points, streak, progress to next level, achievements) and quick access to Fridge, Recipes, History, and Weekly Plan.
- **Fridge (Your Food):** List items with expiry dates; add and delete items; sort by expiring soon.
- **Recipes flow:** Select ingredients → set energy level → pick a recipe → open Chat for instructions.
- **Chat:** Ask questions about ingredients and recipes; suggested prompts; optional recipe context when coming from Recipe Details.
- **Navigation:** Four-tab bottom bar (Home, Fridge, Recipes, Chat), like a native mobile app. The active tab reflects the current (or logical) page; stack screens (Energy, Recipe Details) keep Recipes selected.

## Design

- **Layout:** The UI is inside a **phone-like app frame** (393×852 px, 4px corner radius) on a distinct outer background so the app feels like a contained experience. Content area has top/side padding; the bottom nav bar is full-width and flush to the left, right, and bottom edges. Scrollbar is hidden.
- **Color scheme:** Warm neutrals — cream `#fefae0`, warm beige `#faedcd`, sage `#ccd5ae`, sage light `#e9edc9`, primary brown `#d4a373`. Gamification card uses a green gradient (`#5a7a6a`).
- **Typography:** Nunito.
- **Stack:** React, **Material UI (MUI)**, Vite.

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
│   └── chatbotAnswers.js     # getAnswer (stub)
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
