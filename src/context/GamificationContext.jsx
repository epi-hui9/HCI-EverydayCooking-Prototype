/**
 * Food waste gamification: points, CO₂ saved, level, streak, achievements.
 * Used across the app to show impact and encourage reducing waste.
 */
import { createContext, useContext, useState, useCallback } from "react";

const CO2_PER_MEAL_SAVED_KG = 0.5;
const POINTS_PER_MEAL_SAVED = 10;
const POINTS_PER_LEVEL = 100;

const ACHIEVEMENTS = [
  { id: "first_save", name: "First Save", desc: "Logged your first saved meal", icon: "🌱", required: 1 },
  { id: "eco_10", name: "Eco Starter", desc: "Saved 10 kg CO₂", icon: "🍃", required: 10 },
  { id: "streak_3", name: "On a Roll", desc: "3-day streak", icon: "🔥", required: 3 },
  { id: "streak_7", name: "Week Warrior", desc: "7-day streak", icon: "⭐", required: 7 },
  { id: "level_3", name: "Planet Helper", desc: "Reached Level 3", icon: "🌍", required: 3 },
  { id: "level_5", name: "Waste Fighter", desc: "Reached Level 5", icon: "🏆", required: 5 },
];

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const [points, setPoints] = useState(340);
  const [co2SavedKg, setCo2SavedKg] = useState(12.4);
  const [mealsSaved, setMealsSaved] = useState(28);
  const [streakDays, setStreakDays] = useState(5);
  const [lastActivityDate, setLastActivityDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toDateString();
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState(["first_save", "eco_10", "streak_3"]);

  const level = Math.floor(points / POINTS_PER_LEVEL) + 1;
  const pointsInCurrentLevel = points % POINTS_PER_LEVEL;
  const pointsToNextLevel = POINTS_PER_LEVEL - pointsInCurrentLevel;

  const addSavedMeal = useCallback((count = 1) => {
    setMealsSaved((n) => n + count);
    setCo2SavedKg((c) => Math.round((c + CO2_PER_MEAL_SAVED_KG * count) * 10) / 10);
    setPoints((p) => p + POINTS_PER_MEAL_SAVED * count);
    const today = new Date().toDateString();
    setLastActivityDate(today);
    // Streak logic: if last activity was yesterday, increment; if not, reset to 1
    setStreakDays((s) => {
      const last = lastActivityDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (last === yesterday.toDateString()) return s + 1;
      if (last === today) return s;
      return 1;
    });
  }, [lastActivityDate]);

  const getAchievements = useCallback(() => {
    return ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: unlockedAchievements.includes(a.id),
    }));
  }, [unlockedAchievements]);

  const value = {
    points,
    level,
    co2SavedKg,
    mealsSaved,
    streakDays,
    pointsInCurrentLevel,
    pointsToNextLevel,
    POINTS_PER_LEVEL,
    addSavedMeal,
    getAchievements,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
}
