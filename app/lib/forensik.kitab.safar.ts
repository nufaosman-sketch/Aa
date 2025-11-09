/**
 * أخبار السفر — Berita Perjalanan (asal kitab)
 * total = jumlahAbjad(nama) + nilaiHari(hari)
 * baki3 = jatuh tiga-tiga (1..3)
 * Tafsir:
 * 1 → tiada hajat / tak sesuai pergi
 * 2 → perjalanan baik
 * 3 → ada bahaya / mudarat
 */

export type HariMinggu = "Ahad" | "Isnin" | "Selasa" | "Rabu" | "Khamis" | "Jumaat" | "Sabtu";

const ABJAD_KABIR: Record<string, number> = {
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

function normArab(s: string): string {
  return (s||"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ؤ|ئ/g,"ء")
    .replace(/[^ابتثجحخدذرزسشصضطظعغفقكلمنهويءةآأؤإئى~]/g,"");
}

function jumlahAbjad(s: string): number {
  const t = normArab(s); let sum = 0;
  for (const ch of t) if (ABJAD_KABIR[ch] != null) sum += ABJAD_KABIR[ch];
  return sum;
}

const HARI_INDEX: Record<HariMinggu, number> =
  {Ahad:1,Isnin:2,Selasa:3,Rabu:4,Khamis:5,Jumaat:6,Sabtu:7};

function nilaiHari(h: HariMinggu): number { return HARI_INDEX[h]; }

function mod3_1to3(x: number): number { const r=((x%3)+3)%3; return r===0?3:r; }

function hisabSafar(params: { nama: string; hari: HariMinggu }) {
  const total = jumlahAbjad(params.nama) + nilaiHari(params.hari);
  const baki3 = mod3_1to3(total);
  return { total, baki3 };
}

function verdict(baki3: 1|2|3) {
  if (baki3 === 1) return { verdict: "Tidak sesuai", nota: "Tiada hajat / tidak elok bermusafir sekarang." } as const;
  if (baki3 === 2) return { verdict: "Baik", nota: "Perjalanan baik / diberkati." } as const;
  return { verdict: "Bahaya", nota: "Ada mudarat / bahaya dalam perjalanan." } as const;
}

const ForensikKitabSafar = {
  hisabSafar,
  verdict,
  // export util jika perlu
  jumlahAbjad,
  nilaiHari,
};

export default ForensikKitabSafar;
export type { HariMinggu };
