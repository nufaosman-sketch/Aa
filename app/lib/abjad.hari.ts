/** Helper kecil untuk kad Hari Lemah/Kuat */
export type TaMode = "ha" | "ta";

/** Abjad kabir asas */
export const MAP: Record<string, number> = {
  "ا":1,"أ":1,"إ":1,"آ":1,"ء": 0,"ؤ":1,"ئ":1,
  "ب":2,"ج":3,"د":4,"ه":5,"ة": 0,"و": 0,"ز":7,"ح":8,"ط":9,
  "ي": 0,"ى":10,"ك":20,"ل":30,"م":40,"ن":50,"س":60,"ع":70,"ف":80,"ص":90,
  "ق":100,"ر":200,"ش":300,"ت":400,"ث":500,"خ":600,"ذ":700,"ض":800,"ظ":900,"غ":1000
};

export function normalizeJawi(input:string, ta:TaMode="ha"): string[] {
  const s = (input||"")
    .replace(/[^\u0600-\u06FF]/g,"")
    .replace(/[ًٌٍَُِْٰـۭۣۢۚۗۙۛۜ۟۠ۡۢۤۧۨ]/g,"");
  return [...s].map(ch=>{
    if (ch==="ة") return ta==="ta" ? "ت" : "ه";
    if (ch==="أ"||ch==="إ"||ch==="آ") return "ا";
    if (ch==="ى") return "ي";
    return ch;
  });
}

export function sumAbjad(chars:string[]):number {
  return chars.reduce((s,h)=> s + (MAP[h]||0), 0);
}

export const modWrap = (n:number, base:number) =>
  ((Math.trunc(n)-1)%base+base)%base+1;

/** Peta mod-7 → planet → hari kuat/lemah (ringkasan Shams/al-Būnī) */
export const PLANET7 = [
  {k:1, p:"Zuhal",    kuat:"Sabtu",  lemah:"Isnin",  nota:"Disiplin, elak murung & tangguh."},
  {k:2, p:"Musytari", kuat:"Khamis", lemah:"Rabu",   nota:"Syukur, elak boros/ghurur."},
  {k:3, p:"Marikh",   kuat:"Selasa", lemah:"Jumaat", nota:"Tenang, elak gopoh & marah."},
  {k:4, p:"Matahari", kuat:"Ahad",   lemah:"Sabtu",  nota:"Ikhlaskan niat, elak pamer."},
  {k:5, p:"Zuhrah",   kuat:"Jumaat", lemah:"Selasa", nota:"Jaga batas, elak lalai/hawa."},
  {k:6, p:"Utarid",   kuat:"Rabu",   lemah:"Khamis", nota:"Teliti tulisan/akad; elak keliru."},
  {k:7, p:"Bulan",    kuat:"Isnin",  lemah:"Ahad",   nota:"Stabilkan emosi & tidur."},
] as const;
