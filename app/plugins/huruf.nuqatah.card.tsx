import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Accordion from "../components/Accordion";
import type { ExplainAdapter } from "../adapters/types";

/**
 * ============================================================
 *  HURUF — TITIK LEMAH & SIRR (al-Būnī × Ibn ʿArabī) — v2 (kemas)
 *  — Overwrite penuh tanpa ubah hook/struktur eksport
 *
 *  PEMBETULAN UTAMA
 *  1) KEDUDUKAN TITIK:
 *     - TOP (atas):  ف ق ث ت ن خ ز ض ذ ظ غ
 *     - BOTTOM (bawah):  ب ي
 *     - NO DOTS (tiada titik):  ا د ر س ص ط ع ل م ه و ك ح ش ء
 *     (Nota: set ini fokus huruf yang konsisten; jīm ج ber-titik bawah,
 *     tetapi kita asingkan daripada metrik top/bottom agar Imbalance fokus
 *     pada huruf yang 100% konsisten dalam semua bentuk.)
 *
 *  2) UNSUR 28 HURUF (ringkas gaya Shams al-Maʿārif):
 *     Api:   ا ط ظ ف ق ر ء ت
 *     Angin: ك س ش ز ث ع
 *     Air:   م و ن ه ح ج خ
 *     Tanah: ب ل ص ض ذ غ ي د
 *
 *  3) PENJELASAN SUMBER (KOMEN):
 *     - “Sirr al-Nuqṭah” (Ibn ʿArabī/al-Jīlī) = simbolisme titik (atas/bawah/zāhir).
 *       Digunakan sebagai tafsir simbolik, BUKAN formula klasik kiraan personal.
 *     - “Unsur huruf” (al-Būnī) = kerangka klasik empat unsur; diadaptasi ringkas
 *       untuk metrik “unsur tiada = titik lemah unsur (moden)”.
 *
 *  CATATAN:
 *  — Kod kekal useState/useMemo, ExplainAdapter, Accordion seperti asal.
 *  — UI & label sama; hanya peta/tafsir & nota diperkemas.
 * ============================================================
 */

/* ===== UI helpers (tema merah) ===== */
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
const Chip:React.FC<{label:string;active:boolean;onPress:()=>void;color?:string}> = ({label,active,onPress,color}) => (
  <TouchableOpacity onPress={onPress} style={{
    paddingVertical:6,paddingHorizontal:12,borderRadius:20,
    backgroundColor:active?(color||"#ff4d57"):"transparent",
    borderWidth:1,borderColor:color||"#555",marginRight:8,marginBottom:8
  }}>
    <Text style={{color:active?"#fff":color||"#ccc",fontWeight:"600",fontSize:12}}>{label}</Text>
  </TouchableOpacity>
);
const BulletList:React.FC<{items:string[]}> = ({items}) => (
  <View style={{marginTop:6}}>
    {items.map((t,i)=>(<Text key={i} style={{color:"#c9c6c2", marginBottom:4}}>{`\u2022 ${t}`}</Text>))}
  </View>
);

/* ===== Normalisasi huruf & mod ta marbūṭah ===== */
type TaMode = "ha" | "ta";
function normChars(input:string, taMode:TaMode){
  const s = (input||"")
    .replace(/[^\u0600-\u06FF]/g,"") // huruf Arab sahaja
    .replace(/[ًٌٍَُِْٰـۭۣۢۚۗۙۛۜ۟۠ۡۢۤۧۨ]/g,"") // buang diacritics
    .replace(/أ|إ|آ/g,"ا")
    .replace(/ى/g,"ي");
  const arr = [...s].map(ch=>{
    if (ch==="ة") return taMode==="ta" ? "ت" : "ه";
    return ch;
  });
  return arr;
}

/**
 * ===== Sirr al-Nuqṭah (simbolik) — set titik dikemas =====
 *   ATAS:   ف ق ث ت ن خ ز ض ذ ظ غ
 *   BAWAH:  ب ي
 *   TIADA:  ا د ر س ص ط ع ل م ه و ك ح ش ء
 *
 * Nota sumber:
 * — “Titik” di sini ialah simbolisme sirr al-nuqṭah (Ibn ʿArabī/al-Jīlī)
 *   tentang arah ruhani (ʿuluw/sufl) & zahir — bukan formula klasik kuantitatif.
 */
const TOP_DOTS = new Set(["ف","ق","ث","ت","ن","خ","ز","ض","ذ","ظ","غ"]);
const BTM_DOTS = new Set(["ب","ي"]);
const NO_DOTS  = new Set(["ا","د","ر","س","ص","ط","ع","ل","م","ه","و","ك","ح","ش","ء"]);
// Huruf bertitik lain (tidak masuk Imbalance Top/Bottom, tetapi dikira total-dots jika perlu)
const OTHER_DOTTED = new Set(["ج"]); // jīm: 1 titik bawah (kita asingkan dari metrik Top/Bottom)

/* ===== Peta unsur 28 huruf (ringkas gaya Shams al-Maʿārif) =====
 *  Api:   ا ط ظ ف ق ر ء ت
 *  Angin: ك س ش ز ث ع
 *  Air:   م و ن ه ح ج خ
 *  Tanah: ب ل ص ض ذ غ ي د
 */
const HURUF_UNSUR:Record<string,"Api"|"Angin"|"Air"|"Tanah"> = {
  // Api
  "ا":"Api","ط":"Api","ظ":"Api","ف":"Api","ق":"Api","ر":"Api","ء":"Api","ت":"Api",
  // Angin
  "ك":"Angin","س":"Angin","ش":"Angin","ز":"Angin","ث":"Angin","ع":"Angin",
  // Air
  "م":"Air","و":"Air","ن":"Air","ه":"Air","ح":"Air","ج":"Air","خ":"Air",
  // Tanah
  "ب":"Tanah","ل":"Tanah","ص":"Tanah","ض":"Tanah","ذ":"Tanah","غ":"Tanah","ي":"Tanah","د":"Tanah"
};
const UNSUR_LIST = ["Api","Angin","Air","Tanah"] as const;
const colorByUnsur=(u?:string)=>u==="Api"?"#ff4d57":u==="Tanah"?"#b48b5a":u==="Angin"?"#77c0ff":u==="Air"?"#7bd1c9":"#e8e6e3";

/* ===== Tafsir gabungan (moden bersumberkan simbol & unsur) ===== */
const tafsirUnsurLemah: Record<typeof UNSUR_LIST[number], string[]> = {
  Api:   ["Kurang semangat & inisiatif.", "Latih keputusan kecil harian.", "Zikir al-Qahhār; sujud malam."],
  Angin: ["Kurang komunikasi/fleksibiliti.", "Ringkaskan mesej, buat senarai 3.", "Zikir al-Wadūd; adab salam."],
  Air:   ["Kurang empati/kelembutan.", "Time-box emosi & dengar aktif.", "Zikir al-Raḥmān; jaga wudu’."],
  Tanah: ["Kurang struktur/istiqāmah.", "Pecah tugasan mikro; jadual.", "Zikir al-Ṣabūr; rehat berjadual."]
};
const tafsirDots = {
  top:  ["Arah ‘uluw (atas): cita & kepimpinan.", "Risiko keras/ego — latih tawadhu’.", "Gunakan kuasa untuk khidmat."],
  btm:  ["Arah sufl (bawah): batin & empati.", "Risiko tenggelam emosi — pasang sempadan.", "Malam tenang & muhasabah."],
  none: ["Zāhir/grounding (tiada titik).", "Risiko kering rasa — tambah tafakkur.", "Lambatkan reaksi; dengar dulu."]
};

/* ===== Komponen Kad ===== */
const CardNuqatah: ExplainAdapter = {
  id: "huruf-nuqatah",
  label: "Huruf — Titik Lemah & Sirr (al-Būnī × Ibn ʿArabī)",
  render() {
    const [nama,setNama] = useState("");
    const [ta,setTa]     = useState<TaMode>("ha");

    const H = useMemo(()=>normChars(nama,ta),[nama,ta]);

    // Kiraan titik & metrik tambahan
    const counts = useMemo(()=>{
      let top=0, btm=0, none=0, other=0;
      for (const h of H) {
        if (BTM_DOTS.has(h)) btm++;
        else if (TOP_DOTS.has(h)) top++;
        else if (NO_DOTS.has(h))  none++;
        else if (OTHER_DOTTED.has(h)) other++;
        else none++; // default selamat
      }
      const total = H.length;
      const totalDots = top + btm + other;
      const imbalance = totalDots ? Math.abs(top - btm) / totalDots : 0; // 0..1
      const density   = total ? totalDots / total : 0; // 0..1
      return {top, btm, none, other, total, totalDots, imbalance, density};
    },[H]);

    // Kiraan unsur
    const unsurCount = useMemo(()=>{
      const u = {Api:0, Angin:0, Air:0, Tanah:0} as Record<typeof UNSUR_LIST[number],number>;
      for (const h of H) {
        const k = HURUF_UNSUR[h];
        if (k) u[k] += 1;
      }
      return u;
    },[H]);

    const unsurTiada = useMemo(()=>{
      return (UNSUR_LIST.filter(u=>unsurCount[u]===0));
    },[unsurCount]);

    // Dominan & lemah relatif
    const unsMax = Math.max(...UNSUR_LIST.map(u=>unsurCount[u]));
    const unsMin = Math.min(...UNSUR_LIST.map(u=>unsurCount[u]));
    const unsurDominan = UNSUR_LIST.filter(u=>unsurCount[u]===unsMax);
    const unsurLemah   = UNSUR_LIST.filter(u=>unsurCount[u]===unsMin);

    return (
      <Accordion title="Huruf — Titik Lemah & Sirr (al-Būnī × Ibn ʿArabī)">
        {/* Input */}
        <Box>
          <Text style={{color:"#ff4d57",fontWeight:"800",marginBottom:8}}>Input (Jawi/Arab)</Text>
          <TextInput
            value={nama}
            onChangeText={setNama}
            placeholder="cth: علي  /  فاطمة"
            placeholderTextColor="#777"
            style={{color:"#e8e6e3",borderColor:"#2a0e14",borderWidth:1,borderRadius:8,padding:8}}
          />
          <View style={{flexDirection:"row", marginTop:8}}>
            <Chip label="ة → ه (5)" active={ta==="ha"} onPress={()=>setTa("ha")} color="#888" />
            <Chip label="ة → ت (400)" active={ta==="ta"} onPress={()=>setTa("ta")} color="#888" />
          </View>
          <Text style={{color:"#9a9692",marginTop:6,fontSize:12}}>
            Nota: normalisasi buang baris, samakan alif (أ/إ/آ → ا), ى→ي, dan ta marbūṭah ikut pilihan.
          </Text>
        </Box>

        {/* Jejak Titik (Sirr al-Nuqṭah — simbolik Ibn ʿArabī) */}
        <Box alt>
          <Text style={{color:"#e8e6e3",fontWeight:"800",marginBottom:6}}>Jejak Titik (Sirr al-Nuqṭah — Ibn ʿArabī, tafsir simbolik)</Text>
          <Row l="Titik atas"  r={counts.top}/>
          <Row l="Titik bawah" r={counts.btm}/>
          <Row l="Huruf tiada titik" r={counts.none}/>
          <Row l="Huruf bertitik lain (ج)" r={counts.other}/>
          <Row l="Jumlah huruf" r={counts.total}/>
          <Row l="Jumlah titik (anggar.)" r={counts.totalDots}/>
          <Row l="Imbalance |top−btm|/titik" r={counts.imbalance.toFixed(2)}/>
          <Row l="Kepadatan titik / huruf" r={counts.density.toFixed(2)}/>
          <BulletList items={[
            ...(counts.top  ? [`Atas menonjol → potensi kepimpinan; kawal ego & pamer.`] : []),
            ...(counts.btm  ? [`Bawah menonjol → batin/empati; pasang sempadan emosi.`] : []),
            ...(counts.none ? [`Huruf tanpa titik menonjol → kuat zahir/grounding; tambah tafakkur.`] : [])
          ]}/>
          {!counts.total && <Text style={{color:"#777"}}>Taip nama untuk melihat tafsiran.</Text>}
          <Text style={{color:"#9a9692",marginTop:6,fontSize:11}}>
            Nota sumber: “titik” di sini ialah simbolisme sirr al-nuqṭah (Ibn ʿArabī/al-Jīlī) — bukan formula klasik kiraan peribadi.
          </Text>
        </Box>

        {/* Unsur (al-Būnī, ringkas) */}
        <Box>
          <Text style={{color:"#e8e6e3",fontWeight:"800",marginBottom:6}}>Unsur Huruf (al-Būnī, ringkas)</Text>
          <View style={{flexDirection:"row", flexWrap:"wrap", gap:8}}>
            {UNSUR_LIST.map(u=>(
              <View key={u} style={{paddingVertical:6,paddingHorizontal:10,borderRadius:8, borderWidth:1, borderColor:"#2a0e14", backgroundColor:"#12090b", marginRight:8, marginBottom:8}}>
                <Text style={{color:colorByUnsur(u), fontWeight:"700"}}>{u}</Text>
                <Text style={{color:"#c9c6c2"}}>{unsurCount[u]} huruf</Text>
              </View>
            ))}
          </View>

          {/* Unsur tiada = titik lemah unsur (moden) */}
          <Text style={{color:"#e8e6e3",fontWeight:"700",marginTop:6}}>Unsur Tiada</Text>
          <Text style={{color: unsurTiada.length? "#ffb3b8" : "#9a9692"}}>
            {unsurTiada.length ? unsurTiada.join(", ") : "— lengkap —"}
          </Text>
          {unsurTiada.length>0 && (
            <View style={{marginTop:6}}>
              {unsurTiada.map(u=>(
                <View key={u} style={{marginBottom:6}}>
                  <Text style={{color:colorByUnsur(u), fontWeight:"700"}}>• {u}</Text>
                  <BulletList items={tafsirUnsurLemah[u]} />
                </View>
              ))}
            </View>
          )}

          {/* Dominan vs Lemah (relatif) */}
          <View style={{marginTop:10}}>
            <Text style={{color:"#e8e6e3",fontWeight:"700"}}>Dominan (relatif)</Text>
            <Text style={{color:"#c9c6c2"}}>{unsurDominan.join(", ")||"—"}</Text>
            <Text style={{color:"#e8e6e3",fontWeight:"700",marginTop:6}}>Lemah (relatif)</Text>
            <Text style={{color:"#c9c6c2"}}>{unsurLemah.join(", ")||"—"}</Text>
          </View>

          <Text style={{color:"#9a9692",marginTop:8,fontSize:11}}>
            Nota sumber: peta unsur berasaskan kerangka Shams al-Maʿārif (al-Būnī) — versi ringkas & praktikal untuk aplikasi.
          </Text>
        </Box>

        {/* Saran tazkiyah ringkas */}
        <Box alt>
          <Text style={{color:"#e8e6e3",fontWeight:"800",marginBottom:6}}>Saran Tazkiyah (ringkas)</Text>
          <BulletList items={[
            "Api → tunda reaksi 10s, rancang sebelum balas.",
            "Angin → mod fokus, mesej ringkas, senarai 3 perkara.",
            "Air → sempadan empati, tidur konsisten, pelindung rumah.",
            "Tanah → pecahkan tugasan, KPI mingguan, rehat bergerak."
          ]}/>
          <Text style={{color:"#9a9692",marginTop:6,fontSize:12}}>
            Baca sebagai muhasabah/adab — bukan ramalan. Elak ritual/azimat.
          </Text>
        </Box>

        <Text style={{color:"#9a9692",fontSize:11,marginTop:4}}>
          Sumber inspirasi: tradisi Shams al-Maʿārif (al-Būnī) & Futūḥāt (Ibn ʿArabī) — disusun secara moden & selamat.
        </Text>
      </Accordion>
    );
  }
};

export default CardNuqatah;
