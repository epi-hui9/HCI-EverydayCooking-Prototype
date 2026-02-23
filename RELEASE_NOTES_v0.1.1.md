# Earthplate — v0.1.1 (Prototype) Release Notes

Release date: 2026-02-22
Public demo URL: https://hci-everyday-cooking-prototype.vercel.app

## What this release accomplishes

This is the first “real” end-to-end prototype that can be tested remotely on both desktop and mobile:

* A working Cooking Assistant (LLM connected) with a clean, minimalist response style
* A usable fridge/ingredient flow with persistence (data does not disappear on refresh or quick navigation)
* A recipe selection experience that avoids dead-ends (shows suggestions even when no exact match)
* A basic “complete cooking” loop that updates gamification values (points/CO₂/streak) and provides user feedback

## Key features shipped

### 1) Real LLM chatbot (remote, production-ish)

* Chatbot now calls a deployed API service, which proxies to Hugging Face (Mistral).
* Front-end uses `VITE_API_BASE` to route requests to the deployed backend.
* Added clearer error handling for debugging and stability.

### 2) Persistence (localStorage) for “Your Food”

* Fridge items are stored in localStorage so they persist across:

  * page refresh
  * navigation between tabs/pages
* Local storage writes are made synchronous to prevent data loss when navigating quickly.

### 3) Recipe matching improvements (no more “0 matches” dead-end)

* When exact matches are unavailable, the UI shows “Suggested” recipes based on partial ingredient overlap.
* Missing ingredients are displayed to guide the user.

### 4) Cooking completion & gamification feedback

* Added a “Complete cooking” action in Chat.
* Completing cooking:

  * increments saved-meal metrics (points/CO₂/streak)
  * displays an in-app overlay feedback panel (kept inside the phone frame on desktop)

## Deployment / Ops notes

* Frontend: Vercel (public URL above)
* Backend API: Render (free tier; first request may be slow due to cold start)
* Model: Hugging Face Router → `mistralai/Mistral-7B-Instruct-v0.2`
* Node install compatibility: `.npmrc` sets `legacy-peer-deps=true` for CI/CD stability

## Known limitations / next fixes

* UI polish: spacing/typography micro-adjustments; remove debug “API:” line for final demo
* Gamification: richer achievement logic + more explicit “Back to Home” flow
* Productization: user accounts + true cross-device sync are out of scope for this class prototype

## Files touched (high level)

* Chat: `src/pages/ChatbotInterface.jsx`, `src/utils/chatbotAnswers.js`
* Persistence: `src/utils/useLocalStorageState.js`, `src/pages/FridgeContent.jsx`
* Recipe matching: `src/pages/RecipeDetailsPage.jsx`
* Deployment: `server.js`, `.npmrc`, `package.json`
