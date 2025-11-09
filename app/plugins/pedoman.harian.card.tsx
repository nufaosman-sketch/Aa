import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import Accordion from "../components/Accordion";
import type { ExplainAdapter } from "../adapters/types";

/* ---------------- UI helpers ---------------- */
const Box: React.FC<{alt?:boolean; children:any}> = ({alt, children}) => (
  <View style={{
    backgroundColor: alt ? "#0f0a10" : "#14090b",
    borderRadius:12, padding:12, marginBottom:10,
    borderWidth:1, borderColor: alt? "#2a1230" : "#2a0e14"
  }}>{children}</View>
);
const Row: React.FC<{l:string; r:string|number; c?:string}> = ({l,r,c="#e8e6e3"}) => (
  <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:6}}>
    <Text style={{color:"#c9c6c2"}}>{l}</Text>
    <Text style={{color:c, fontWeight:"700"}}>{String(r)}</Text>
  </View>
);
const Btn:React.FC<{label:string; onPress:()=>void; alt?:boolean}> = ({label,onPress,alt})=>(
  <TouchableOpacity onPress={onPress} style={{
    paddingVertical:8,paddingHorizontal:12,borderRadius:10,marginRight:8,marginBottom:8,
    backgroundColor: alt?"transparent":"#1e2a22",
    borderWidth:1,borderColor: alt?"#444":"#2f7a53"
  }}>
    <Text style={{color:alt?"#ddd":"#9ff3c7",fontWeight:"700"}}>{label}</Text>
  </TouchableOpacity>
);

/* ---------------- Types & constants ---------------- */
type Warna = "Hijau"|"Putih"|"Kuning"|"Merah"|"Hitam";
type Blok = "Pagi"|"Siang"|"Tengah"|"Zuhur"|"Asar";

/**
 * Jadual 24 jam:
 *  - Siang (label & kunci sama)
 *  - Malam: label paparan = nama planet, tapi rujuk kunci warna siang (blokKey)
 *    [start, end, blokKey, displayLabel]
 */
const BLOK_JAM_24: ReadonlyArray<readonly [string,string,Blok,string]> = [
  ["06:00","08:30","Pagi","Pagi"],
  ["08:30","10:30","Siang","Siang"],
  ["11:00","12:00","Tengah","Tengah"],
  ["12:30","16:00","Zuhur","Zuhur"],
  ["16:00","18:00","Asar","Asar"],
  // MALAM — bahasa astrologi
  ["18:00","20:30","Pagi","Jam Zuhrah (Venus)"],
  ["20:30","22:30","Siang","Jam Syams (Sun)"],
  ["22:30","23:30","Tengah","Jam Qamar (Moon)"],
  ["23:30","03:00","Zuhur","Jam Zohal (Saturn)"],
  ["03:00","06:00","Asar","Jam Musytari (Jupiter)"],
] as const;

/** Pedoman warna 1..30 (pola 5-hari berulang) — ikut buku */
const PEDOMAN: Record<number, Record<Blok,Warna>> = (() => {
  const seqs: Warna[][] = [
    ["Kuning","Hitam","Putih","Merah","Hijau"],
    ["Hijau","Kuning","Hitam","Putih","Merah"],
    ["Merah","Hijau","Kuning","Hitam","Putih"],
    ["Putih","Merah","Hijau","Kuning","Hitam"],
    ["Hitam","Putih","Merah","Hijau","Kuning"],
  ];
  const days: Record<number, Record<Blok,Warna>> = {};
  for (let d=1; d<=30; d++){
    const row = seqs[(d-1)%5];
    const [Pagi,Siang,Tengah,Zuhur,Asar] = row;
    days[d] = { Pagi, Siang, Tengah, Zuhur, Asar };
  }
  return days;
})();

const colorWarna: Record<Warna,string> = {
  Hijau:"#39d98a", Putih:"#e8e6e3", Kuning:"#ffd166", Merah:"#ff4d57", Hitam:"#222"
};
const labelWarna: Record<Warna,string> = {
  Hijau:"REZEKI — masa terbaik bergerak/urus peluang.",
  Putih:"TENANG — neutral, sesuai runding & susun kerja.",
  Kuning:"WASPADA — jalan ada halangan kecil, bergerak cermat.",
  Merah:"SELAMAT — baik untuk urusan asas & keluarga.",
  Hitam:"HALANGAN — tunda jika boleh; banyakkan doa & perlindungan.",
};

/* ---------------- Helpers ---------------- */
const toMin = (s:string)=>{ const [H,M]=s.split(":").map(Number); return H*60+M; };
const nowMYMinutes = ()=>{ const t=new Date(); return t.getHours()*60+t.getMinutes(); };
const wrap30 = (n:number)=> ((n-1)%30+30)%30 + 1;

/** Tentukan warna aktif mengikut jadual 24 jam penuh */
function warna24Jam(day:number, mins:number): Warna {
  const key = wrap30(day);
  const row = PEDOMAN[key];
  for (const [a,z,blokKey] of BLOK_JAM_24){
    const s = toMin(a), e = toMin(z);
    const inRange = (s < e) ? (mins >= s && mins < e) : (mins >= s || mins < e); // rentang lintas tengah malam
    if (inRange) return row[blokKey];
  }
  return "Putih";
}

/* ---------------- Main Card (UI asal dikekalkan) ---------------- */
const CardPedomanHarian: ExplainAdapter = {
  id: "pedoman-harian-24h",
  label: "Pedoman Harian 24-Jam — Siang Ulang Malam (Astrologi)",
  render(){
    const [hijriRaw,setHijriRaw] = useState("1");   // input manual 1..30
    const [offset,setOffset] = useState(0);         // offset ±
    const [startMaghrib,setStartMaghrib] = useState(true); // toggle mula hari pada Maghrib

    // auto refresh setiap 30s
    const [,setTick]=useState(0);
    useEffect(()=>{ const id=setInterval(()=>setTick(x=>x+1),30000); return ()=>clearInterval(id); },[]);

    const mins = nowMYMinutes();
    const base = Math.max(1, Math.min(30, Math.trunc(Number(hijriRaw||"1"))));
    const afterMaghrib = mins >= toMin("18:00");

    const dayApplied = useMemo(()=>{
      const bump = (startMaghrib && afterMaghrib) ? 1 : 0;
      return wrap30(base + offset + bump);
    }, [base, offset, startMaghrib, afterMaghrib]);

    const warnaNow = warna24Jam(dayApplied, mins);

    const now = new Date(); const hh=String(now.getHours()).padStart(2,"0"); const mm=String(now.getMinutes()).padStart(2,"0");

    return (
      <Accordion title="Pedoman Harian 24-Jam — Siang Ulang Malam (Astrologi)">
        {/* Kawalan manual (dikekalkan) */}
        <Box alt>
          <Text style={{color:"#c9c6c2",marginBottom:8,fontWeight:"700"}}>Tetapan</Text>
          <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
            <Text style={{color:"#aaa",marginRight:8}}>Tarikh Hijri (1–30):</Text>
            <TextInput
              value={hijriRaw}
              onChangeText={setHijriRaw}
              keyboardType="number-pad"
              style={{minWidth:60,color:"#fff",borderWidth:1,borderColor:"#444",borderRadius:8,paddingHorizontal:10,paddingVertical:6,marginRight:10}}
            />
            <Btn label="+1" onPress={()=>setOffset(o=>o+1)}/>
            <Btn label="-1" onPress={()=>setOffset(o=>o-1)}/>
            <Text style={{color:"#aaa",marginLeft:10}}>Offset: {offset}</Text>
          </View>
          <View style={{flexDirection:"row",alignItems:"center"}}>
            <Text style={{color:"#aaa",marginRight:8}}>Mula hari pada Maghrib</Text>
            <Switch value={startMaghrib} onValueChange={setStartMaghrib}/>
          </View>
        </Box>

        {/* Status sekarang */}
        <Box>
          <Text style={{color:"#ff4d57",fontWeight:"800",marginBottom:8}}>Status Sekarang</Text>
          <Row l="Jam" r={`${hh}:${mm}`} />
          <Row l="Hari Hijri" r={dayApplied}/>
          <Row l="Warna" r={warnaNow} c={colorWarna[warnaNow]} />
          <Text style={{color:"#aaa",marginTop:6}}>{labelWarna[warnaNow]}</Text>
        </Box>

        {/* Jadual 24 Jam (siang + malam, malam = planet) */}
        <Box>
          <Text style={{color:"#fff",fontWeight:"700",marginBottom:6}}>Jadual 24-Jam (Siang & Malam)</Text>
          {BLOK_JAM_24.map(([a,z,blokKey,display],i)=>(
            <View key={i} style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:5,borderBottomColor:"#2a0e14",borderBottomWidth:1}}>
              <Text style={{color:"#c9c6c2"}}>{display} ({a}–{z})</Text>
              <Text style={{color:colorWarna[PEDOMAN[dayApplied][blokKey]],fontWeight:"700"}}>
                {PEDOMAN[dayApplied][blokKey]}
              </Text>
            </View>
          ))}
        </Box>
      </Accordion>
    );
  }
};
export default CardPedomanHarian;
