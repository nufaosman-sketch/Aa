import { PLANET_HARI, explainPlanetHari } from "./forensik.kitab.tafsir.extended";
import { BURUJ_UNSUR, explainBurujUnsur } from "./forensik.kitab.tafsir.extended";
import { explainJamMasa } from "./forensik.kitab.tafsir.extended";
import { ROH_TAFSIR, explainHayahMamat } from "./forensik.kitab.rohani.map";

export const DAYS = ["Ahad","Isnin","Selasa","Rabu","Khamis","Jumaat","Sabt"];
export const BURUJ = ["hamal","thawr","jawza","sartan","asad","sunbulah","mizan","aqrab","qaws","jady","dalw","hut"];

export const KitabBase = { DAYS, BURUJ };

export function analyzeFromBook({ reduce54, birthBuruj, birthDay }: any) {
  const lauh = reduce54 <= 27 ? "Hayah" : "Mamat";
  const lauhSummary = explainHayahMamat(lauh, reduce54);

  const unsurSet = BURUJ_UNSUR[birthBuruj as keyof typeof BURUJ_UNSUR] ?? {};
  const unsur = unsurSet?.unsur ?? "-";
  const unsurSifat = unsurSet?.sifat ?? [];

  const planetHari = PLANET_HARI[birthDay as keyof typeof PLANET_HARI] ?? "-";
  const planetHariFull = explainPlanetHari(planetHari, birthDay);
  const unsurFull = explainBurujUnsur(birthBuruj);
  const masaFull = explainJamMasa();

  const catatan = [
    "Kiraan asas kitab: Jumlah Nama + Hari + Buruj + Jam → reduce 54.",
    "1–27 = Hayah; 28–54 = Mamat.",
    "Buruj dibahagi unsur Api / Tanah / Udara / Air; mempengaruhi mizaj dan tabiat.",
    "Hari ditadbir 7 planet: Syams, Qamar, Marikh, Utarid, Musytari, Zuhrah, Zuhal.",
  ];

  return {
    lauh,
    lauhSummary,
    unsur,
    unsurSifat,
    planetHari,
    planetHariFull,
    unsurFull,
    masaFull,
    catatan,
  };
}

export default KitabBase;
