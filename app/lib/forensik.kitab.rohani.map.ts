export const ROH_TAFSIR = {
  Hayah: {
    sifat: ["kebangkitan","pertumbuhan","ilmu","pengaruh baik","keterbukaan"],
    nasihat: "Gunakan masa siang dan hari sa‘id untuk membuka potensi dan memperkuatkan amal zahir."
  },
  Mamat: {
    sifat: ["penyucian","pengakhiran","ujian","rahmah ghaib","kekuatan dalaman"],
    nasihat: "Elakkan amarah dan pertikaian, fokus kepada tazkiyah, sabar, dan muhasabah."
  }
};

export function explainHayahMamat(lauh: "Hayah"|"Mamat", value: number) {
  const ref = ROH_TAFSIR[lauh];
  return `Nilai ${value} jatuh pada Lauh ${lauh} — ${ref.sifat.join(", ")}. ${ref.nasihat}`;
}
