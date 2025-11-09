import type { OverrideMap, Verdict } from "./kadKuning.table";

/** Tambah pasangan 1..9 → keputusan di sini.
 *  Contoh: (3,7) = 2 (dituntut menang) — telah disahkan
 */
export const KAD_KUNING_OVERRIDES: OverrideMap = {
  "3-7": 2,
  // === TODO ===
  // Tambah lagi ikut kad asal, contoh:
  // "3-3": 4,
  // "1-9": 5,
};
export default KAD_KUNING_OVERRIDES;
