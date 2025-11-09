// app/plugins/card.lauh.kitab.standalone.tsx
// HISAB LAUH — Versi ASLI KITAB (jadual nombor 1..30)
// total = abjad(nama+ibu) + 20 + nilaiHari(optional) + hariHijri_berlalu → mod 30
// keputusan = jika baki ∈ Lauh al-Hayah → Hayah; jika baki ∈ Lauh al-Mamāt → Mamat

import React, { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, StyleSheet, View } from "react-native";
import Accordion from "../components/Accordion";

// Nilai Abjad Kabir (DITAMBAH:  "ء":1)
const ABJAD_KABIR: Record<string, number> = {
  "ا":1,"ب":2,"ج":3,"د":4,"ه":5,"و":6,"ز":7,"ح":8,"ط":9,
  "ي":10,"ك":20,"ل":30,"م":40,"ن":50,"س":60,"ع":70,"ف":80,"ص":90,
  "ق":100,"ر":200,"ش":300,"ت":400,"ث":500,"خ":600,"ذ":700,"ض":800,"ظ":900,"غ":1000,
  "ء":1
};

// Normalisasi Arab/Jawi ringkas — JANGAN PADAM HAMZAH (ء)
const stripTashkil = (s:string)=> (s||"").replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,"");
// preserve hamzah by mapping it to itself rather than empty
const NORM: Record<string,string> = { "إ":"ا","أ":"ا","آ":"ا","ٱ":"ا","ء":"ء", "ؤ":"و","ئ":"ي","ى":"ي","ة":"ه","ۀ":"ه" };
const normalizeArabic = (s:string)=>{
  let t = stripTashkil((s||"").trim());
  t = t.replace(/[اإأآٱ]|[ؤ]|[ئ]|[ى]|[ة]|[ۀ]|ء/g, ch => NORM[ch] ?? ch);
  t = t.replace(/لا/g,"لا"); // dikira sebagai ل + ا dalam loop
  return t;
};
const abjadValue = (s:string)=>{
  const t = normalizeArabic(s||"");
  let sum = 0;
  for (let i=0;i<t.length;i++){
    const ch = t[i];
    if (ch==="ل" && t[i+1]==="ا"){ sum += ABJAD_KABIR["ل"] + ABJAD_KABIR["ا"]; i++; continue; }
    if (ABJAD_KABIR[ch] != null) sum += ABJAD_KABIR[ch];
  }
  return { normalized: t, value: sum };
};
const mod30 = (n:number)=>{ let r=((n%30)+30)%30; return r===0?30:r; };

// Jadual nombor asli kitab
const HAYAH_NUMS = new Set([1,2,3,7,8,9,13,14,15,19,20,21,25,26,27]);
const MAMAT_NUMS = new Set([4,5,6,10,11,12,16,17,18,22,23,24,28,29,30]);

type Outcome = {
  namaNorm: string; ibuNorm: string;
  totalNama: number; totalIbu: number;
  hariValue: number; hariLalu: number;
  total: number; baki: number;
  keputusan: "Lauh al-Hayah" | "Lauh al-Mamat";
  nas: string;
};

function hisabAsli(nama:string, ibu:string, nilaiHari:number, hariLalu:number): Outcome {
  const A = abjadValue(nama);
  const B = abjadValue(ibu);
  const total = (A.value||0) + (B.value||0) + 20 + (isFinite(nilaiHari)?nilaiHari:0) + (isFinite(hariLalu)?hariLalu:0);
  const baki = mod30(total);

  const keputusan = (HAYAH_NUMS.has(baki)) ? "Lauh al-Hayah" : "Lauh al-Mamat";
  const nas = (keputusan==="Lauh al-Hayah")
    ? "فإن كان في لوح الحياة فالمريض يبرأ والحاجة تُقضى والغائب يرجع سالمًا."
    : "وإن كان في لوح الممات فالمريض لا يُرجى برؤُه والحاجة لا تُقضى والغائب يُخاف عليه.";

  return {
    namaNorm: A.normalized, ibuNorm: B.normalized,
    totalNama: A.value, totalIbu: B.value,
    hariValue: nilaiHari||0, hariLalu: hariLalu||0,
    total, baki, keputusan, nas
  };
}

const s = StyleSheet.create({
  h1:{ color:"#e8e6e3", fontSize:20, fontWeight:"900" },
  sub:{ color:"#9a9692", marginTop:4, marginBottom:8 },
  label:{ color:"#e8e6e3", fontWeight:"800" },
  input:{ color:"#e8e6e3", borderWidth:1, borderColor:"#333", borderRadius:8, padding:10, marginTop:6 },
  tx:{ color:"#e8e6e3", fontSize:14, marginVertical:2 },
  hi:{ color:"#7bd88f", fontWeight:"800" },
  final:{ color:"#ffd166", fontWeight:"900" },
  quote:{ color:"#c9c3bd", fontStyle:"italic", marginTop:6 }
});

const Card = () => {
  const [nama, setNama] = useState("");
  const [ibu, setIbu] = useState("");
  const [hariHijriStr, setHariHijriStr] = useState("0"); // bilangan hari yang telah berlalu (0..30)
  const [nilaiHariStr, setNilaiHariStr] = useState("0"); // opsyenal: nilai hari (kalau tak mahu, biar 0)

  const hariLalu = Number((hariHijriStr||"").replace(/[^\d\-]/g,"")) || 0;
  const nilaiHari = Number((nilaiHariStr||"").replace(/[^\d\-]/g,"")) || 0;

  const R = useMemo(()=> hisabAsli(nama, ibu, nilaiHari, hariLalu), [nama, ibu, nilaiHari, hariLalu]);

  return (
    <ScrollView style={{padding:12}}>
      <Text style={s.h1}>Papan Kehidupan / Kematian </Text>
      <Text style={s.sub}>
        Dalam Kejadian Langit dan Bumi Disitu Terdapat Tanda Kekuasaan Allah Bagi Mereka Yang Berfikir
      </Text>

      <Accordion title="Input">
        <Text style={s.label}>Nama (Arab/Jawi)</Text>
        <TextInput style={s.input} placeholder="cth: علي" placeholderTextColor="#777" value={nama} onChangeText={setNama}/>
        <Text style={[s.label,{marginTop:10}]}>Nama ibu (Arab/Jawi)</Text>
        <TextInput style={s.input} placeholder="cth: فاطمة" placeholderTextColor="#777" value={ibu} onChangeText={setIbu}/>
        <Text style={[s.label,{marginTop:10}]}>Bilangan hari Hijri yang telah berlalu (0..30)</Text>
        <TextInput style={s.input} keyboardType="numeric" value={hariHijriStr} onChangeText={setHariHijriStr} placeholder="cth: 12" placeholderTextColor="#777"/>
        <Text style={[s.label,{marginTop:10}]}>Nilai hari (opsyenal, biar 0 jika tak guna)</Text>
        <TextInput style={s.input} keyboardType="numeric" value={nilaiHariStr} onChangeText={setNilaiHariStr} placeholder="cth: 2 (Isnin)" placeholderTextColor="#777"/>
      </Accordion>

      <Accordion title="Pengiraan">
        <Text style={s.tx}>Nama (normalisasi): <Text className="mono" style={s.hi}>{R.namaNorm||"—"}</Text></Text>
        <Text style={s.tx}>Nama ibu (normalisasi): <Text style={s.hi}>{R.ibuNorm||"—"}</Text></Text>

        <Text style={[s.tx,{marginTop:8}]}>Jumlah nama: <Text style={s.hi}>{R.totalNama}</Text></Text>
        <Text style={s.tx}>+ Jumlah ibu: <Text style={s.hi}>{R.totalIbu}</Text></Text>
        <Text style={s.tx}>+ 20 (hawāʾ): <Text style={s.hi}>20</Text></Text>
        <Text style={s.tx}>+ Nilai hari (opsyenal): <Text style={s.hi}>{R.hariValue}</Text></Text>
        <Text style={s.tx}>+ Hari Hijri berlalu: <Text style={s.hi}>{R.hariLalu}</Text></Text>
        <Text style={s.tx}>= Jumlah keseluruhan: <Text style={s.hi}>{R.total}</Text></Text>

        <Text style={[s.tx,{marginTop:8}]}>Baki (mod-30): <Text style={s.hi}>{R.baki}</Text></Text>
      </Accordion>

      <Accordion title="Keputusan">
        <Text style={[s.tx,{fontSize:18}]}>Keputusan: <Text style={s.final}>{R.keputusan}</Text></Text>
        <Text style={s.quote}>{R.nas}</Text>

        <View style={{marginTop:8}}>
          <Text style={s.tx}>Lauh al-Hayah: 1, 2, 3, 7, 8, 9, 13, 14, 15, 19, 20, 21, 25, 26, 27</Text>
          <Text style={s.tx}>Lauh al-Mamat: 4, 5, 6, 10, 11, 12, 16, 17, 18, 22, 23, 24, 28, 29, 30</Text>
        </View>
      </Accordion>
    </ScrollView>
  );
};

// Export default adapter
const CardLauhKitabStandalone = {
  id: "lauh-kitab-standalone",
  label: "Lauh (Asli Kitab — nombor 1..30)",
  render: Card
};
export default CardLauhKitabStandalone;
