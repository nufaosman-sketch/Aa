// app/plugins/forensik.bab7.darjat.card.tsx
// Kad: Darjat al-Ism (Auto)
// - Auto detect: jumlah Abjad (Kabir) → Darjat al-Ism = (jumlah % 4) || 4
// - Auto unsur (ringkas, stabil) daripada huruf nama
// - Peta Darjat → deskripsi per unsur:
//     Api: 2 darjat (ikut teks: "هواء النار — تار مستوقد", "نار تأكل وتشرب")
//     Udara: 5 darjat
//     Air:   5 darjat
//     Tanah: 4 darjat
// - Semua panel defaultOpen={false}
// - Import/export gaya standard: default export { id,label,render }

import React, { useMemo, useState } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
import Accordion from "../components/Accordion";

/* Abjad Kabir */
const ABJAD: Record<string, number> = {
  "ا":1,"ب":2,"ج":3,"د":4,"ه":5,"و":6,"ز":7,"ح":8,"ط":9,
  "ي":10,"ك":20,"ل":30,"م":40,"ن":50,"س":60,"ع":70,"ف":80,"ص":90,
  "ق":100,"ر":200,"ش":300,"ت":400,"ث":500,"خ":600,"ذ":700,"ض":800,"ظ":900,"غ":1000,
  // variasi lazim
  "أ":1,"إ":1,"آ":1,"ة":5,"ى":10,"ؤ":6,"ئ":10,"لا":31
};

/** Util asas */
function splitLetters(raw:string){
  const s=(raw||"").replace(/\s+/g,"");
  const chars:string[]=[];
  for(let i=0;i<s.length;i++){
    if(i+1<s.length && s[i]==="ل" && s[i+1]==="ا"){ chars.push("لا"); i++; continue; }
    chars.push(s[i]);
  }
  return chars;
}
function sumAbjad(chars:string[]){ return chars.reduce((a,c)=>a+(ABJAD[c]||0),0); }

/** Penentuan Unsur (ringkas, konsisten)
 * Kaedah: lihat nilai abjad tertinggi dalam nama:
 *   ≥400 → Api, ≥100 → Tanah, ≥40 → Udara, selain itu → Air
 * (Kaedah ini dipakai sebelum ini untuk stabilkan keputusan bila huruf campur.)
 */
type Unsur = "Api"|"Udara"|"Air"|"Tanah";
function unsurDominan(chars:string[]):Unsur{
  const top=Math.max(0,...chars.map(c=>ABJAD[c]||0));
  if(top>=400) return "Api";
  if(top>=100) return "Tanah";
  if(top>=40)  return "Udara";
  return "Air";
}

/** Darjat al-Ism (ikut arahan: bahagi 4)
 * Darjat = (jumlah % 4); jika 0 → 4
 */
function darjatAlIsm(jumlah:number){ const r=jumlah%4; return r===0?4:r; }

/** Data Darjat per Unsur (Arab + Melayu, ikut petikan yang kau beri)
 * Nota: Api memang ada 2 darjat sahaja dalam teks. Unsur lain mengikut 5/4 darjat yang diberi.
 */
const DARJAT: Record<Unsur, {
  title: string,
  items: Array<{
    ar?: string,   // label ringkas Arab jika ada
    bm: string,    // penjelasan Bahasa Melayu
    huruf?: string // info huruf/nombor jika ada dalam teks
  }>
}> = {
  Api: {
    title: "دارجات النار — Darjat API",
    items: [
      { ar:"هواء النار — تَار مُستوقد", bm:"Udara Api: nyalaan pencetus (tār mustawqid). Kuat untuk penyalaan niat/permulaan kerja." },
      { ar:"نار تأكل وتشرب", bm:"Api yang makan dan minum: daya konsumtif/transformasi bahan. Sesuai untuk kerja yang perlu 'membinasakan' atau 'menghabiskan' halangan." },
    ]
  },
  Udara: {
    title: "درجات الهواء — Darjat UDARA",
    items: [
      { bm:"Udara yang bermanfaat di darat & laut; tiupan membawa faedah." , huruf:"(bilangan diketahui dalam teks)"},
      { bm:"—", ar:"(ruang untuk darjat 2 — ikut teks)", },
      { bm:"Udara kasih & cinta; mengikat mahabbah.", huruf:"حروفه ٦٦" },
      { bm:"Pengumpulan burung (himpun yang berpecah).", huruf:"حروفه ٤٣٦" },
      { bm:"Udara sejuk yang merosakkan; perlu berhati-hati.", huruf:"٥٠٠" },
    ]
  },
  Air: {
    title: "درجات الماء — Darjat AIR",
    items: [
      { bm:"Air tawar yang manis (عذب فرات).", huruf:"عدد الحروف ٩٤٤٠٩" },
      { bm:"Air pahit yang keras (مُرّ تين).", huruf:"حروفه ٧٣" },
      { bm:"Air masin yang kuat (زعاق).", huruf:"حروفه ٤١٩٧٢" },
      { bm:"Air hujan yang tiada rasa (ودق لا طعم له).", huruf:"حروفه ٩٤" },
      { bm:"Air yang berat atas manusia.", huruf:"يبسط ٩٣" },
    ]
  },
  Tanah: {
    title: "درجات التراب — Darjat TANAH",
    items: [
      { bm:"Tanah cinta & tanaman (الحب والزرع).", huruf:"بسط ٢٩٤١ • أعداد ٣١٢٤" },
      { bm:"Tanah logam & galian (المعادن).", huruf:"٣١٤" },
      { bm:"Tanah yang digunakan (المستعمل).", huruf:"١١٨" },
      { bm:"Tanah tandus (السِّبَاخ) — tiada tumbuhan.", huruf:"١٩١٤١" },
    ]
  }
};

/** Pemilihan darjat mengikut Unsur:
 * - Jika Api: hanya 2 darjat → peta 1,2,3,4 → [1,2,1,2] (stabil)
 * - Unsur lain: guna indeks (darjat-1); jika darjat > jumlah senarai, clamp ke terakhir.
 */
function pilihDarjat(unsur:Unsur, darjat:number){
  const arr = DARJAT[unsur].items;
  if(unsur==="Api"){
    const map = {1:0, 2:1, 3:0, 4:1} as Record<number,number>;
    return arr[map[darjat]];
  }
  const idx = Math.max(0, Math.min(arr.length-1, darjat-1));
  return arr[idx];
}

/** Hari ikut unsur (cadangan utama) */
const HARI_UNSUR: Record<Unsur,{ar:string, ms:string}> = {
  Api:   { ar:"الأحد",   ms:"Ahad"   },
  Tanah: { ar:"السبت",   ms:"Sabtu"  },
  Udara: { ar:"الخميس",  ms:"Khamis" },
  Air:   { ar:"الاثنين", ms:"Isnin"  },
};

/** Media kerja unsur (ringkas — ikut petikan arahan bahan) */
const MEDIA: Record<Unsur,{tajuk:string, jalbah:string[], tolak:string[]}> = {
  Api: {
    tajuk:"Kerja Unsur Api",
    jalbah:["Tulis pada papan/pecahan (لوح/شقف)","Guna sumbu (فتيلة)","Telur (بيضة)","Botol kaca (قارورة)"],
    tolak:["Guna media sama dengan niat membatalkan/menolak, kemudian dimusnahkan dengan api"]
  },
  Udara: {
    tajuk:"Kerja Unsur Udara",
    jalbah:["Digantung tinggi (تعليق)","Dibawa/diarak (حَمل)"],
    tolak:["Diturunkan & dipisahkan aliran angin; niat menolak lalu disimpan/diambil jarak"]
  },
  Air: {
    tajuk:"Kerja Unsur Air",
    jalbah:["Larut dalam air kemudian disiram","Campak ke air mengalir"],
    tolak:["Larut dalam air lalu dibuang (niat menolak)"]
  },
  Tanah: {
    tajuk:"Kerja Unsur Tanah",
    jalbah:["Ditabur/ditanam di tanah","Di bawah aliran air / simpang jalan / kubur (ikut tujuan)"],
    tolak:["Korek balik atau pindah lokasi dengan niat pembatalan"]
  }
};

function Card(){
  const [nama, setNama] = useState("مونير");

  const R = useMemo(()=>{
    const chars = splitLetters(nama);
    const jumlah = sumAbjad(chars);
    const unsur = unsurDominan(chars);
    const darjat = darjatAlIsm(jumlah);
    const terpilih = pilihDarjat(unsur, darjat);
    const hari = HARI_UNSUR[unsur];
    return { chars, jumlah, unsur, darjat, terpilih, hari };
  },[nama]);

  const kerja = MEDIA[R.unsur];

  return (
    <ScrollView contentContainerStyle={{padding:12}}>
      <Text style={st.h1}>Bab 7 — Darjat al-Ism (Auto)</Text>
      <Text style={st.sub}>Masukkan nama (huruf Arab). Sistem auto tentukan Unsur & Darjat berdasarkan jumlah Abjad.</Text>

      <Accordion title="Nama" defaultOpen={false}>
        <Text style={st.label}>Nama (huruf Arab):</Text>
        <TextInput value={nama} onChangeText={setNama} style={st.input}/>
      </Accordion>

      <Accordion title="Keputusan" defaultOpen={false}>
        <View style={st.panel}>
          <Text style={st.line}>Unsur ghalib: <Text style={st.hi}>{R.unsur}</Text></Text>
          <Text style={st.line}>Darjat al-Ism: <Text style={st.hi}>{R.darjat}</Text><Text style={st.dim}> / 4</Text></Text>
          <Text style={st.line}>Hari sesuai: <Text style={st.hi}>{R.hari.ms}</Text> <Text style={st.dim}>({R.hari.ar})</Text></Text>
          <Text style={st.dim}>Huruf: {R.chars.length} • Jumlah Abjad: {R.jumlah}</Text>
        </View>
      </Accordion>

      <Accordion title="Darjat (Ikut Unsur & Nama)" defaultOpen={false}>
        <View style={st.refCard}>
          <Text style={st.refTitle}>{DARJAT[R.unsur].title}</Text>
          {R.terpilih ? (
            <>
              {R.terpilih.ar ? <Text style={st.bullet}>• {R.terpilih.ar}</Text> : null}
              <Text style={st.bullet}>• {R.terpilih.bm}</Text>
              {R.terpilih.huruf ? <Text style={st.bullet}>• Info huruf/nilai: {R.terpilih.huruf}</Text> : null}
              {R.unsur==="Api" && <Text style={st.tip}>Nota: Unsur Api dalam teks hanya menyebut 2 darjat. Pemetaannya: 1→Darjat 1, 2→Darjat 2, 3→Darjat 1, 4→Darjat 2.</Text>}
            </>
          ) : (
            <Text style={st.warn}>Deskripsi darjat untuk kombinasi ini belum lengkap dalam teks. (Tiada reka-cipta.)</Text>
          )}
        </View>
      </Accordion>

      <Accordion title="Kerja Mengikut Unsur (Ringkas)" defaultOpen={false}>
        <View style={st.refCard}>
          <Text style={st.refTitle}>{kerja.tajuk}</Text>
          <Text style={st.titleSmall}>Jalbah (Menarik):</Text>
          {kerja.jalbah.map((t,i)=>(<Text key={i} style={st.bullet}>• {t}</Text>))}
          <Text style={st.titleSmall}>Tolak (Menolak/Membatal):</Text>
          {kerja.tolak.map((t,i)=>(<Text key={i} style={st.bullet}>• {t}</Text>))}
          <Text style={st.dim}>Ikut hari sesuai di atas. Semua panel ditutup secara asal untuk elak kekeliruan.</Text>
        </View>
      </Accordion>
    </ScrollView>
  );
}

/* Styles */
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
  bullet:{ color:"#e8e6e3", marginLeft:6, marginTop:2 },
  titleSmall:{ color:"#e8e6e3", fontWeight:"900", marginTop:8 },
  tip:{ color:"#9a9692", marginTop:6, fontStyle:"italic" },
  warn:{ color:"#ffb86c" },
});

/* Adapter (jangan ubah pola export/import lain) */
const ForensikBab7Darjat = {
  id: "forensik-bab7-darjat",
  label: "Bab 7 — Darjat al-Ism (Auto)",
  render: Card,
};
export default ForensikBab7Darjat;
