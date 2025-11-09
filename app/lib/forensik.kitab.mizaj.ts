/**
 * Kitab Mizaj Tubuh — berdasarkan Bab al-Mizaj (m/s 22–23)
 * Gabungan unsur buruj + planet hari → sifat fizikal & rohani.
 */

export const MIZAJ_TABLE: Record<string, any> = {
  "Api": {
    Syams: { judul:"Panas Kering (Asyraq)", tafsir:"Tubuh hangat dan kuat semangat; roh berani dan mencari kemuliaan." },
    Marikh: { judul:"Panas Kering (Qahr)", tafsir:"Sifat pejuang; mudah marah tapi berani menegakkan kebenaran." },
  },
  "Tanah": {
    Zuhal: { judul:"Sejuk Kering (Wiqār)", tafsir:"Tubuh berat, tenang, tetap pada pendirian; roh tegas dan sabar dalam ujian." },
    Musytari: { judul:"Sejuk Kering (Hikmah)", tafsir:"Cenderung kepada ilmu dan keadilan; mampu menyembuhkan dan mendamaikan." },
  },
  "Udara": {
    Utarid: { judul:"Panas Lembap (Fikr)", tafsir:"Cepat faham, suka berbicara, fikiran bercabang, namun bijak berhujah." },
    Zuhrah: { judul:"Panas Lembap (Jamal)", tafsir:"Berbakat dalam seni dan daya tarikan; roh halus dan menyenangkan orang lain." },
  },
  "Air": {
    Qamar: { judul:"Sejuk Lembap (Latif)", tafsir:"Lembut hati dan penyayang; tubuh mudah terkesan dengan perasaan dan cuaca." },
    Zuhrah: { judul:"Sejuk Lembap (Hanān)", tafsir:"Suka menolong dan bersimpati; roh penuh rahmah dan keindahan batin." },
  },
};

/** Fungsi tafsir mizaj berdasarkan unsur + planet hari */
export function explainMizaj(unSur:string, planet:string){
  const group = MIZAJ_TABLE[unSur];
  if (!group) return `Unsur ${unSur} tidak dikenali.`;
  const m = group[planet];
  if (!m) return `Gabungan unsur ${unSur} dan planet ${planet} tiada dalam kitab.`;
  return `${m.judul} — ${m.tafsir}`;
}
