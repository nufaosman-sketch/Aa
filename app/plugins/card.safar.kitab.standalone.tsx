// app/plugins/card.safar.kitab.standalone.tsx
// أخبار السفر — Berita Perjalanan (pola adapter object: {id,label,render})

import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Accordion from "../components/Accordion";
import ForensikKitabSafar, { HariMinggu } from "../lib/forensik.kitab.safar";

const HARI = ["Ahad","Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu"] as const;

const pill = (on:boolean)=>({
  paddingHorizontal:12,paddingVertical:8,borderRadius:999,
  borderWidth:1,borderColor:"#444",margin:4,backgroundColor:on?"#111":"transparent"
}) as any;
const pillTxt = (on:boolean)=>({ color:on?"#fff":"#e8e6e3", fontWeight:"700", fontSize:12 }) as any;

function SafarCardBody(){
  const [nama, setNama] = useState<string>("");
  const [hari, setHari] = useState<HariMinggu>("Ahad");

  const KIRA = useMemo(()=>ForensikKitabSafar.hisabSafar({ nama, hari }), [nama, hari]);
  const FINAL = useMemo(()=>ForensikKitabSafar.verdict(KIRA.baki3 as 1|2|3), [KIRA.baki3]);

  return (
    <ScrollView style={{padding:12}}>
      <Text style={styles.h1}>🚶‍♂️ أخبار السفر — Berita Perjalanan</Text>
      <Text style={styles.sub}>Jumlahkan nilai nama + hari → jatuh 3-3 → tafsir.</Text>

      <Accordion title="Input">
        <Text style={styles.label}>Nama orang (Arab/Jawi)</Text>
        <TextInput placeholder="cth: سليمان" placeholderTextColor="#777"
          style={styles.input} value={nama} onChangeText={setNama} />
        <Text style={[styles.label,{marginTop:10}]}>Hari dia ingin bermusafir</Text>
        <View style={{flexDirection:"row",flexWrap:"wrap"}}>
          {HARI.map(h=>(
            <TouchableOpacity key={h} onPress={()=>setHari(h as HariMinggu)} style={pill(hari===h)}>
              <Text style={pillTxt(hari===h)}>{h}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Accordion>

      <Accordion title="Keputusan">
        <Text style={styles.text}>Jumlah keseluruhan: <Text style={styles.hi}>{KIRA.total}</Text></Text>
        <Text style={styles.text}>Baki jatuh 3-3: <Text style={styles.hi}>{KIRA.baki3}</Text></Text>
        <Text style={[styles.text,{fontSize:18,marginTop:8}]}>
          📌 Keputusan: <Text style={styles.final}>{FINAL.verdict}</Text>
        </Text>
        <Text style={styles.note}>{FINAL.nota}</Text>
      </Accordion>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1:{ color:"#e8e6e3", fontSize:20, fontWeight:"900" },
  sub:{ color:"#9a9692", marginTop:4, marginBottom:8 },
  label:{ color:"#e8e6e3", fontWeight:"800" },
  input:{ color:"#e8e6e3", borderWidth:1, borderColor:"#333", borderRadius:8, padding:10, marginTop:6 },
  text:{ color:"#e8e6e3", fontSize:14, marginVertical:1 },
  hi:{ color:"#7bd88f", fontWeight:"800" },
  final:{ color:"#ffd166", fontWeight:"900" },
  note:{ color:"#bfbab6", marginTop:4, fontSize:12 },
});

// === Adapter Object (pola asal projek) ===
const CardSafarKitabStandalone = {
  id: "safar-kitab-standalone",
  label: "Akhbar al-Safar — Berita Perjalanan (Asal Kitab)",
  render: SafarCardBody,
};

export default CardSafarKitabStandalone;
