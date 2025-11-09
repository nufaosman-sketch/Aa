export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  try {
    const u = new URL(input.trim());
    if (u.hostname.includes("youtu.be")) return u.pathname.split("/").filter(Boolean)[0] || null;
    const v = u.searchParams.get("v");
    if (v) return v;
    const p = u.pathname.split("/").filter(Boolean);
    const i = p.findIndex((x) => x === "shorts" || x === "embed");
    if (i >= 0 && p[i + 1]) return p[i + 1];
    return null;
  } catch {
    return /^[A-Za-z0-9_-]{6,}$/.test(input) ? input : null;
  }
}
export const ytThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
