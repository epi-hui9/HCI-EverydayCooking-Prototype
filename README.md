# HCI-EverydayCooking-Prototype

HCI prototype for everyday cooking: select ingredients, set energy level, browse recipes, and view step-by-step instructions in chat.

## Project structure

```
src/
├── App.jsx                 # Root: navigation state, flow, top bar
├── main.jsx                # Entry: ChakraProvider, theme
├── index.css               # Global styles
├── constants/              # App-wide config
│   ├── navigation.js       # NAV_ORDER, NAV_LABELS, getNavLabel
│   ├── energy.js           # MAX_MINUTES_BY_ENERGY, ENERGY_OPTIONS
│   └── theme.js            # HOMEPAGE_BUTTON_COLORS, etc.
├── data/                   # Static / hardcoded data
│   ├── ingredients.js      # INITIAL_INGREDIENTS
│   ├── recipes.js          # ALL_RECIPES
│   ├── recipeInstructions.js  # RECIPE_INSTRUCTIONS (for chat)
│   └── chatSuggestions.js  # SUGGESTED_QUESTIONS
├── utils/                  # Pure helpers
│   ├── recipe.js           # parseMinutes
│   └── chatbotAnswers.js  # getAnswer (stub)
└── pages/                  # Route-level UI
    ├── index.js            # Barrel export
    ├── Homepage.jsx
    ├── RecipeSelectionPage.jsx   # Ingredients selection
    ├── EnergyLevelPage.jsx
    ├── RecipeDetailsPage.jsx
    ├── FridgeContent.jsx
    ├── ChatbotInterface.jsx
    └── PlaceholderPage.jsx
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — ESLint
