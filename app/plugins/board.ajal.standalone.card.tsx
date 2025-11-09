/* ——— LAUH AL-MAMĀT: PAPAN AJAL (Standalone) ——— */
import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Accordion from "../components/Accordion"; import type { ExplainAdapter } from "../adapters/types";
const ACCENT="#ff4d57";
const Box:React.FC<{alt?:boolean;children:any}> = ({alt,children})=>(
  <View style={{backgroundColor:alt?"#0f0a10":"#14090b",borderRadius:12,padding:12,marginBottom:10,borderWidth:1,borderColor:alt?"#2a1230":"#2a0e14"}}>{children}</View>);
const Row:React.FC<{l:string;r:string|number;c?:string}> = ({l,r,c="#e8e6e3"})=>(
  <View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:6}}>
    <Text style={{color:"#c9c6c2"}}>{l}</Text><Text style={{color:c,fontWeight:"700"}}>{String(r)}</Text></View>);
const Chip:React.FC<{label:string;active:boolean;onPress:()=>void;color?:string}> = ({label,active,onPress,color})=>(
  <TouchableOpacity onPress={onPress} style={{paddingVertical:6,paddingHorizontal:12,borderRadius:20,backgroundColor:active?(color||ACCENT):"transparent",borderWidth:1,borderColor:color||"#555",marginRight:8,marginBottom:8}}>
    <Text style={{color:active?"#fff":color||"#ccc",fontWeight:"600",fontSize:12}}>{label}</Text></TouchableOpacity>);
type TaMode="ha"|"ta";

/** Normalisasi — kekalkan signature & toggle, TETAPI ة sentiasa 0 (dibuang) */
function norm(input:string,taMode:TaMode){
  const s=(input||"")
    .replace(/[^\u0600-\u06FF]/g,"")
    .replace(/[ًٌٍَُِْٰـۭۣۢۚۗۙۛۜ۟۠ۡۢۤۧۨ]/g,"");
  return [...s].map(ch=>{
    if(ch==="ة") return "";                    // ⇦ neutralize ta marbuta → 0
    if(ch==="أ"||ch==="إ"||ch==="آ") return "ا";
    if(ch==="ى") return "ي";
    return ch;
  }).join("");
}

/** ABJAD — pastikan ي, و, ء, ة = 0 (fail-safe) */
const ABJ:Record<string,number>={
  "ا":1,"ب":2,"ج":3,"د":4,
  "ه":5,                // kekal
  "و":0,"ز":7,"ح":8,"ط":9,
  "ي":0,"ك":20,"ل":30,"م":40,"ن":50,"س":60,"ع":70,"ف":80,"ص":90,
  "ق":100,"ر":200,"ش":300,"ت":400,"ث":500,"خ":600,"ذ":700,"ض":800,"ظ":900,"غ":1000,
  "ء":0,"لا":31,"ة":0    // ⇦ tambah "ة":0 sebagai backup
};

const sum=(raw:string)=>{if(!raw)return 0;let s=raw.trim(),t=0;s=s.replace(/لا/g,()=>{t+=31;return""});for(const ch of s)t+=ABJ[ch]??0;return t;}
const wrap=(n:number,b:number)=>((Math.trunc(n)-1)%b+b)%b+1; const b30=(n:number)=>((Math.trunc(n)%30)+30)%30||30;
const UNSUR=[{k:1,n:"Api",m:"Tenaga permulaan; akhiri dengan tawaduk."},{k:2,n:"Angin",m:"Akal/kalam; wasiat jelas."},{k:3,n:"Air",m:"Kasih; maaf & damai."},{k:4,n:"Tanah",m:"Amanah; sempurnakan hutang."}] as const;
const PLANET=[{k:1,n:"Zuhal",m:"Ujian/pembersihan; sabar & tertib."},{k:2,n:"Musytari",m:"Lapang; syukur & sedekah."},{k:3,n:"Marikh",m:"Sengketa; redakan tergesa."},{k:4,n:"Matahari",m:"Nama/kepimpinan; ikhlas, elak pamer."},{k:5,n:"Zuhrah",m:"Kasih; lembutkan tutur."},{k:6,n:"Utarid",m:"Tulisan/dagang; dokumen jelas."},{k:7,n:"Bulan",m:"Rumah; doa & malam."}] as const;
const BURJ=[{k:1,n:"Hamal",u:"Api",m:"Penutup berani."},{k:2,n:"Thawr",u:"Tanah",m:"Sempurna harta."},{k:3,n:"Jawza",u:"Angin",m:"Pesan ilmu."},{k:4,n:"Sartan",u:"Air",m:"Damai di rumah."},{k:5,n:"Asad",u:"Api",m:"Akhir mulia."},{k:6,n:"Sumbulah",u:"Tanah",m:"Tertib."},{k:7,n:"Mizan",u:"Angin",m:"Adil."},{k:8,n:"Aqrab",u:"Air",m:"Taubat & tutup rahsia."},{k:9,n:"Qaws",u:"Api",m:"Husnuzan."},{k:10,n:"Jadi",u:"Tanah",m:"Tanggungjawab akhir."},{k:11,n:"Dalw",u:"Angin",m:"Pesan komuniti."},{k:12,n:"Hut",u:"Air",m:"Lembut & reda."}] as const;
const fasa=(b:number)=>{const v=b30(b);if(v<=10)return{t:"Fasa Pembukaan Akhir",s:"Susun fail & mula wasiat."};if(v<=20)return{t:"Fasa Ujian Akhir",s:"Kawal emosi; kemas hutang/urusan."};return{t:"Fasa Penutupan Akhir",s:"Tutup kitaran; maaf & reda."};}
const MOM:{[k:number]:{label:string;nota:string}}={1:{label:"Muharram",nota:"Taubat & amanah."},2:{label:"Safar",nota:"Sabar & doa malam."},3:{label:"Rabiʿ I",nota:"Ilmu & nasihat."},4:{label:"Rabiʿ II",nota:"Dokumen & saksi."},5:{label:"Jumādā I",nota:"Senarai aset/asnaf."},6:{label:"Jumādā II",nota:"Lengkapkan perjanjian."},7:{label:"Rajab",nota:"Istighfar & damai."},8:{label:"Shaʿbān",nota:"Silaturahim & maaf."},9:{label:"Ramaḍān",nota:"Sedekah & tilawah."},10:{label:"Shawwāl",nota:"Istiqāmah."},11:{label:"Dhū al-Qaʿdah",nota:"Rancang serahan."},12:{label:"Dhū al-Ḥijjah",nota:"Sempurnakan nazar & hutang."}};

const CardAjalStandalone:ExplainAdapter={ id:"board-ajal-standalone", label:"Lauh al-Mamāt — Papan Ajal (Standalone)", render(){
  const [ta,setTa]=useState<TaMode>("ha"); const [diri,setDiri]=useState(""); const [ibu,setIbu]=useState(""); const [isteri,setIsteri]=useState(""); const [anak,setAnak]=useState<string[]>(Array.from({length:12},()=>"" )); const [bulan,setBulan]=useState<string>("");
  const nDiri=useMemo(()=>sum(norm(diri,ta)),[diri,ta]); const nIbu=useMemo(()=>sum(norm(ibu,ta)),[ibu,ta]); const nIst=useMemo(()=>sum(norm(isteri,ta)),[isteri,ta]); const nAnak=useMemo(()=>anak.map(a=>sum(norm(a,ta))),[anak,ta]);
  const total=nDiri+nIbu+nIst+nAnak.reduce((s,v)=>s+v,0); const B30=b30(total); const m4=wrap(total,4), m7=wrap(total,7), m12=wrap(total,12);
  const U=UNSUR.find(x=>x.k===m4)!, P=PLANET.find(x=>x.k===m7)!, B=BURJ.find(x=>x.k===m12)!; const F=fasa(B30);
  const monthNum=Math.max(1,Math.min(12,parseInt(bulan||"0",10)||0)); const Mom=MOM[monthNum];
  const setAnakAt=(i:number,v:string)=>setAnak(p=>p.map((x,idx)=>idx===i?v:x)); const clear=()=>{setDiri("");setIbu("");setIsteri("");setAnak(Array.from({length:12},()=>"" ));setBulan("");};
  const pct=Math.round((B30/30)*100);
  return(<Accordion title="Lauh al-Mamāt — Papan Ajal (Standalone)"><ScrollView nestedScrollEnabled>
    <Box>
      <Text style={{color:ACCENT,fontWeight:"800",marginBottom:8}}>Input (Jawi/Arab)</Text>
      <Text style={{color:"#e8e6e3"}}>Nama Diri</Text><TextInput value={diri} onChangeText={setDiri} placeholder="cth: علي" placeholderTextColor="#777" style={{color:"#e8e6e3",borderColor:"#2a0e14",borderWidth:1,borderRadius:8,padding:8,marginBottom:8}}/>
      <Text style={{color:"#e8e6e3"}}>Nama Ibu</Text><TextInput value={ibu} onChangeText={setIbu} placeholder="cth: فاطمة" placeholderTextColor="#777" style={{color:"#e8e6e3",borderColor:"#2a0e14",borderWidth:1,borderRadius:8,padding:8,marginBottom:8}}/>
      <Text style={{color:"#e8e6e3"}}>Nama Isteri (opsyenal)</Text><TextInput value={isteri} onChangeText={setIsteri} placeholder="cth: زينب" placeholderTextColor="#777" style={{color:"#e8e6e3",borderColor:"#2a0e14",borderWidth:1,borderRadius:8,padding:8,marginBottom:10}}/>
      <Text style={{color:"#e8e6e3",marginBottom:6}}>Anak (hingga 12)</Text>
      <View style={{flexDirection:"row",flexWrap:"wrap"}}>
        {anak.map((v,i)=>(<View key={i} style={{width:"48%",marginRight:"2%",marginBottom:8}}>
          <Text style={{color:"#c9c6c2",fontSize:12}}>Anak {i+1}</Text>
          <TextInput value={v} onChangeText={(t)=>setAnakAt(i,t)} placeholder="—" placeholderTextColor="#777" style={{color:"#e8e6e3",borderColor:"#2a0e14",borderWidth:1,borderRadius:8,padding:8}}/>
        </View>))}
      </View>
      <Text style={{color:"#e8e6e3",marginTop:6}}>Bulan Hijri (1–12)</Text>
      <TextInput value={bulan} onChangeText={setBulan} keyboardType="number-pad" placeholder="cth: 12" placeholderTextColor="#777" style={{color:"#e8e6e3",borderColor:"#2a0e14",borderWidth:1,borderRadius:8,padding:8,marginTop:4}}/>
      {/* Kekal toggle, tapi jelaskan neutral */}
      <Text style={{color:"#e8e6e3",marginTop:8,marginBottom:6}}>Ta marbūṭah (ة) — kini sentiasa (0)</Text>
      <View style={{flexDirection:"row"}}>
        <Chip label="dikira ه (0)" active={ta==="ha"} onPress={()=>setTa("ha")} color="#888"/>
        <Chip label="dikira ت (0)" active={ta==="ta"} onPress={()=>setTa("ta")} color="#888"/>
      </View>
      <TouchableOpacity onPress={clear} style={{marginTop:8}}><Text style={{color:"#9a9692",textDecorationLine:"underline"}}>Kosongkan semua</Text></TouchableOpacity>
    </Box>

    <Box alt>
      <Text style={{color:"#e8e6e3",fontWeight:"800",marginBottom:6}}>Ringkasan Ajal</Text>
      <Row l="Jumlah Nasab (D+Ibu+Isteri+Anak)" r={total} c={ACCENT}/><Row l="Baki 30" r={B30} c={ACCENT}/><Row l="Bulan Hijri" r={bulan||"—"}/>
      <View style={{marginTop:8}}><Text style={{color:"#cfcac7"}}>Progress Khātimah: {pct}%</Text><View style={{height:8,backgroundColor:"#1a1012",borderRadius:6}}><View style={{height:8,width:`${pct}%`,backgroundColor:ACCENT,borderRadius:6}}/></View></View>
      <Text style={{color:"#9a9692",marginTop:6,fontSize:12}}>Bulan = momentum simbolik (muhasabah, bukan ramalan).</Text>
    </Box>

    <Box><Text style={{color:"#e8e6e3",fontWeight:"800",marginBottom:6}}>Unsur & Pengaruh</Text><Row l="Unsur (mod4)" r={U.n}/><Text style={{color:"#c9c6c2"}}>{U.m}</Text></Box>
    <Box alt><Row l="Planet (mod7)" r={P.n}/><Text style={{color:"#c9c6c2"}}>{P.m}</Text></Box>
    <Box><Row l="Burj (mod12)" r={`${B.n} (${B.u})`}/><Text style={{color:"#c9c6c2"}}>{B.m}</Text></Box>

    <Box alt><Text style={{color:"#e8e6e3",fontWeight:"800",marginBottom:6}}>Fasa Takdir (Baki 30)</Text><Row l="Fasa" r={F.t} c="#ffb3b8"/><Text style={{color:"#c9c6c2"}}>Saran: {F.s}</Text></Box>

    <Box>
      <Text style={{color:"#e8e6e3",fontWeight:"800",marginBottom:6}}>Momentum Khātimah (Bulan Hijri)</Text>
      <View style={{flexDirection:"row",flexWrap:"wrap"}}>{Array.from({length:12},(_,i)=>i+1).map(n=>(<Chip key={n} label={`${n}`} active={`${n}`===bulan} onPress={()=>setBulan(String(n))} color="#888"/>))}</View>
      <Row l="Momentum" r={Mom?Mom.label:"—"}/><Text style={{color:"#c9c6c2"}}>{Mom?Mom.nota:"Pilih 1–12 untuk nota momentum."}</Text>
    </Box>

    <Box alt>
      <Text style={{color:"#e8e6e3",fontWeight:"800",marginBottom:6}}>Wasiat & Adab</Text>
      <Text style={{color:"#c9c6c2"}}>• Segera <Text style={{fontWeight:"700",color:"#e6d3d4"}}>bayar hutang</Text> & kemaskan dokumen.</Text>
      <Text style={{color:"#c9c6c2"}}>• Amalkan <Text style={{fontWeight:"700",color:"#e6d3d4"}}>Al-Mulk</Text>, <Text style={{fontWeight:"700",color:"#e6d3d4"}}>As-Sajdah</Text> & <Text style={{fontWeight:"700",color:"#e6d3d4"}}>Yā-Sīn</Text> setiap hari.</Text>
      <Text style={{color:"#c9c6c2"}}>• Banyakkan istighfar, maafkan & minta dimaafkan.</Text>
    </Box>

    <Text style={{color:"#9a9692",fontSize:12,marginTop:6}}>Rujukan gaya: Shams (al-Būnī) + momentum bulan untuk muhasabah.</Text>
  </ScrollView></Accordion>); } };
export default CardAjalStandalone;
