import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Switch } from "react-native";

/** Gaya ringkas tema merah gelap */
const card     = { backgroundColor:"#111417", borderColor:"#2a2f36", borderWidth:1, borderRadius:12, padding:14, marginBottom:12 };
const title    = { color:"#e6e6e6", fontSize:16, fontWeight:"700", marginBottom:10 };
const label    = { color:"#a9b0b8", fontSize:12, marginBottom:6 };
const input    = { backgroundColor:"#0c0f12", borderColor:"#5a1f22", borderWidth:1, borderRadius:10, padding:10, color:"#eaeaea", marginBottom:10 };
const rowWrap  = { flexDirection:"row", justifyContent:"space-between", marginBottom:6 };
const rowL     = { color:"#a9b0b8" };
const rowR     = { color:"#e6e6e6", fontWeight:"600" };
const invalid  = { borderColor:"#ff4d4d" };

const toInt = (v: string) => {
  const n = parseInt((v ?? "").trim(), 10);
  return Number.isFinite(n) ? n : NaN;
};

export const HijriManualSection: React.FC = () => {
  const [autoHijri, setAutoHijri] = useState(false);
  const [hari, setHari]   = useState(""); // 1..7
  const [bulan, setBulan] = useState(""); // 1..12

  const hariNum = useMemo(() => {
    if (autoHijri) return 0;
    const n = toInt(hari);
    return n >= 1 && n <= 7 ? n : 0;
  }, [hari, autoHijri]);

  const bulanNum = useMemo(() => {
    if (autoHijri) return 0;
    const n = toInt(bulan);
    return n >= 1 && n <= 12 ? n : 0;
  }, [bulan, autoHijri]);

  return (
    <>
      {/* Tetapan Hijri (Manual) */}
      <View style={card}>
        <Text style={title}>Tetapan Hijri (Manual)</Text>

        <Text style={label}>Hari Hijri (1–7)</Text>
        <TextInput
          value={hari}
          onChangeText={setHari}
          keyboardType="number-pad"
          placeholder="cth: 3"
          placeholderTextColor="#896d6d"
          style={[input, (hariNum===0 && hari) ? invalid : null]}
        />

        <Text style={label}>Bulan Hijri (1–12)</Text>
        <TextInput
          value={bulan}
          onChangeText={setBulan}
          keyboardType="number-pad"
          placeholder="cth: 2"
          placeholderTextColor="#896d6d"
          style={[input, (bulanNum===0 && bulan) ? invalid : null]}
        />

        <View style={{flexDirection:"row", alignItems:"center", marginTop:6}}>
          <Text style={[label, {marginRight:8}]}>Auto Hijri (ikut tarikh)</Text>
          <Switch value={autoHijri} onValueChange={setAutoHijri}/>
        </View>
      </View>

      {/* Profil Hayat (terkait input di atas) */}
      <View style={card}>
        <Text style={title}>Profil Hayat (Hijri — Hook Manual)</Text>

        <View style={rowWrap}><Text style={rowL}>Hari Lahir (1–7)</Text><Text style={rowR}>{hariNum}</Text></View>
        <View style={rowWrap}><Text style={rowL}>Bulan Hijri (1–12)</Text><Text style={rowR}>{bulanNum}</Text></View>

        {(!autoHijri && (hari && hariNum===0)) && (
          <Text style={{color:"#ff8080", marginTop:6}}>Hari mesti antara 1 hingga 7.</Text>
        )}
        {(!autoHijri && (bulan && bulanNum===0)) && (
          <Text style={{color:"#ff8080", marginTop:2}}>Bulan mesti antara 1 hingga 12.</Text>
        )}

        <Text style={{color:"#6b737c", fontSize:11, marginTop:10}}>
          Nota: Jika Auto Hijri aktif, nilai manual diabaikan (0). Nanti boleh sambung auto-convert Greg → Hijri.
        </Text>
      </View>
    </>
  );
};
