/**
 * Chicago timezone helpers. App uses America/Chicago for consistent dates
 * (avoids UTC/local mismatch when user is in a different timezone).
 */
const TZ = "America/Chicago";

/** Current date in Chicago as YYYY-MM-DD */
export function getTodayInChicago() {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

/** Convert Date or date string to YYYY-MM-DD in Chicago */
export function toDateKeyChicago(d) {
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  return d.toLocaleDateString("en-CA", { timeZone: TZ });
}

/** Parse dateKey as noon UTC so it falls in the correct calendar day in Chicago */
function dateKeyToDate(dateKey) {
  return new Date(dateKey + "T12:00:00.000Z");
}

/** Get weekday (0=Sun..6=Sat) for a date string */
function getDayOfWeekChicago(dateKey) {
  return dateKeyToDate(dateKey).getUTCDay();
}

/** Format dateKey as "Mar 9" in Chicago */
export function formatDateChicago(dateKey) {
  return dateKeyToDate(dateKey).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: TZ });
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Get weekday short name for dateKey (Mon, Tue, ...) */
export function getDayNameChicago(dateKey) {
  const dow = getDayOfWeekChicago(dateKey);
  return DAY_NAMES[dow === 0 ? 6 : dow - 1];
}

/** Week dates (Mon–Sun) in Chicago. Returns [{ dateKey, dayName, dateStr }] */
export function getWeekDatesChicago() {
  const todayStr = getTodayInChicago();
  const [y, m, d] = todayStr.split("-").map(Number);
  const todayDate = new Date(y, m - 1, d);
  const dayOfWeek = todayDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(todayDate);
  monday.setDate(todayDate.getDate() + mondayOffset);

  const result = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    const dateKey = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    result.push({
      dateKey,
      dayName: getDayNameChicago(dateKey),
      dateStr: formatDateChicago(dateKey),
    });
  }
  return result;
}
