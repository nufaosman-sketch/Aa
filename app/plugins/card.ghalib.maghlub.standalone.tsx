// app/plugins/card.ghalib.maghlub.standalone.tsx
// الغالب / المغلوب — Port 1:1 daripada my_app.js (fungsi jommal & ghaleb asal)

import React, { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, StyleSheet, View } from "react-native";

// === jommal() — salin pola pemetaan & logik dari my_app.js (yang betul) ===
function jommal(str: string): number {
  if (!str) return 0;
  let a = 0;
  const s = str; // ikut asal: tak buang diakritik selain switch case
  for (let d = 0; d < s.length; d++) {
    const ch = s[d];
    switch (ch) {
      case "ا": case "ى": case "أ": case "إ": case "ء": a += 1; break;
      case "آ": case "~": a += 2; break;
      case "ب": a += 2; break;
      case "ج": a += 3; break;
      case "د": a += 4; break;
      case "ه": a += 5; break;
      case "و": case "ؤ": a += 6; break;
      case "ز": a += 7; break;
      case "ح": a += 8; break;
      case "ط": a += 9; break;
      case "ي": case "ئ": a += 10; break;
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
      case "ت": case "ة": a += 400; break; // PERINGATAN: 'ة' = 400 ikut my_app.js
      case "ث": a += 500; break;
      case "خ": a += 600; break;
      case "ذ": a += 700; break;
      case "ض": a += 800; break;
      case "ظ": a += 900; break;
      case "غ": a += 1000; break;
      case "َ": case "ً": case "ُ": case "ٌ": case "ِ": case "ٍ": case "ّ": case " ":
        // harakat & space → tiada kesan (ikut asal)
        break;
      default:
        a -= 1000000; // ikut asal — simbol lain dianggap salah
    }
  }
  return a;
}

// === ghaleb() — salin 1:1 ===
function ghaleb(talib: string, matlub: string): string {
  const d = (jommal(talib) % 9) + 1;
  const b = (jommal(matlub) % 9) + 1;

  // Jika sama → ganjil = الطالب يغلب المطلوب ; genap = المطلوب يغلب الطالب
  if (d === b) return d % 2 === 1 ? "الطالب يغلب المطلوب" : "المطلوب يغلب الطالب";

  switch (d) {
    case 1: return (b === 3 || b === 5 || b === 7 || b === 9) ? "الطالب يغلب المطلوب" : "المطلوب يغلب الطالب";
    case 2: return (b === 1 || b === 4 || b === 6 || b === 8) ? "الطالب يغلب المطلوب" : "المطلوب يغلب الطالب";
    case 3: return (b === 2 || b === 5 || b === 7 || b === 9) ? "الطالب يغلب المطلوب" : "المطلوب يغلب الطالب";
    case 4: return (b === 1 || b === 3 || b === 6 || b === 8) ? "الطالب يغلب المطلوب" : "المطلوب يغلب الطالب";
    case 5: return (b === 2 || b === 4 || b === 7 || b === 9) ? "الطالب يغلب المطلوب" : "المطلوب يغلب الطالب";
    case 6: return (b === 1 || b === 3 || b === 5 || b === 8) ? "الطالب يغلب المطلوب" : "المطلوب يغلب الطالب";
    case 7: return (b === 2 || b === 4 || b === 6 || b === 9) ? "الطالب يغلب المطلوب" : "المطلوب يغلب الطالب";
    case 8: return (b === 1 || b === 3 || b === 5 || b === 7) ? "الطالب يغلب المطلوب" : "المطلوب يغلب الطالب";
    case 9: return (b === 2 || b === 4 || b === 6 || b === 8) ? "الطالب يغلب المطلوب" : "المطلوب يغلب الطالب";
  }
  return "";
}

// === Helper untuk nilai 1..9 (debug paparan) ===
const nilai1to9 = (s: string) => ((jommal(s) % 9) + 1);

// === Komponen Kad (tanpa Accordion, default ringkas & stabil) ===
function CardBody() {
  const [talib, setTalib] = useState("علي");    // الطالب
  const [matlub, setMatlub] = useState("إيلا"); // المطلوب

  const d = useMemo(() => nilai1to9(talib), [talib]);
  const b = useMemo(() => nilai1to9(matlub), [matlub]);
  const resAr = useMemo(() => ghaleb(talib, matlub), [talib, matlub]);

  // Terjemah BM (sekadar paparan bantu)
  const resBm = resAr === "الطالب يغلب المطلوب"
    ? "Penuntut menang (mengalahkan yang dituntut)"
    : "Pihak dituntut menang (mengalahkan penuntut)";

  return (
    <ScrollView style={{ padding: 14 }}>
      <Text style={s.h1}>حساب الغالب و المغلوب — Versi Asal (1:1)</Text>
      <Text style={s.sub}>Kiraan ikut my_app.js: mod 9 + pola ganjil/genap + kombinasi 1..9.</Text>

      <View style={s.block}>
        <Text style={s.lab}>الطالب (Penuntut)</Text>
        <TextInput
          value={talib}
          onChangeText={setTalib}
          style={s.input}
          placeholder="cth: علي"
          placeholderTextColor="#888"
        />
        <Text style={s.kv}>Nilai 1..9 الطالب: <Text style={s.val}>{d}</Text></Text>
      </View>

      <View style={s.block}>
        <Text style={s.lab}>المطلوب (Dituntut)</Text>
        <TextInput
          value={matlub}
          onChangeText={setMatlub}
          style={s.input}
          placeholder="cth: إيلا"
          placeholderTextColor="#888"
        />
        <Text style={s.kv}>Nilai 1..9 المطلوب: <Text style={s.val}>{b}</Text></Text>
      </View>

      <View style={s.block}>
        <Text style={s.h2}>Keputusan</Text>
        <Text style={s.ar}>{resAr}</Text>
        <Text style={s.bm}>{resBm}</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  h1: { color:"#efe9e2", fontSize:20, fontWeight:"800", marginBottom:6 },
  h2: { color:"#efe9e2", fontSize:16, fontWeight:"800", marginBottom:6 },
  sub: { color:"#cfc2b8", marginBottom:12 },
  block: { marginBottom:14, padding:12, borderWidth:1, borderColor:"#2b2020", borderRadius:12, backgroundColor:"rgba(255,255,255,0.03)" },
  lab: { color:"#efe9e2", fontWeight:"700", marginBottom:6 },
  input: { color:"#efe9e2", borderWidth:1, borderColor:"#3a2b2b", borderRadius:8, padding:10, fontSize:16, backgroundColor:"rgba(0,0,0,0.15)" },
  kv: { color:"#d9cfc7", marginTop:8 },
  val: { color:"#9ef08a", fontWeight:"900" },
  ar: { color:"#ffd166", fontSize:18, fontWeight:"900", marginTop:4 },
  bm: { color:"#cfead1", fontSize:14, marginTop:4, fontStyle:"italic" },
});

const CardGhalibMaghlubStandalone = {
  id: "ghalib-maghlub-standalone",
  label: "Ghalib/Maghlub — Versi Asal (1:1)",
  render: CardBody,
};

export default CardGhalibMaghlubStandalone;
