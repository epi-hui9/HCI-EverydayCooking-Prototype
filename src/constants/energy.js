/**
 * Energy level → max total cook time (minutes). Inclusive: high includes medium and low, etc.
 */
export const MAX_MINUTES_BY_ENERGY = {
  low: 15,
  medium: 40,
  high: 999,
};

import { PALETTE } from "../theme";

export const ENERGY_BACKGROUNDS = {
  low: "#F0F2EB",
  medium: PALETTE.cream,
  high: "#F5F0E8",
};

/** Options for the energy check-in page */
export const ENERGY_OPTIONS = [
  { id: "low", label: "Low", description: "Reheat or assemble.", size: "50px" },
  { id: "medium", label: "Medium", description: "Simple, one-pan.", size: "68px" },
  { id: "high", label: "High", description: "Up for cooking.", size: "84px" },
];
