/**
 * app/lib/forensik.kitab.hamil.ts
 * Sila kekalkan API yang card gunakan.
 * — HANYA nilai huruf dikemas kini (JommalMapping) seperti diminta user.
 * — Eksport dipulihkan: BulanHijri, BULAN_HIJRI_ARAB, hisabWanitaHamil(...)
 */

/* ===================== NILAI HURUF (JOMMAL) ===================== */
export const JommalMapping: Record<string, number> = {
  "~": 2,
  "ء": 1,
  "آ": 2,
  "أ": 1,
  "ؤ": 6,
  "إ": 1,
  "ئ": 10,
  "ا": 1,
  "ب": 2,
  "ة": 5,
  "ت": 400,
  "ث": 500,
  "ج": 3,
  "ح": 8,
  "خ": 600,
  "د": 4,
  "ذ": 700,
  "ر": 200,
  "ز": 7,
  "س": 60,
  "ش": 300,
  "ص": 90,
  "ض": 800,
  "ط": 9,
  "ظ": 900,
  "ع": 70,
  "غ": 1,
  "ف": 80,
  "ق": 100,
  "ك": 20,
  "ل": 30,
  "م": 40,
  "ن": 50,
  "ه": 5,
  "و": 6,
  "ى": 10,
  "ي": 10
};

export const IgnoredChars = [" ", "ً", "ٌ", "ٍ", "َ", "ُ", "ِ", "ّ"];

export function kiraJommal(teks: string): number {
  let sum = 0;
  for (const ch of teks || "") {
    if (IgnoredChars.includes(ch)) continue;
    sum += JommalMapping[ch] ?? 0;
  }
  return sum;
}

/* ===================== BULAN API (SEPADAN DENGAN CARD) ===================== */
/** Type tepat sebagaimana card senaraikan (dengan ruang & ejaan Melayu) */
export type BulanHijri =
  | "Muharram" | "Safar"
  | "Rabiul Awwal" | "Rabiul Akhir"
  | "Jamadil Awwal" | "Jamadil Akhir"
  | "Rejab" | "Syaaban" | "Ramadhan" | "Syawal"
  | "Zulkaedah" | "Zulhijjah";

/** Map paparan Arab yang card akses sebagai BULAN_HIJRI_ARAB[bulan] */
export const BULAN_HIJRI_ARAB: Record<BulanHijri, string> = {
  "Muharram":        "محرم",
  "Safar":           "صفر",
  "Rabiul Awwal":    "ربيع الأول",
  "Rabiul Akhir":    "ربيع الآخر",
  "Jamadil Awwal":   "جمادى الأولى",
  "Jamadil Akhir":   "جمادى الآخرة",
  "Rejab":           "رجب",
  "Syaaban":         "شعبان",
  "Ramadhan":        "رمضان",
  "Syawal":          "شوال",
  "Zulkaedah":       "ذو القعدة",
  "Zulhijjah":       "ذو الحجة"
};

/* ===================== HISAB HAMIL (MEDAN SESUAI CARD) ===================== */
/**
 * Formula klasik: (nilai nama ibu) + (nilai bulan hijri ARAB) → mod 9.
 * Ganjil = غلام, Genap = أنثى.
 * Pulangkan semua medan yang card paparkan.
 */
export function hisabWanitaHamil(namaWanita: string, bulan: BulanHijri) {
  const namaArab = (namaWanita || "").trim();
  const bulanArab = BULAN_HIJRI_ARAB[bulan] || "";

  const namaVal  = kiraJommal(namaArab);
  const bulanVal = kiraJommal(bulanArab);
  const total    = namaVal + bulanVal;
  const baki9    = total % 9;

  const jantina  = (baki9 % 2 === 1) ? "غلام (Lelaki)" : "أنثى (Perempuan)";

  return { namaArab, namaVal, bulanVal, total, baki9, jantina };
}

export default { kiraJommal, hisabWanitaHamil, BULAN_HIJRI_ARAB };
