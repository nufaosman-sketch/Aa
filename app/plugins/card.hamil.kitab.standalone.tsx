// app/plugins/card.hamil.kitab.standalone.tsx
// Kad: Hisab Wanita Hamil — Asal Kitab
// FORMAT: export default ADAPTER OBJECT { id, label, render } — serasi dengan AdapterHub (A.render)

import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Accordion from "../components/Accordion";
import { hisabWanitaHamil, BULAN_HIJRI_ARAB, BulanHijri } from "../lib/forensik.kitab.hamil";

const HIJRI: BulanHijri[] = [
  "Muharram","Safar","Rabiul Awwal","Rabiul Akhir",
  "Jamadil Awwal","Jamadil Akhir","Rejab","Syaaban",
  "Ramadhan","Syawal","Zulkaedah","Zulhijjah"
];

const pill = (on:boolean)=>({
  paddingHorizontal:12,paddingVertical:8,borderRadius:999,
  borderWidth:1,borderColor:"#444",margin:4,
  backgroundColor:on?"#111":"transparent"
}) as any;
const pillTxt = (on:boolean)=>({
  color:on?"#fff":"#e8e6e3", fontWeight:"700", fontSize:12
}) as any;

function HamilCardBody(){
  const [namaWanita, setNamaWanita] = useState<string>("");
  const [bulan, setBulan] = useState<BulanHijri>("Muharram");
  const result = useMemo(()=> hisabWanitaHamil(namaWanita, bulan), [namaWanita, bulan]);

  return (
    <ScrollView style={{padding:12}}>
      <Text style={styles.h1}>Hisab Wanita Hamil — Asal Kitab</Text>
      <Text style={styles.sub}>
        Formula: nilai abjad (nama wanita) + nilai abjad (nama bulan Hijri) → jatuhkan 9 → ganjil=lelaki, genap=perempuan.
      </Text>

      <Accordion title="Input">
        <Text style={styles.label}>Nama wanita (Arab/Jawi)</Text>
        <TextInput
          placeholder="cth: مريم"
          placeholderTextColor="#777"
          style={styles.input}
          value={namaWanita}
          onChangeText={setNamaWanita}
        />

        <Text style={[styles.label,{marginTop:10}]}>Bulan Hijri ketika mengandung</Text>
        <View style={{flexDirection:"row",flexWrap:"wrap"}}>
          {HIJRI.map(b=>(
            <TouchableOpacity key={b} onPress={()=>setBulan(b)} style={pill(bulan===b)}>
              <Text style={pillTxt(bulan===b)}>{b}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Accordion>

      <Accordion title="Keputusan">
        <Text style={styles.text}>
          Nama (normalisasi): <Text style={styles.hi}>{result.namaArab || "—"}</Text>
        </Text>
        <Text style={styles.text}>
          Nama bulan Arab: <Text style={styles.hi}>{BULAN_HIJRI_ARAB[bulan]}</Text>
        </Text>
        <Text style={[styles.text,{marginTop:6}]}>
          Jumlah nama: <Text style={styles.hi}>{result.namaVal}</Text>
        </Text>
        <Text style={styles.text}>
          + Jumlah bulan: <Text style={styles.hi}>{result.bulanVal}</Text>
        </Text>
        <Text style={styles.text}>
          = Jumlah keseluruhan: <Text style={styles.hi}>{result.total}</Text>
        </Text>
        <Text style={[styles.text,{marginTop:6}]}>
          Baki mod 9: <Text style={styles.hi}>{result.baki9}</Text>
        </Text>
        <Text style={[styles.text,{fontSize:18,marginTop:8}]}>
          📌 Keputusan: <Text style={styles.final}>{result.jantina}</Text>
        </Text>
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
});

// ===== Adapter Object =====
const CardHamilKitabStandalone = {
  id: "hamil-kitab-standalone",
  label: "Hisab Wanita Hamil (Asal Kitab)",
  render: HamilCardBody,
};

export default CardHamilKitabStandalone;
