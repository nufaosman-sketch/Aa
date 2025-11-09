// app/plugins/card.shareek.standalone.tsx
// Kad: حساب الشريك أو الزوج — Keserasian dua nama (mod 9)
// FORMAT: export default { id, label, render } — ikut pola kad lain, import ../components/Accordion

import React, { useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import Accordion from "../components/Accordion";

// === Peta huruf — SAMA seperti kad sebelumnya (JANGAN UBAH) ===
const JOMMAL: Record<string, number> = {
  "~": 2, "ء": 1, "آ": 2, "أ": 1, "ؤ": 6, "إ": 1, "ئ": 10, "ا": 1, "ب": 2,
  "ة": 5, "ت": 400, "ث": 500, "ج": 3, "ح": 8, "خ": 600, "د": 4, "ذ": 700,
  "ر": 200, "ز": 7, "س": 60, "ش": 300, "ص": 90, "ض": 800, "ط": 9, "ظ": 900,
  "ع": 70, "غ": 1, "ف": 80, "ق": 100, "ك": 20, "ل": 30, "م": 40, "ن": 50,
  "ه": 5, "و": 6, "ى": 10, "ي": 10
};

// Normalisasi (tidak menukar nilai huruf)
const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const KASHIDA = /\u0640/g;
const clean = (s: string) => (s||"").replace(/\s+/g,"").replace(ARABIC_DIACRITICS,"").replace(KASHIDA,"");

// Jumlah jommal untuk satu nama
function jommalName(s: string){
  const t = clean(s); let total=0; const pec:Array<[string,number]>=[];
  for (const ch of t){ const v = JOMMAL[ch] ?? 0; total+=v; pec.push([ch,v]); }
  return {bersih:t, jumlah:total, pec};
}

// Peta keputusan (mod 9) — frasa Arab + tafsir BM ringkas
const SHAREEK_MAP: Record<number, {ar:string; bm:string}> = {
  0: { ar: "رحيل و نزاع أو فرار", bm: "Berpisah & bertengkar / lari" },
  1: { ar: "وطيء لا خير فيه",       bm: "Pergaulan yang tiada kebaikan" },
  2: { ar: "طيب",                   bm: "Baik" },
  3: { ar: "أوله وطيء و آخره رديء بعد الضيق الفرج", bm: "Awal mesra, akhir kurang baik; selepas sempit ada lega" },
  4: { ar: "قوة عين و توفيقه وطء",  bm: "Kuat pengaruh & hasil baik dalam hubungan" },
  5: { ar: "بيت البنين",            bm: "Rumah anak-anak (subur/keturunan)" },
  6: { ar: "أوله طيب و آخره هم و غم", bm: "Awal baik, akhir susah & duka" },
  7: { ar: "بيت الفراش و سعد السعود إن سعد وإلا بعده سعد", bm: "Serasi ranjang; jika bernasib baik—mewah; jika tidak—naik turun" },
  8: { ar: "بيت الإنكليس",          bm: "‘Rumah Inklīs’ (campur/rumit; neutral)" }
};

function verdictShareek(n1: string, n2: string){
  const a = jommalName(n1);
  const b = jommalName(n2);
  const mod = (a.jumlah + b.jumlah) % 9;
  // Nota: dalam tradisi, 0 dianggap 9; di sini ikut kod rujukan: 0 kekal 0.
  const res = SHAREEK_MAP[mod];
  return { a, b, mod, ar: res?.ar ?? "-", bm: res?.bm ?? "-" };
}

function Row({label, value}:{label:string; value:string|number}) {
  return <Text style={s.txt}><Text style={s.dim}>{label}</Text> <Text style={s.hi}>{String(value)}</Text></Text>;
}
function Breakdown({list}:{list:Array<[string,number]>}) {
  if (!list.length) return null;
  return <View style={{flexDirection:"row", flexWrap:"wrap", marginTop:4}}>
    {list.map((it,i)=><View key={i} style={s.pill}><Text style={s.pillTxt}>{it[0]}={it[1]}</Text></View>)}
  </View>;
}

function Body(){
  const [n1,setN1]=useState("علي");
  const [n2,setN2]=useState("فاطمة");

  const k = useMemo(()=>verdictShareek(n1,n2),[n1,n2]);

  return (
    <ScrollView style={{padding:12}}>
      <Text style={s.h1}>حساب الشريك أو الزوج — Keserasian Nama</Text>
      <Text style={s.sub}>Formula: jumlah nilai huruf (حساب الجُمّل) bagi dua nama → ambil baki mod 9 → tafsir keputusan.</Text>

      <Accordion title="Input — Pihak Pertama">
        <Text style={s.label}>Nama (huruf Arab)</Text>
        <TextInput style={s.in} placeholder="cth: علي" placeholderTextColor="#777" value={n1} onChangeText={setN1}/>
      </Accordion>

      <Accordion title="Input — Pihak Kedua">
        <Text style={s.label}>Nama (huruf Arab)</Text>
        <TextInput style={s.in} placeholder="cth: فاطمة" placeholderTextColor="#777" value={n2} onChangeText={setN2}/>
      </Accordion>

      <Accordion title="Keputusan">
        <Text style={s.h2}>Pihak Pertama</Text>
        <Row label="Nama (dibersihkan):" value={k.a.bersih||"—"}/>
        <Row label="Jumlah jommal:" value={k.a.jumlah}/>
        <Breakdown list={k.a.pec}/>

        <Text style={[s.h2,{marginTop:12}]}>Pihak Kedua</Text>
        <Row label="Nama (dibersihkan):" value={k.b.bersih||"—"}/>
        <Row label="Jumlah jommal:" value={k.b.jumlah}/>
        <Breakdown list={k.b.pec}/>

        <Text style={[s.h2,{marginTop:12}]}>Rumusan</Text>
        <Row label="Baki mod 9:" value={k.mod}/>
        <Text style={s.txt}><Text style={s.dim}>Frasa Arab:</Text> <Text style={s.hi}>{k.ar}</Text></Text>
        <Text style={s.txt}><Text style={s.dim}>Tafsiran BM:</Text> <Text style={s.hi}>{k.bm}</Text></Text>
      </Accordion>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  h1:{ color:"#e8e6e3", fontSize:20, fontWeight:"900" },
  h2:{ color:"#e8e6e3", fontSize:16, fontWeight:"900" },
  sub:{ color:"#9a9692", marginVertical:6 },
  label:{ color:"#e8e6e3", fontWeight:"800" },
  in:{ color:"#e8e6e3", borderWidth:1, borderColor:"#333", borderRadius:8, padding:10, marginTop:6 },
  txt:{ color:"#e8e6e3", fontSize:14, marginVertical:2 },
  dim:{ color:"#b6b2ad" },
  hi:{ color:"#7bd88f", fontWeight:"800" },
  pill:{ paddingHorizontal:10, paddingVertical:6, borderRadius:999, borderWidth:1, borderColor:"#333", margin:3 },
  pillTxt:{ color:"#cfcac4", fontWeight:"700", fontSize:12 }
});

const CardShareekStandalone = {
  id: "shareek-standalone",
  label: "Keserasian — الشريك/الزوج",
  render: Body,
};

export default CardShareekStandalone;
