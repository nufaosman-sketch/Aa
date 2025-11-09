// app/plugins/forensik.belerang.ui.standalone.card.tsx
// Bab 7 — Fokus Nama (ikut kitab). Auto detect ikut huruf Arab.
// - Satu keputusan jelas (unsur ghalib → planet utama).
// - "Kerja Unsur" ringkas.
// - "Butiran Planet Utama" (Arab + Melayu) termasuk Malaikat/Roh Penjuru.
// - Semua kad TERTUTUP secara default.
// - Stabil (tie-break) supaya jawapan tak bertukar-tukar.

// --------------------------------------------------
// Import
// --------------------------------------------------
import React, { useMemo, useState } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
import Accordion from "../components/Accordion";

// --------------------------------------------------
// Abjad Kabir
// --------------------------------------------------
const ABJAD: Record<string, number> = {
  "ا":1,"ب":2,"ج":3,"د":4,"ه":5,"و":6,"ز":7,"ح":8,"ط":9,
  "ي":10,"ك":20,"ل":30,"م":40,"ن":50,"س":60,"ع":70,"ف":80,"ص":90,
  "ق":100,"ر":200,"ش":300,"ت":400,"ث":500,"خ":600,"ذ":700,"ض":800,"ظ":900,"غ":1000,
  // variasi
  "أ":1,"إ":1,"آ":1,"ة":5,"ى":10,"ؤ":6,"ئ":10,"لا":31
};

// --------------------------------------------------
// Planet (IKUT KITAB – 1:1 daripada senarai yang kau beri)
// --------------------------------------------------
type PlanetKey = "الزهرة"|"الشمس"|"المريخ"|"المشتري"|"زحل"|"عطارد"|"القمر";

const PLANET: Record<PlanetKey, {
  huruf: string[];
  sifat?: string; darajah?: string;
  warna?: string; logam?: string;
  buruj?: string[]; hari?: string;
  malak?: string; ruhaniyah?: string[]; nota?: string;
}> = {
  "الزهرة": {
    huruf:["ف","ص","ق","ر"],
    sifat:"رطوبته كثيرة",
    warna:"الأخضر",
    logam:"نحاس",
    buruj:["الميزان","الثور"],
    ruhaniyah:["الجبهة","الأسعد"]
  },
  "الشمس": {
    huruf:["ه","م","ن","س","ع"],
    sifat:"حار رطب",
    warna:"الأصفر",
    logام:"ذهب",
    buruj:["الأسد"],
    hari:"الأحد",
    malak:"الجبهة"
  },
  "المريخ": {
    huruf:["ط","ي","ك","ل"],
    sifat:"حار يابس",
    darajah:"لين رطوبة",
    warna:"الذهب",
    logام:"ذهب",
    buruj:["الأسد"],
    hari:"الأحد",
    malak:"الجبهة"
  },
  "المشتري": {
    huruf:["ه","و","ز","ح"],
    sifat:"بارد وطلب",
    darajah:"بارد",
    warna:"الأبيض",
    logام:"المقلمي",
    malak:"إسرافيل",
    buruj:["الجبهة"]
  },
  "زحل": {
    huruf:["ا","ب","ج","د"],
    sifat:"بارد يابس",
    buruj:["الجدي","الدلو"],
    hari:"السبت",
    warna:"الأسود",
    logام:"الرصاص",
    malak:"ميمون",
    ruhaniyah:["الحوت"]
  },
  "عطارد": {
    huruf:["ش","ت","ث","خ"],
    buruj:["السنبلة"],
    hari:"الأربعاء",
    logام:"الزئبق",
    sifat:"علويه",
    malak:"عزرائيل",
    ruhaniyah:["برقان"]
  },
  "القمر": {
    huruf:["ذ","ض","ظ","غ"],
    sifat:"بارد رطب",
    buruj:["السرطان"],
    hari:"الاثنين",
    warna:"الفضي",
    logام:"الفضة",
    malak:"ميكائيل",
    ruhaniyah:["الارجا"],
    nota:"له العلم علويه"
  }
};

// Urutan tetap untuk tie-break supaya output stabil
const PLANET_ORDER: PlanetKey[] = ["زحل","المشتري","المريخ","الشمس","الزهرة","عطارد","القمر"];
const PLANET_HURUF: Record<PlanetKey,string[]> =
  Object.fromEntries(Object.entries(PLANET).map(([k,v])=>[k as PlanetKey, v.huruf])) as any;

// --------------------------------------------------
// Unsur → cadangan planet & hari (fallback jika tiada dominan huruf)
// --------------------------------------------------
const AUTO = {
  "Api":   { planets:["الشمس","المريخ"] as PlanetKey[], daysAr:["الأحد","الثلاثاء"], daysMs:["Ahad","Selasa"] },
  "Tanah": { planets:["زحل"] as PlanetKey[],            daysAr:["السبت"],             daysMs:["Sabtu"] },
  "Udara": { planets:["المشتري","عطارد"] as PlanetKey[],daysAr:["الخميس","الأربعاء"], daysMs:["Khamis","Rabu"] },
  "Air":   { planets:["القمر","الزهرة"] as PlanetKey[], daysAr:["الاثنين","الجمعة"],  daysMs:["Isnin","Jumaat"] },
} as const;

// --------------------------------------------------
// Media kerja unsur (ringkas)
// --------------------------------------------------
const MEDIA: Record<"Api"|"Udara"|"Air"|"Tanah", { ringkas:string; jalbah:string[]; tolak:string[]; }> = {
  Api:   { ringkas:"Unsur api: tulis di papan/pecahan, sumbu, telur, atau botol.",
           jalbah:["لوح/شقف (papan/tembikar)","فتيلة (sumbu)","بيضة (telur)","قارورة (botol)"],
           tolak:["Seperti di atas, niat tolak/batal"] },
  Udara: { ringkas:"Unsur udara: digantung/dibawa di udara.",
           jalbah:["تعليق (gantung tinggi)","حمل (arak/bawa di udara)"],
           tolak:["Seperti di atas, niat tolak/batal"] },
  Air:   { ringkas:"Unsur air: larut/siram/campak ke air.",
           jalbah:["Larutkan & siram","Campak ke air mengalir"],
           tolak:["Guna air sama lalu dibuang (niat tolak)"] },
  Tanah: { ringkas:"Unsur tanah: ditanam di bumi / tempat tertentu.",
           jalbah:["دفن (tanam) di tanah","Bawah ambang/tapak atau di simpang jalan"],
           tolak:["Seperti di atas, niat tolak/batal"] },
};

// --------------------------------------------------
// Darjat Unsur (dibetulkan: API = 2 darjat)
// --------------------------------------------------
const DARJAT_UNSUR: Record<"Api"|"Udara"|"Air"|"Tanah", { ar:string; ms:string; hurufCount?:number; nilai?:string }[]> = {
  Api: [
    { ar:"تار مستوقد",     ms:"Api menyala/bernyala (tār mustawqid)", hurufCount:28, nilai:"3969" },
    { ar:"نار تأكل وتشرب", ms:"Api yang makan & minum",               hurufCount:66, nilai:"30"   },
  ],
  Udara: [
    { ar:"هواء العشق والمحبة", ms:"Udara kasih & cinta",                hurufCount:66 },
    { ar:"جمع الطيور",        ms:"Pengumpulan burung-burung",          hurufCount:436 },
    { ar:"هواء بارد مفسد",    ms:"Udara sejuk yang merosakkan",        nilai:"500"  },
  ],
  Air: [
    { ar:"الماء العذب الفرات", ms:"Air tawar yang manis",               nilai:"94409" },
    { ar:"الماء المرّ",        ms:"Air pahit yang keras",               hurufCount:73 },
    { ar:"الماء الزعاق",       ms:"Air masin yang kuat",                nilai:"41972" },
    { ar:"ماء الودق (المطر)",  ms:"Air hujan tiada rasa",               hurufCount:94 },
    { ar:"الماء الثقيل على الإنسان", ms:"Air yang berat atas manusia", hurufCount:93 },
  ],
  Tanah: [
    { ar:"تراب الحب والزرع",   ms:"Tanah cinta & tanaman",              nilai:"2941 / 3124" },
    { ar:"تراب المعادن",       ms:"Tanah logam & galian",               nilai:"314" },
    { ar:"التراب المستعمل",    ms:"Tanah yang digunakan",               hurufCount:118 },
    { ar:"تراب السَبَاخ (tandus)", ms:"Tanah tandus",                   nilai:"19141" },
  ],
};

// --------------------------------------------------
// Util
// --------------------------------------------------
function sumAbjad(raw:string){
  const s=(raw||"").replace(/\s+/g,"");
  let total=0; const chars:string[]=[];
  for(let i=0;i<s.length;i++){
    if(i+1<s.length && s[i]==="ل" && s[i+1]==="ا"){ total+=31; chars.push("لا"); i++; continue; }
    const ch=s[i]; total+=ABJAD[ch]||0; chars.push(ch);
  }
  return { total, chars };
}
function unsurGhalib(chars:string[]):"Api"|"Tanah"|"Udara"|"Air"{
  const vals=chars.map(c=>ABJAD[c]||0); const top=Math.max(0,...vals);
  if(top>=400) return "Api";
  if(top>=100) return "Tanah";
  if(top>=40)  return "Udara";
  return "Air";
}
function planetDominanPertama(chars:string[]):PlanetKey|null{
  const score:Record<PlanetKey,number> = Object.fromEntries(PLANET_ORDER.map(p=>[p,0])) as any;
  for(const ch of chars){
    for(const p of PLANET_ORDER){
      if(PLANET_HURUF[p].includes(ch)) { score[p]++; }
    }
  }
  const max = Math.max(...Object.values(score));
  if(max<=0) return null;
  // Stabil: pilih mengikut PLANET_ORDER pertama yang mencapai maks
  return PLANET_ORDER.find(p=>score[p]===max) || null;
}

// --------------------------------------------------
// UI
// --------------------------------------------------
function Card(){
  const [nama,setNama]=useState("");

  const R = useMemo(()=>{
    const { total, chars } = sumAbjad(nama);
    const unsur = unsurGhalib(chars);
    const auto  = AUTO[unsur];
    const dom   = planetDominanPertama(chars);
    const planetUtama: PlanetKey = dom ?? auto.planets[0];
    const hariUtamaMs = auto.daysMs[0];
    const hariUtamaAr = auto.daysAr[0];
    return { unsur, total, panjang:chars.length, planetUtama, hariUtamaMs, hariUtamaAr };
  },[nama]);

  const kerja = MEDIA[R.unsur];
  const P = PLANET[R.planetUtama];

  // Helper label Arab+Melayu
  const Line = ({labelAr, labelMs, valueAr, valueMs}:{labelAr:string,labelMs:string,valueAr?:string,valueMs?:string})=>(
    <Text style={st.refLine}>
      <Text style={st.dim}>{labelAr}</Text> <Text>{valueAr ?? "-"}</Text>
      <Text style={st.dim}>  | {labelMs}</Text> <Text>{valueMs ?? "-"}</Text>
    </Text>
  );

  return (
    <ScrollView contentContainerStyle={{padding:12}}>
      <Text style={st.h1}>Bab 7 — Fokus Nama</Text>
      <Text style={st.sub}>Auto ikut kitab asal (Arab + Melayu). Semua kad tertutup secara default.</Text>

      <Accordion title="Nama" defaultOpen={false}>
        <Text style={st.label}>Nama (huruf Arab):</Text>
        <TextInput value={nama} onChangeText={setNama} style={st.input} placeholder="مثال: منير" placeholderTextColor="#7a7672"/>
      </Accordion>

      <Accordion title="Keputusan" defaultOpen={false}>
        <View style={st.panel}>
          <Text style={st.line}>Unsur ghalib: <Text style={st.hi}>{R.unsur}</Text></Text>
          <Text style={st.line}>Hari utama: <Text style={st.hi}>{R.hariUtamaMs}</Text> <Text style={st.dim}>({R.hariUtamaAr})</Text></Text>
          <Text style={st.line}>Planet utama: <Text style={st.hi}>{R.planetUtama}</Text></Text>
          <Text style={st.dim}>Ringkasan: huruf={R.panjang} • jumlah abjad={R.total}</Text>
        </View>
      </Accordion>

      <Accordion title="Kerja Unsur (berdasar nama)" defaultOpen={false}>
        <View style={st.refCard}>
          <Text style={st.refTitle}>{R.unsur}</Text>
          <Text style={st.refLine}>{kerja.ringkas}</Text>
          <Text style={st.titleSmall}>Jalbah</Text>
          {kerja.jalbah.map((t,i)=>(<Text key={i} style={st.bullet}>• {t}</Text>))}
          <Text style={st.titleSmall}>Tolak</Text>
          {kerja.tolak.map((t,i)=>(<Text key={i} style={st.bullet}>• {t}</Text>))}
          <Text style={st.tip}>Waktu elok: selepas Subuh, ketika zawāl, selepas Asar & tengah malam — ikut hari utama.</Text>
        </View>
      </Accordion>

      <Accordion title="Butiran Planet Utama (Arab + Melayu)" defaultOpen={false}>
        <View style={st.refCard}>
          <Text style={st.refTitle}>{R.planetUtama}</Text>
          <Line labelAr="حروف" labelMs="Huruf"
                valueAr={(P.huruf||[]).join(" ، ")} valueMs={(P.huruf||[]).join(", ")} />
          <Line labelAr="صفات" labelMs="Sifat" valueAr={P.sifat} valueMs={translateSifatMs(P.sifat)} />
          <Line labelAr="الدرجة" labelMs="Darjah" valueAr={P.darajah} valueMs={translateDarjahMs(P.darajah)} />
          <Line labelAr="الألوان" labelMs="Warna" valueAr={P.warna} valueMs={translateWarnaMs(P.warna)} />
          <Line labelAr="المعادن" labelMs="Logam" valueAr={P.logam} valueMs={translateLogamMs(P.logam)} />
          <Line labelAr="البروج" labelMs="Buruj (rasi)" valueAr={(P.buruj||[]).join(" ، ")} valueMs={translateBurujMs(P.buruj)} />
          <Line labelAr="اليوم" labelMs="Hari sesuai" valueAr={P.hari} valueMs={translateHariMs(P.hari)} />
          <Line labelAr="ملك/روح (Penjuru)" labelMs="Malaikat/Roh Penjuru"
                valueAr={[P.malak,(P.ruhaniyah||[]).join(" ، ")].filter(Boolean).join(" | ")}
                valueMs={translateRohMs(P.malak,P.ruhaniyah)} />
          {P.nota && <Text style={st.refNote}>Nota: {P.nota}</Text>}
        </View>
      </Accordion>

      <View style={{height:18}}/>
    </ScrollView>
  );
}

// --------------------------------------------------
// Terjemah ringkas Arab → BM (label nilai)
// --------------------------------------------------
function translateSifatMs(ar?:string){ if(!ar) return undefined;
  return ar
    .replace("حار يابس","Panas & kering")
    .replace("حار رطب","Panas & lembap")
    .replace("بارد يابس","Sejuk & kering")
    .replace("بارد وطلب","Sejuk; tabiat meminta/menarik")
    .replace("علويه","Cenderung ‘uluwī (tinggi/halus)")
    .replace("رطوبته كثيرة","Sangat lembap");
}
function translateDarjahMs(ar?:string){ if(!ar) return undefined;
  return ar.replace("لين رطوبة","Lembut & lembap").replace("بارد","Sejuk");
}
function translateWarnaMs(ar?:string){ if(!ar) return undefined;
  return ar.replace("الأصفر","Kuning")
           .replace("الأخضر","Hijau")
           .replace("الذهب","Kuning keemasan")
           .replace("الفضي","Perak")
           .replace("الأسود","Hitam")
           .replace("الأبيض","Putih");
}
function translateLogamMs(ar?:string){ if(!ar) return undefined;
  return ar.replace("ذهب","Emas").replace("الفضة","Perak").replace("الرصاص","Plumbum").replace("الزئبق","Raksa").replace("نحاس","Tembaga").replace("المقلمي","(al-Muqallamī)");
}
function translateBurujMs(list?:string[]){ if(!list||!list.length) return undefined;
  const map:Record<string,string>={"الأسد":"Asad (Singa)","الميزان":"Mīzān (Dacing)","الثور":"Thawr (Lembu)","الجدي":"Jady (Kambing)","الدلو":"Dalw (Kendi)","السنبلة":"Sunbula (Gandarusa)","السرطان":"Sartan (Cancer)"};
  return list.map(b=>map[b]||b).join(", ");
}
function translateHariMs(ar?:string){ if(!ar) return undefined;
  return ar.replace("الأحد","Ahad").replace("الأربعاء","Rabu").replace("الاثنين","Isnin").replace("السبت","Sabtu").replace("الخميس","Khamis").replace("الجمعة","Jumaat").replace("الثلاثاء","Selasa");
}
function translateRohMs(malak?:string, ruh?:string[]){ 
  const m = malak ? malak
    .replace("ميكائيل","Mīkāʾīl")
    .replace("عزرائيل","ʿAzrāʾīl")
    .replace("إسرافيل","Isrāfīl")
    .replace("الجبهة","Al-Jabhah")
    .replace("ميمون","Maimūn")
    : undefined;
  const r = (ruh&&ruh.length)? ruh.join(" ، ") : undefined;
  return [m, r?`(${r})`:undefined].filter(Boolean).join(" | ");
}

// --------------------------------------------------
// Styles
// --------------------------------------------------
const st = StyleSheet.create({
  h1:{ color:"#e8e6e3", fontSize:18, fontWeight:"900" },
  sub:{ color:"#9a9692", marginTop:4, marginBottom:8 },
  label:{ color:"#e8e6e3", fontWeight:"800" },
  input:{ color:"#e8e6e3", borderWidth:1, borderColor:"#333", borderRadius:8, padding:10, marginTop:6 },
  panel:{ borderWidth:1, borderColor:"#333", borderRadius:12, padding:12, gap:6 },
  line:{ color:"#e8e6e3", marginVertical:2 },
  hi:{ color:"#7bd88f", fontWeight:"800" },
  dim:{ color:"#b3aca7" },
  refCard:{ borderWidth:1, borderColor:"#333", borderRadius:10, padding:10, marginBottom:10 },
  refTitle:{ color:"#e8e6e3", fontWeight:"900", marginBottom:4 },
  refLine:{ color:"#e8e6e3", marginTop:2 },
  refNote:{ color:"#9a9692", fontStyle:"italic", marginTop:4 },
  bullet:{ color:"#e8e6e3", marginLeft:6, marginTop:2 },
  titleSmall:{ color:"#e8e6e3", fontWeight:"900", marginTop:8 },
  tip:{ color:"#9a9692", marginTop:6, fontStyle:"italic" },
});

// --------------------------------------------------
// Adapter (KEKAL NAMA & EXPORT DEFAULT)
// --------------------------------------------------
const ForensikBab7Standalone = {
  id: "forensik-bab7-standalone",
  label: "Bab 7 — Fokus Nama",
  render: Card,
};
export default ForensikBab7Standalone;
