/**
 * Parse a time string like "10 min" to minutes (number).
 */
export function parseMinutes(str) {
  if (!str) return 0;
  const n = parseInt(String(str).replace(/\D/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}
