import { MUSIM_4, explainMusimDanArah } from "./forensik.kitab.musim.arah";

/** Peta bulan Hijri kepada musim */
export const BULAN_MUSIM: Record<number,string> = {
  1: "shita",  2: "shita",    // Muharram, Safar — musim sejuk
  3: "rabii",  4: "rabii",    // Rabi‘ I & II — musim bunga
  5: "sayf",   6: "sayf",     // Jumādā I & II — musim panas
  7: "sayf",   8: "kharif",   // Rajab & Sha‘bān — transisi panas → gugur
  9: "kharif", 10: "shita",   // Ramaḍān & Shawwāl — gugur → sejuk
  11: "shita", 12: "shita"    // Dhū al-Qa‘dah & Dhū al-Ḥijjah — sejuk tetap
};

/** Dapatkan tafsir musim ikut bulan Hijri */
export function tafsirMusimDariBulan(bulanHijri:number){
  const key = BULAN_MUSIM[bulanHijri];
  if(!key) return "Bulan tidak dikenali.";
  return explainMusimDanArah(key);
}
