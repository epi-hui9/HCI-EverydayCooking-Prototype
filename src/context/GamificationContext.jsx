/**
 * Food waste gamification: points, CO₂ saved, level, streak, achievements.
 * Used across the app to show impact and encourage reducing waste.
 */
import { createContext, useContext, useCallback } from "react";
import { useLocalStorageState } from "../utils/useLocalStorageState";

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
  const [points, setPoints] = useLocalStorageState("ep.points", 340);
  const [co2SavedKg, setCo2SavedKg] = useLocalStorageState("ep.co2SavedKg", 12.4);
  const [moneySavedTotal, setMoneySavedTotal] = useLocalStorageState("ep.moneySavedTotal", 0);
  const [mealsSaved, setMealsSaved] = useLocalStorageState("ep.mealsSaved", 28);
  const [streakDays, setStreakDays] = useLocalStorageState("ep.streakDays", 5);
  const [lastActivityDate, setLastActivityDate] = useLocalStorageState(
    "ep.lastActivityDate",
    (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toDateString();
    })()
  );
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorageState(
    "ep.unlockedAchievements",
    ["first_save", "eco_10", "streak_3"]
  );
  const [cookingHistory, setCookingHistory] = useLocalStorageState("ep.cookingHistory", []);

  const level = Math.floor(points / POINTS_PER_LEVEL) + 1;
  const pointsInCurrentLevel = points % POINTS_PER_LEVEL;
  const pointsToNextLevel = POINTS_PER_LEVEL - pointsInCurrentLevel;

  const addSavedMeal = useCallback(
    (count = 1) => {
      const today = new Date().toDateString();

      setMealsSaved((n) => n + count);
      setCo2SavedKg((c) => Math.round((c + CO2_PER_MEAL_SAVED_KG * count) * 10) / 10);
      setPoints((p) => p + POINTS_PER_MEAL_SAVED * count);

      // Streak logic: if last activity was yesterday, increment; if not, reset to 1
      setStreakDays((s) => {
        const last = lastActivityDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (last === yesterday.toDateString()) return s + 1;
        if (last === today) return s;
        return 1;
      });

      setLastActivityDate(today);

      // Unlock achievements (minimal, deterministic)
      setUnlockedAchievements((prev) => {
        const next = new Set(prev);

        // first save
        if (mealsSaved + count >= 1) next.add("first_save");

        // co2 milestones
        const nextCo2 = Math.round((co2SavedKg + CO2_PER_MEAL_SAVED_KG * count) * 10) / 10;
        if (nextCo2 >= 10) next.add("eco_10");

        // streak milestones (based on updated streakDays calculation approximation)
        const last = lastActivityDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let nextStreak = 1;
        if (last === yesterday.toDateString()) nextStreak = streakDays + 1;
        else if (last === today) nextStreak = streakDays;

        if (nextStreak >= 3) next.add("streak_3");
        if (nextStreak >= 7) next.add("streak_7");

        // level milestones (based on updated points)
        const nextPoints = points + POINTS_PER_MEAL_SAVED * count;
        const nextLevel = Math.floor(nextPoints / POINTS_PER_LEVEL) + 1;
        if (nextLevel >= 3) next.add("level_3");
        if (nextLevel >= 5) next.add("level_5");

        return Array.from(next);
      });
    },
    [lastActivityDate, mealsSaved, co2SavedKg, streakDays, points, setMealsSaved, setCo2SavedKg, setPoints, setStreakDays, setLastActivityDate, setUnlockedAchievements]
  );

  const getAchievements = useCallback(() => {
    return ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: unlockedAchievements.includes(a.id),
    }));
  }, [unlockedAchievements]);

  const addToHistory = useCallback(
    (entry) => {
      const moneySaved = entry.moneySaved ?? 0;
      const item = {
        id: Date.now(),
        date: new Date().toISOString(),
        recipeName: entry.recipeName ?? "Meal",
        co2Saved: entry.co2Saved ?? CO2_PER_MEAL_SAVED_KG,
        pointsEarned: entry.pointsEarned ?? POINTS_PER_MEAL_SAVED,
        savedFromWaste: entry.savedFromWaste ?? false,
        moneySaved,
      };
      setCookingHistory((prev) => [item, ...(Array.isArray(prev) ? prev : [])].slice(0, 100));
      if (moneySaved > 0) {
        setMoneySavedTotal((m) => Math.round((m + moneySaved) * 100) / 100);
      }
    },
    [setCookingHistory, setMoneySavedTotal]
  );

  const getCookingHistory = useCallback(() => {
    return Array.isArray(cookingHistory) ? cookingHistory : [];
  }, [cookingHistory]);

  const value = {
    points,
    level,
    co2SavedKg,
    moneySavedTotal,
    mealsSaved,
    streakDays,
    pointsInCurrentLevel,
    pointsToNextLevel,
    POINTS_PER_LEVEL,
    addSavedMeal,
    addToHistory,
    getAchievements,
    getCookingHistory,
  };

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
}