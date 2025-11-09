// app/plugins/card.mariid.daniel.standalone.tsx
// Kad: Pedoman Pesakit — Nabi Daniel (standalone)
// NOTA: Registry hook manual. Fail ini export default adapter object { id,label,render }.

import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Accordion from "../components/Accordion";

type Rule = { hari: string; arab: string; tanda: string; tempoh: string; kesudahan: string };

const DAY_RULES: Rule[] = [
  { hari: "Ahad & Jumaat",   arab: "الجمعة / الأحد",    tanda: "Sakit berat.",                         tempoh: "Tempoh: 7 hari",  kesudahan: "Jika tidak mati akan sembuh." },
  { hari: "Isnin",  arab: "الإثنين",  tanda: "Sakit perut.",                         tempoh: "Tempoh: 6 hari",  kesudahan: "Jika tidak mati akan sembuh." },
  { hari: "Selasa", arab: "الثلاثاء", tanda: "Demam kuat; sakit berat.",            tempoh: "Tempoh: 8 hari",  kesudahan: "Jika tidak mati akan sembuh." },
  { hari: "Rabu",   arab: "الأربعاء", tanda: "‘Wahm’ (khayalan/psikosomatik).",      tempoh: "Tempoh: 12 hari", kesudahan: "Jika tidak mati akan sembuh." },
  { hari: "Khamis", arab: "الخميس",   tanda: "Akibat ‘farhah’ (emosi gembira).",     tempoh: "Tempoh: 13 hari", kesudahan: "Jika tidak mati akan sembuh." },
  { hari: "Jumaat", arab: "الجمعة",   tanda: "Demam.",                               tempoh: "Tempoh: 11 hari", kesudahan: "Jika tidak mati akan sembuh." },
  { hari: "Sabtu",  arab: "السبت",    tanda: "Demam.",                               tempoh: "Tempoh: 11 hari", kesudahan: "Jika tidak mati akan sembuh." },
];

function Body() {
  return (
    <ScrollView style={{ padding: 12 }}>
      <Text style={S.h1}>Pedoman Pesakit — Nabi Daniel</Text>
      <Text style={S.sub}>
        “Setiap hari ada tempoh tertentu penyakit akan berlarutan. {`\n`}
        <Text style={S.hi}>Kesembuhan Mutlak hanya dari Allah swt.</Text>
      </Text>

      <Accordion title="Frasa Kitab (Arab)">
        <Text style={S.q}>«بِسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ، أَوْ عَيْنِ حَاسِدٍ، اللَّهُ يَشْفِيكَ، بِسْمِ اللَّهِ أَرْقِيكَ»</Text>
      </Accordion>

      <Accordion title="Jadual Hari & Kesudahan">
        {DAY_RULES.map((r) => (
          <View key={r.hari} style={S.row}>
            <View style={{ flex: 1.1 }}>
              <Text style={S.hari}>{r.hari}</Text>
              <Text style={S.hariArab}>{r.arab}</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={S.text}>Tanda: <Text style={S.bold}>{r.tanda}</Text></Text>
              <Text style={S.text}>{r.tempoh}</Text>
              <Text style={S.text}>Kesudahan: <Text style={S.hi}>{r.kesudahan}</Text></Text>
            </View>
          </View>
        ))}
      </Accordion>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  h1: { color: "#e8e6e3", fontSize: 20, fontWeight: "900" },
  sub: { color: "#9a9692", marginTop: 6, marginBottom: 10 },
  text: { color: "#e8e6e3", fontSize: 14, marginVertical: 2 },
  hi: { color: "#7bd88f", fontWeight: "800" },
  bold: { color: "#e8e6e3", fontWeight: "800" },
  q: { color: "#ffd166", fontWeight: "900", fontSize: 16 },
  row: { borderWidth: 1, borderColor: "#333", borderRadius: 10, padding: 10, marginBottom: 8, flexDirection: "row", gap: 8 },
  hari: { color: "#fff", fontWeight: "900", fontSize: 16 },
  hariArab: { color: "#aaa", fontWeight: "700", fontSize: 14 },
});

const CardMariidDanielStandalone = {
  id: "mariid-daniel-standalone",
  label: "Pedoman Pesakit — Nabi Daniel",
  render: Body,
};

export default CardMariidDanielStandalone;
