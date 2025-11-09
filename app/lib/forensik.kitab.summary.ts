import { analyzeFromBook } from "./forensik.kitab.base";
import { tafsirMusimDariBulan } from "./forensik.kitab.musim.hijri";
import { explainMizaj } from "./forensik.kitab.mizaj";

/** Gabungan tafsir kitab penuh + mizaj tubuh */
export function tafsirKitabPenuh({ reduce54, birthBuruj, birthDay, bulanHijri }: any) {
  const base = analyzeFromBook({ reduce54, birthBuruj, birthDay });
  const musimText = bulanHijri ? tafsirMusimDariBulan(bulanHijri) : null;
  const mizajText = base?.unsur && base?.planetHari
    ? explainMizaj(base.unsur, base.planetHari)
    : null;
  return { ...base, musimText, mizajText };
}
