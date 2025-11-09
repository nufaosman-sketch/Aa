/** Registry contoh — Kiraan: Nama + Hari + Buruj + Jam -> reduce to 54 (tanpa Nama Ibu) */
type NumMap = Record<string, number>;

const HURUF: NumMap = {
  "ا":1, "ب":2, "ج":3, "د":4, "ه":5, "و":6, "ز":7, "ح":8, "ط":9, "ي":10,
  "ك":20, "ل":30, "م":40, "ن":50, "س":60, "ع":70, "ف":80, "ص":90, "ق":100,
  "ر":200, "ش":300, "ت":400, "ث":500, "خ":600, "ذ":700, "ض":800, "ظ":900, "غ":1000,
};
const DAY_CODE: NumMap = { "Ahad":1, "Isnin":2, "Selasa":3, "Rabu":4, "Khamis":5, "Jumaat":6, "Sabt":7 };
const BURUJ_CODE: NumMap = { "hamal":1, "thawr":2, "jawza":3, "sartan":4, "asad":5, "sunbulah":6, "mizan":7, "aqrab":8, "qaws":9, "jady":10, "dalw":11, "hut":12 };
const HOUR_CODE = (h?: number) => (h && h>=1 && h<=12 ? h : 0);
function sumName(s?: string){ if(!s) return 0; let t=0; for (const ch of (s||"").replace(/\s+/g,"")) t+=(HURUF[ch]??0); return t; }
function reduceTo54(n: number){ const r=n%54; return r===0?54:r; }

const registryExample = {
  computeTo54FromAll: ({ name, birthDay, birthBuruj, birthHour }: any) => {
    const base = sumName(name);
    const day  = DAY_CODE[birthDay as string] || 0;
    const brj  = BURUJ_CODE[birthBuruj as string] || 0;
    const hr   = HOUR_CODE(birthHour);
    return reduceTo54(base + day + brj + hr);
  },
  analyzeProfile: ({ reduce54 }: any) => {
    if (!reduce54) return null;
    const lauh = reduce54 <= 27 ? "Hayah" : "Mamat";
    return {
      lauh,
      summary: `Nilai ${reduce54} jatuh pada Lauh ${lauh}.`,
      tips: lauh === "Hayah" ? ["Manfaatkan hari Sa'id", "Fokus musim Rabī'/Ṣayf"] : ["Jaga hari Nahs", "Kuatkan tazkiyah"],
      colors: lauh === "Hayah" ? ["emas","merah"] : ["biru tua","hitam"],
    };
  },
};
export default registryExample;
