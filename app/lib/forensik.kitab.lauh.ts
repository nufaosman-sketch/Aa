/**
 * Bab اللوح — Lauh al-Hayah & al-Mamat 
 * total = jumlahAbjad(nama) + nilaiHari(hari ditanya) + hariBerlalu + 20
 * baki3  = jatuh tiga-tiga (1..3)
 */

export type HariMinggu = "Ahad" | "Isnin" | "Selasa" | "Rabu" | "Khamis" | "Jumaat" | "Sabtu";
export type LauhSemasa = "Hayah" | "Mamat";

const ABJAD_KABIR: Record<string, number> = {
  "ا":1,"ب":2,"ج":3,"د":4,"ه":5,"و":6,"ز":7,"ح":8,"ط":9,
  "ي":10,"ك":20,"ل":30,"م":40,"ن":50,"س":60,"ع":70,"ف":80,"ص":90,
  "ق":100,"ر":200,"ش":300,"ت":400,"ث":500,"خ":600,"ذ":700,"ض":800,"ظ":900,"غ":1000,
};

function normArab(s: string): string {
  return (s||"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ؤ|ئ/g,"ء")
    .replace(/[^ابتثجحخدذرزسشصضطظعغفقكلمنهوي]/g,"");
}
function jumlahAbjad(s: string): number {
  const t = normArab(s); let sum = 0;
  for (const ch of t) if (ABJAD_KABIR[ch] != null) sum += ABJAD_KABIR[ch];
  return sum;
}
function nilaiHariIndex(h: HariMinggu): number {
  const m: Record<HariMinggu, number> = {Ahad:1,Isnin:2,Selasa:3,Rabu:4,Khamis:5,Jumaat:6,Sabtu:7};
  return m[h];
}
function mod3_1to3(x: number): number { const r=((x%3)+3)%3; return r===0?3:r; }

function hisabLauhKitab(params: { nama: string; hari: HariMinggu; hariBerlaluDalamBulanArab: number; }) {
  const total = jumlahAbjad(params.nama)
    + nilaiHariIndex(params.hari)
    + Math.max(0, Math.floor(params.hariBerlaluDalamBulanArab))
    + 20;
  const baki3 = mod3_1to3(total);
  return { total, baki3 };
}

function reduceBy3ToMax(n: number, maxTarget: number): number {
  if (maxTarget <= 0) return n;
  while (n > maxTarget) n -= 3;
  return n;
}

function verdict(lauh: LauhSemasa) {
  return lauh === "Hayah"
    ? { verdict: "Hayah" as const, nota: "Urusan berhasil / sembuh / menang / hajat tercapai." }
    : { verdict: "Mamat" as const, nota: "Urusan gagal / mati / kalah / hajat tidak tercapai." };
}

const ForensikKitabLauh = {
  // util (private) tidak diexport, hanya yang perlu dipanggil kad
  hisabLauhKitab,
  reduceBy3ToMax,
  verdict,
};

export default ForensikKitabLauh;
// type-only exports dibenarkan (tidak ganggu pola default)
export type { HariMinggu, LauhSemasa };
