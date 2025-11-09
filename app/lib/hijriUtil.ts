/**
 * getHijriDay() — returns Hijri day-of-month (1..30) based on system date.
 * Uses "hijri-date" package if present; otherwise falls back to a light
 * tabular approximation (not for fiqh, but OK for symbolic manāzil use).
 */
export function getHijriDay(): number {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const HijriDate = require("hijri-date");
    const h = new HijriDate();
    const d = Number(h.getDate?.() ?? h.date ?? 0) || 30;
    return ((d - 1) % 30) + 1;
  } catch {
    // --- lightweight approx (Kuwaiti/tabular-ish) ---
    const g = new Date();
    const jd = Math.floor((g.getTime() / 86400000) + 2440587.5);
    const islamic = jd - 1948439 + 10632;
    const n = Math.floor((islamic - 1) / 10631);
    const r = islamic - 10631 * n;
    const j = Math.floor((r - 1) / 354.36667);
    const y = 30 * n + j;
    const yStart = Math.floor((11 * y + 3) / 30) + 354 * y + 1948439;
    const dayOfYear = jd - yStart + 1;
    const d = ((dayOfYear % 30) + 30) % 30 || 30;
    return d;
  }
}
