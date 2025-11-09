// === app/index.tsx — Versi Gaming (y,h,w,hamza,ta marbuta = 0; hooks kekal) ===
import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, Switch,
  StatusBar, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import Accordion from "./components/Accordion";
import AdapterHub from "./adapters/AdapterHub";
import VideoSlider from "./components/VideoSlider";

const theme = {
  bg:"#0b000d",          // hitam keunguan pekat
  card:"#1a001a",        // kad ungu gelap
  cardAlt:"#26001f",     // variasi kad berbaur merah
  text:"#ffffff",        // teks putih
  textSub:"#d8b8d8",     // teks sekunder ungu lembut
  accent:"#ff0044",      // merah tumpuan
  accentDim:"#800022",   // merah gelap
  border:"#400040",      // sempadan ungu gelap
  inputBg:"#160016",     // input ungu-hitam
  inputBorder:"#660033", // sempadan input
  pill:"#24001a"         // pill/button dasar
};

// ABJAD — kosongkan ي ه و ء ة
const ABJAD = {
  "ا":1,"ب":2,"ج":3,"د":4,
  "ه":5,"و":0,"ي":0,"ء":0,"ة":0,
  "ز":7,"ح":8,"ط":9,
  "ك":20,"ل":30,"م":40,"ن":50,"س":60,"ع":70,"ف":80,"ص":90,
  "ق":100,"ر":200,"ش":300,"ت":400,"ث":500,"خ":600,"ذ":700,"ض":800,"ظ":900,"غ":1000
};
const STRIP=/[\u064B-\u065F\u0670\u06D6-\u06ED\u0610-\u061A\u0640\u200c\u200d\ufeff]/g;

// Kekalkan signature normalizeArabic(str, ta) & semua hook; kita cuma neutralize huruf tertentu
function normalizeArabic(str, ta){
  return (str||"")
    .replace(STRIP,"")
    .replace(/[أإآٱ]/g,"ا")
    .replace(/[ى]/g,"ي")
    .replace(/[ؤ]/g,"و")  // carrier ke huruf yang nilai 0
    .replace(/[ئ]/g,"ي")  // carrier ke huruf yang nilai 0
    .replace(/ة/g,"");    // buang terus → 0
}

const abjadSum=(s,ta)=>[...normalizeArabic(s,ta)].reduce((a,c)=>a+(ABJAD[c]||0),0);
const toInt=v=>parseInt((v||"").replace(/[^\d]/g,""))||0;
const baki30=n=>!n?0:(n%30||30);

export default function IndexScreen(){
  const [hariHijriManual,setHari]=useState(""),[bulanHijriManual,setBulan]=useState(""),[autoHijri,setAuto]=useState(true);
  // KEKAL semua hook UI (termasuk toggle Ta) walaupun nilai ة kini 0
  const [taIs5,setTa]=useState(true),taVal=taIs5?5:400;

  const [nama,setNama]=useState(""),[ibu,setIbu]=useState(""),[isteri,setIsteri]=useState(""),[anak,setAnak]=useState(Array(12).fill(""));

  const aDiri=useMemo(()=>abjadSum(nama,taVal),[nama,taVal]);
  const aIbu=useMemo(()=>abjadSum(ibu,taVal),[ibu,taVal]);
  const aIsteri=useMemo(()=>abjadSum(isteri,taVal),[isteri,taVal]);
  const aAnak=useMemo(()=>anak.map(x=>abjadSum(x,taVal)),[anak,taVal]);

  const jumlahNama=useMemo(()=>[nama,ibu,isteri,...anak].filter(x=>(x||"").trim()).length,[nama,ibu,isteri,anak]);
  const jumlahIbu=1,jumlahIsteri=useMemo(()=>isteri.trim()?1:0,[isteri]);
  const jumlahAnak=useMemo(()=>aAnak.filter((_,i)=>anak[i].trim()).length,[aAnak,anak]);

  const hariLahir=useMemo(()=>Math.max(0,Math.min(7,toInt(hariHijriManual))),[hariHijriManual]);
  const bulanHijri=useMemo(()=>Math.max(0,Math.min(12,toInt(bulanHijriManual))),[bulanHijriManual]);

  const totalKeluarga=useMemo(()=>{
    const anakSum=aAnak.reduce((s,x,i)=>s+(anak[i].trim()?x:0),0);
    return aDiri+aIbu+aIsteri+anakSum;
  },[aDiri,aIbu,aIsteri,aAnak,anak]);

  const onChangeAnak=(i,v)=>setAnak(a=>{const b=[...a];b[i]=v;return b;});

  return(
  <SafeAreaView style={s.safe}><StatusBar barStyle="light-content"/><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==="ios"?"padding":undefined}>
  <ScrollView contentContainerStyle={s.container}>
  <Text style={s.title}>🌿SAINS HURUF</Text>

    {/* KEKAL AdapterHub & props */}
    <AdapterHub
      aDiri={(typeof aDiri!=="undefined"? aDiri:0)}
      aIbu={(typeof aIbu!=="undefined"? aIbu:0)}
      aIsteri={(typeof aIsteri!=="undefined"? aIsteri:0)}
      aAnakJumlah={(typeof aAnakJumlah!=="undefined"? aAnakJumlah: (typeof aAnak!=="undefined"? aAnak.reduce((s,v)=>s+(Number.isFinite(v)?v:0),0):0))}
      aKeluarga={(typeof aKeluarga!=="undefined"? aKeluarga: ((typeof aDiri!=="undefined"?aDiri:0)+(typeof aIbu!=="undefined"?aIbu:0)+(typeof aIsteri!=="undefined"?aIsteri:0)+(typeof aAnakJumlah!=="undefined"?aAnakJumlah:0)))}
      hariLahir={(typeof hariLahir!=="undefined"? hariLahir:0)}
      bulanHijri={(typeof bulanHijri!=="undefined"? bulanHijri:0)}
      baki30={(typeof baki30==="function"? baki30: (n=> ((n%30)||30) ))}
    />

  <Text style={s.footer}> Pertubuhan Kebajikan Bank Makanan Batu Pahat -   Ali Taqiuddin alFalaki Whatsapp  +601128718919</Text>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>);
}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:theme.bg},container:{padding:16,paddingBottom:40,gap:12},
  title:{color:theme.text,fontSize:18,fontWeight:"800",textAlign:"center",marginBottom:6},
  text:{color:theme.text},accTitle:{color:theme.text,fontWeight:"700",fontSize:14},
  accSub:{color:theme.textSub,fontSize:12},
  card:{backgroundColor:theme.card,borderColor:theme.border,borderWidth:1,borderRadius:12,padding:12},
  label:{color:theme.textSub,marginBottom:6,marginTop:10},smallLabel:{color:theme.textSub,marginBottom:6},
  smallNote:{color:theme.textSub,fontSize:12,marginTop:4,marginBottom:4},
  input:{backgroundColor:theme.inputBg,color:theme.text,borderWidth:1,borderColor:theme.inputBorder,borderRadius:10,paddingHorizontal:12,paddingVertical:10},
  row:{flexDirection:"row",gap:12},hijriField:{flex:1},
  switchRow:{marginTop:10,paddingVertical:6,borderTopWidth:1,borderTopColor:theme.border,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  switchLabel:{color:theme.text},
  pillRow:{flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:8},
  pill:{backgroundColor:theme.pill,color:theme.text,paddingHorizontal:10,paddingVertical:6,borderRadius:999,borderWidth:1,borderColor:theme.border},
  box:{backgroundColor:theme.cardAlt,borderWidth:1,borderColor:theme.border,borderRadius:12,padding:10,gap:4,marginTop:6},
  line:{color:theme.text},accent:{color:theme.accent,fontWeight:"700"},
  footer:{textAlign:"center",color:theme.textSub,marginTop:12},
});
