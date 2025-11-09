// app/plugins/card.ghaleb.kitab.standalone.tsx
// Kad: Ghaleb (Penentu Menang) — export default ADAPTER { id, label, render }

import React, { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, StyleSheet } from "react-native";
import Accordion from "../components/Accordion";

const jommal = (c: string) => {
  let a = 0;
  for (let i = 0; i < c.length; i++) {
    const ch = c[i];
    switch (ch) {
      case "ا": case "أ": case "إ": case "ء": a += 1; break;
      case "آ": case "~": a += 2; break;
      case "ب": a += 2; break;
      case "ج": a += 3; break;
      case "د": a += 4; break;
      case "ه": case "ة": a += 5; break;
      case "و": case "ؤ": a += 6; break;
      case "ز": a += 7; break;
      case "ح": a += 8; break;
      case "ط": a += 9; break;
      case "ي": case "ئ": case "ى": a += 10; break;
      case "ك": a += 20; break;
      case "ل": a += 30; break;
      case "م": a += 40; break;
      case "ن": a += 50; break;
      case "س": a += 60; break;
      case "ع": a += 70; break;
      case "ف": a += 80; break;
      case "ص": a += 90; break;
      case "ق": a += 100; break;
      case "ر": a += 200; break;
      case "ش": a += 300; break;
      case "ت": a += 400; break;
      case "ث": a += 500; break;
      case "خ": a += 600; break;
      case "ذ": a += 700; break;
      case "ض": a += 800; break;
      case "ظ": a += 900; break;
      case "غ": a += 1000; break;
      case "َ": case "ً": case "ُ": case "ٌ": case "ِ": case "ٍ": case "ّ": case " ":
        break;
      default: a -= 1_000_000;
    }
  }
  return a;
};

function ghaleb(c: string, a: string) {
  const d = (jommal(c) % 9) + 1;
  const b = (jommal(a) % 9) + 1;
  if (d === b) return d % 2 === 1 ? "الطالب يغلب المطلوب" : "المطلوب يغلب الطالب";
  const menangC: Record<number, number[]> = {
    1: [3,5,7,9], 2: [1,4,6,8], 3: [2,5,7,9],
    4: [1,3,6,8], 5: [2,4,7,9], 6: [1,3,5,8],
    7: [2,4,6,9], 8: [1,3,5,7], 9: [2,4,6,8],
  };
  return menangC[d].includes(b) ? "c" : "a";
}

function Body() {
  const [c, setC] = useState("");
  const [a, setA] = useState("");
  const calc = useMemo(() => {
    const cVal = jommal(c), aVal = jommal(a);
    const d = c ? ((cVal % 9) + 1) : 0;
    const b = a ? ((aVal % 9) + 1) : 0;
    const res = c && a ? ghaleb(c, a) : "—";
    const keputusan =
      res === "c" ? c :
      res === "a" ? a :
      (res as string);
    return { cVal, aVal, d, b, keputusan };
  }, [c, a]);

  return (
    <ScrollView style={{ padding: 12 }}>
      <Text style={s.h1}>Ghaleb — Penentu Menang (غالب)</Text>
      <Text style={s.sub}>Isi dua nama (Arab), sistem akan tentukan yang menang ikut baki 1–9.</Text>

      <Accordion title="Input">
        <Text style={s.label}>Nama الطالب (penyoal)</Text>
        <TextInput style={s.inp} placeholder="cth: علي" placeholderTextColor="#777" value={c} onChangeText={setC}/>
        <Text style={[s.label,{marginTop:10}]}>Nama المطلوب (yang disoal)</Text>
        <TextInput style={s.inp} placeholder="cth: ايلا" placeholderTextColor="#777" value={a} onChangeText={setA}/>
      </Accordion>

      <Accordion title="Kiraan & Keputusan">
        <Text style={s.row}>Jumlah الطالب: <Text style={s.hi}>{c ? calc.cVal : "—"}</Text></Text>
        <Text style={s.row}>Jumlah المطلوب: <Text style={s.hi}>{a ? calc.aVal : "—"}</Text></Text>
        <Text style={s.row}>Baki الطالب (d): <Text style={s.hi}>{c ? calc.d : "—"}</Text></Text>
        <Text style={s.row}>Baki المطلوب (b): <Text style={s.hi}>{a ? calc.b : "—"}</Text></Text>
        <Text style={[s.row,{fontSize:18,marginTop:6}]}>📌 Keputusan: <Text style={s.final}>{calc.keputusan || "—"}</Text></Text>
      </Accordion>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  h1:{color:"#e8e6e3",fontSize:20,fontWeight:"900"},
  sub:{color:"#9a9692",marginTop:4,marginBottom:8},
  label:{color:"#e8e6e3",fontWeight:"800"},
  inp:{color:"#e8e6e3",borderWidth:1,borderColor:"#333",borderRadius:8,padding:10,marginTop:6},
  row:{color:"#e8e6e3",fontSize:14,marginVertical:1},
  hi:{color:"#7bd88f",fontWeight:"800"},
  final:{color:"#ffd166",fontWeight:"900"},
});

const CardGhalebKitabStandalone = {
  id: "ghaleb-kitab-standalone",
  label: "Ghaleb — Penentu Menang (غالب)",
  render: Body,
};

export default CardGhalebKitabStandalone;
