// app/plugins/card.ghalib.maghlub.kadkuning.tsx
// Kad Kuning — الغالب/المغلوب (9×9, 5 keputusan)

import React, { useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import Accordion from "../components/Accordion";
import { decideKadKuning, type Verdict } from "../lib/kadKuning.table";
import KOV from "../lib/kadKuning.overrides";

// Jummāl map (kekalkan set yang dipersetujui)
const JOMMAL: Record<string, number> = {
  "~":2,"ء":1,"آ":2,"أ":1,"ؤ":6,"إ":1,"ئ":10,"ا":1,"ب":2,"ة":5,"ت":400,"ث":500,"ج":3,"ح":8,"خ":600,"د":4,"ذ":700,"ر":200,"ز":7,"س":60,
  "ش":300,"ص":90,"ض":800,"ط":9,"ظ":900,"ع":70,"غ":1,"ف":80,"ق":100,"ك":20,"ل":30,"م":40,"ن":50,"ه":5,"و":6,"ى":10,"ي":10
};
const ARABIC_DIACRITICS=/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const KASHIDA=/\u0640/g;
const clean=(s:string)=>(s||"").replace(/\s+/g,"").replace(ARABIC_DIACRITICS,"").replace(KASHIDA,"");

function jumlahAbjad(s:string){ let t=clean(s), sum=0; for(const ch of t){ sum += (JOMMAL[ch] ?? 0); } return {bersih:t, jumlah:sum}; }
const to1to9=(n:number)=>{const r=n%9;return r===0?9:r};

type Ringkasan={asal:string;bersih:string;jumlah:number;v:number};
function kiraNama(nama:string):Ringkasan{
  const { bersih, jumlah } = jumlahAbjad(nama);
  return { asal:nama, bersih, jumlah, v:to1to9(jumlah) };
}

const V_AR: Record<Verdict,string> = {
  1:"الغالب — الطالب يفوز",
  2:"المغلوب — المطلوب يفوز",
  3:"تساوي",
  4:"تساوي خاص: الطالب يغلب المطلوب",
  5:"تساوي خاص: المطلوب يغلب الطالب",
};
const V_MS: Record<Verdict,string> = {
  1:"Penuntut menang",
  2:"Dituntut menang",
  3:"Seri",
  4:"Seri khas — penuntut mengatasi",
  5:"Seri khas — dituntut mengatasi",
};

export default {
  id: "ghalib-maghlub-kadkuning",
  label: "Kad Kuning — الغالب/المغلوب (9×9)",
  render: function Card(){
    const [penuntut,setPenuntut]=useState("علي");
    const [dituntut,setDituntut]=useState("إيلا");

    const A=useMemo(()=>kiraNama(penuntut),[penuntut]);
    const B=useMemo(()=>kiraNama(dituntut),[dituntut]);
    const code:Verdict=useMemo(()=>decideKadKuning(A.v, B.v, KOV),[A.v,B.v]);
    const ar=V_AR[code]; const ms=V_MS[code];

    return (
      <ScrollView style={{padding:14}}>
        <Text style={s.h1}>حساب الغالب و المغلوب — Kad Kuning (9×9)</Text>
        <Text style={s.sub}>Formula: jumlah الجُمّل → turunkan 1..9 → rujuk jadual 9×9 → keputusan (5 jenis).</Text>

        <Accordion title="Input — Penuntut (atas)">
          <Text style={s.label}>Nama (huruf Arab)</Text>
          <TextInput value={penuntut} onChangeText={setPenuntut} style={s.in} placeholder="cth: علي" placeholderTextColor="#aaa"/>
          <Row k="Bersih" v={A.bersih||"—"} />
          <Row k="Jumlah jummāl" v={A.jumlah} />
          <Row k="Nilai 1..9" v={A.v} hi />
        </Accordion>

        <Accordion title="Input — Dituntut (bawah)">
          <Text style={s.label}>Nama (huruf Arab)</Text>
          <TextInput value={dituntut} onChangeText={setDituntut} style={s.in} placeholder="cth: إيلا" placeholderTextColor="#aaa"/>
          <Row k="Bersih" v={B.bersih||"—"} />
          <Row k="Jumlah jummāl" v={B.jumlah} />
          <Row k="Nilai 1..9" v={B.v} hi />
        </Accordion>

        <Accordion title="Keputusan">
          <Text style={s.h2}>النتيجة</Text>
          <Text style={s.verdictAr}>{ar}</Text>
          <Text style={s.verdictMs}>{ms}</Text>

          <Text style={s.debugTitle}>Debug Ringkas</Text>
          <Text style={s.debugTxt}>a={A.v} , b={B.v} , kod={code}</Text>
          <Text style={s.note}>* Lengkapkan jadual 9×9 melalui <Text style={{fontFamily:"monospace"}}>app/lib/kadKuning.overrides.ts</Text>.</Text>
        </Accordion>
      </ScrollView>
    );
  }
};

function Row({k,v,hi}:{k:string;v:any;hi?:boolean}){
  return <View style={s.r}><Text style={s.kv}>{k}:</Text><Text style={[s.v,hi&&s.vHi]}>{String(v)}</Text></View>;
}

const s=StyleSheet.create({
  h1:{color:"#efe9e2",fontSize:20,fontWeight:"900",marginBottom:6},
  h2:{color:"#efe9e2",fontSize:18,fontWeight:"900",marginBottom:6},
  sub:{color:"#cfc2b8",marginBottom:12},
  label:{color:"#efe9e2",fontWeight:"700",marginTop:6},
  in:{color:"#efe9e2",borderWidth:1,borderColor:"#2b2020",borderRadius:8,padding:10,marginTop:8,backgroundColor:"rgba(255,255,255,0.03)"},
  r:{flexDirection:"row",justifyContent:"space-between",marginTop:6},
  kv:{color:"#d0c6bf"}, v:{color:"#efe9e2"}, vHi:{color:"#9ef08a",fontWeight:"900"},
  verdictAr:{color:"#ffd166",fontSize:18,fontWeight:"900",marginTop:8},
  verdictMs:{color:"#ffd166",opacity:0.9,marginTop:2},
  debugTitle:{color:"#cfc2b8",marginTop:10,fontWeight:"700"},
  debugTxt:{color:"#cfc2b8"},
  note:{color:"#bdaea5",marginTop:10,fontSize:12}
});
