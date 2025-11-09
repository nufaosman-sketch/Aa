/**
 * 🌤 Kitab Musim & Arah Angin — Bab akhir (m/s 21–23)
 * Berdasarkan fasal: فصل الفصول والرياح
 */

export const MUSIM_4 = {
  rabii: {
    nama: "Rabī‘ (Musim Bunga)",
    arah: "Timur",
    unsur: "Api",
    sifat: ["permulaan kehidupan", "pengembangan tenaga", "kehangatan jiwa"],
    tafsir:
      "Musim Rabī‘ berada di bawah unsur Api dan arah Timur — tanda kebangkitan dan pertumbuhan. Dikenal sebagai masa kesuburan, masa sesuai untuk ilmu, perniagaan, dan permulaan baru."
  },
  sayf: {
    nama: "Ṣayf (Musim Panas)",
    arah: "Selatan",
    unsur: "Udara",
    sifat: ["kelimpahan", "tenaga tinggi", "gerak aktif", "kekuatan jasad"],
    tafsir:
      "Musim Ṣayf di bawah unsur Udara dan arah Selatan — masa kekuatan fizikal dan mental. Dihubungkan dengan semangat keberanian dan kejayaan duniawi, tetapi elak hawa nafsu melampau."
  },
  kharif: {
    nama: "Kharīf (Musim Gugur)",
    arah: "Barat",
    unsur: "Tanah",
    sifat: ["pematangan", "penuaian", "ketenangan", "introspeksi"],
    tafsir:
      "Musim Kharīf bernaung di bawah unsur Tanah dan arah Barat — masa menuai hasil dan menilai diri. Roh condong kepada kebijaksanaan, kestabilan, dan keinginan untuk menenangkan batin."
  },
  shita: {
    nama: "Syitā’ (Musim Sejuk)",
    arah: "Utara",
    unsur: "Air",
    sifat: ["penyucian", "rehat", "penyimpanan tenaga", "pengasingan rohani"],
    tafsir:
      "Musim Syitā’ di bawah unsur Air dan arah Utara — masa penyucian dan pembersihan batin. Jiwa mudah berfikir mendalam, sesuai untuk ibadah dan tazkiyah diri."
  }
};

/** Arah empat penjuru dan sifatnya */
export const ARAH_ANGIN = {
  timur: {
    nama: "Timur",
    sifat: ["pembukaan", "kebangkitan", "permulaan baru"],
    roh: "menandakan kelahiran, cahaya dan kejernihan niat."
  },
  barat: {
    nama: "Barat",
    sifat: ["penutupan", "penuaian", "kerahmatan"],
    roh: "menandakan akhir perjalanan dan kembalinya tenaga kepada asal."
  },
  selatan: {
    nama: "Selatan",
    sifat: ["kehangatan", "pergerakan", "kejayaan zahir"],
    roh: "menandakan kekuatan tubuh, perbuatan dan pengaruh sosial."
  },
  utara: {
    nama: "Utara",
    sifat: ["kesejukan", "ketenangan", "keteguhan"],
    roh: "menandakan ketahanan, keteguhan iman dan rahsia ghaib."
  }
};

/** Fungsi tafsir */
export function explainMusimDanArah(musimKey: string) {
  const m = MUSIM_4[musimKey as keyof typeof MUSIM_4];
  if (!m) return "Musim tidak dikenal.";
  return `${m.nama} — Arah ${m.arah}, Unsur ${m.unsur}. ${m.tafsir}`;
}
