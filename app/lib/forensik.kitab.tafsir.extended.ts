export const PLANET_HARI: Record<string,string> = {
  Ahad: "Syams",
  Isnin: "Qamar",
  Selasa: "Marikh",
  Rabu: "Utarid",
  Khamis: "Musytari",
  Jumaat: "Zuhrah",
  Sabt: "Zuhal"
};

export const BURUJ_UNSUR: Record<string, any> = {
  hamal: { unsur: "Api", sifat: ["pantas","berani","emosi","keras kepala"] },
  thawr: { unsur: "Tanah", sifat: ["tenang","praktikal","berhati-hati","stabil"] },
  jawza: { unsur: "Udara", sifat: ["analitik","cepat belajar","mudah berubah","ingin tahu"] },
  sartan: { unsur: "Air", sifat: ["sensitif","pengasih","intuitif","setia"] },
  asad: { unsur: "Api", sifat: ["pemimpin","berwibawa","ego tinggi","bersemangat"] },
  sunbulah: { unsur: "Tanah", sifat: ["teratur","detail","amanah","berfikir panjang"] },
  mizan: { unsur: "Udara", sifat: ["adil","diplomatik","berhati lembut","suka damai"] },
  aqrab: { unsur: "Air", sifat: ["misterius","emosi dalam","pengaruh kuat","intuitif tinggi"] },
  qaws: { unsur: "Api", sifat: ["petualang","optimis","suka kebebasan","berfalsafah"] },
  jady: { unsur: "Tanah", sifat: ["berdisiplin","kerja keras","terancang","berprinsip"] },
  dalw: { unsur: "Udara", sifat: ["inovatif","unik","berpandangan jauh","dermawan"] },
  hut: { unsur: "Air", sifat: ["pengasih","artistik","empati tinggi","mudah terpengaruh"] }
};

export function explainPlanetHari(planet: string, day: string) {
  const table: Record<string,string> = {
    Syams: "hari Ahad — tenaga raja, kemegahan, dan kepimpinan. Waktu sesuai untuk urusan kebesaran dan cita-cita.",
    Qamar: "hari Isnin — kelembutan, intuisi, dan rahsia. Baik untuk memulakan niat dengan hati bersih.",
    Marikh: "hari Selasa — keberanian, peperangan, pertahanan, dan tenaga jasad. Elakkan permusuhan.",
    Utarid: "hari Rabu — ilmu, logik, dan perdagangan. Baik untuk belajar dan menulis.",
    Musytari: "hari Khamis — hikmah, rezeki, keberkatan, dan perjalanan jauh.",
    Zuhrah: "hari Jumaat — kasih, seni, kecantikan, dan penyatuan hati.",
    Zuhal: "hari Sabtu — keteguhan, ujian, dan urusan berat duniawi; baik untuk sabar & muhasabah."
  };
  return table[planet] || `Hari ${day} di bawah planet ${planet}.`;
}

export function explainBurujUnsur(buruj: string) {
  const u = BURUJ_UNSUR[buruj];
  return u ? `Buruj ${buruj} termasuk unsur ${u.unsur} — ${u.sifat.join(", ")}.` : "-";
}

export function explainJamMasa() {
  return "Jam-jam mengikut turutan planet klasik: Syams, Zuhrah, Utarid, Qamar, Musytari, Marikh, Zuhal — berulang setiap 7 jam.";
}
