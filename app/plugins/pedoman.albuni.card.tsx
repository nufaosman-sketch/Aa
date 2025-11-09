// app/plugins/pedoman.albuni.card.tsx
import React, { useMemo, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Accordion from "../components/Accordion";
import type { ExplainAdapter } from "../adapters/types";

/** ====== al-Būnī: Jam Planet (Chaldean) ====== */
type Warna = "Hijau" | "Putih" | "Kuning" | "Merah" | "Hitam";
type Planet = "Saturn" | "Jupiter" | "Mars" | "Sun" | "Venus" | "Mercury" | "Moon";

const CHALDEAN: Planet[] = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"]; // urutan jam
const DAY_PLANET: Planet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]; // 0=Ahad..6=Sabtu

const planetColor: Record<Planet, Warna> = {
  Saturn: "Hitam", Jupiter: "Kuning", Mars: "Merah", Sun: "Kuning",
  Venus: "Hijau", Mercury: "Hijau", Moon: "Putih",
};
const colorHex: Record<Warna, string> = {
  Hijau: "#39d98a", Putih: "#e8e6e3", Kuning: "#ffd166", Merah: "#ff4d57", Hitam: "#222",
};
const label: Record<Warna, string> = {
  Hijau: "Rezeki — masa terbaik bergerak/urus peluang.",
  Putih: "Tenang — neutral, sesuai runding & susun kerja.",
  Kuning: "Waspada — ada halangan kecil, bergerak cermat.",
  Merah: "Selamat — baik untuk urusan asas & keluarga.",
  Hitam: "Halangan — tunda jika boleh; perlindungan & doa.",
};

const pad2 = (n: number) => String(n).padStart(2, "0");

/* ===== Util masa MY & tarikh (stabil APK/Hermes) =====
   Kaedah: shift masa peranti ke MYT (UTC+8) secara matematik.
   MYT = UTC+8 = -480 min getTimezoneOffset representation (tiada DST). */
const TZ_MY_OFFSET_MIN = -480;
function __tzShift(d: Date, targetOffsetMin: number){
  const here = d.getTimezoneOffset();              // minit (cth: +480 di MY)
  const delta = targetOffsetMin - here;            // beza MY vs peranti
  return new Date(d.getTime() + delta*60000);
}
function nowMY(){ return __tzShift(new Date(), TZ_MY_OFFSET_MIN); }
function minutesNowMY(){ const d = nowMY(); return d.getHours()*60 + d.getMinutes(); }

/* ===== Astronomi: Sunrise/Sunset (NOAA approx, offline) ===== */
const DEG = Math.PI/180;
function clamp(x:number, a:number, b:number){ return Math.max(a, Math.min(b, x)); }

/** Kiraan sunrise/sunset (minit tempatan 0..1440). tzHours = offset, contoh +8 untuk MY. */
function calcSunTimesLatLon(d: Date, latDeg: number, lonDeg: number, tzHours: number) {
  const N = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(),0,0)) / 86400000);
  const lngHour = lonDeg / 15;

  function solarTime(isSunrise:boolean){
    const t = N + ((isSunrise?6:18) - lngHour)/24;
    const M = (0.9856 * t - 3.289) * DEG;
    const L = (M + (1.916*Math.sin(M)) + (0.020*Math.sin(2*M)) + 282.634*DEG) % (2*Math.PI);
    const RA = Math.atan(0.91764 * Math.tan(L));
    let RAdeg = (RA/DEG);
    const Lquadrant  = Math.floor((L/DEG)/90) * 90;
    const RAquadrant = Math.floor(RAdeg/90) * 90;
    RAdeg = RAdeg + (Lquadrant - RAquadrant);
    RAdeg /= 15;

    const sinDec = 0.39782 * Math.sin(L);
    const cosDec = Math.cos(Math.asin(sinDec));
    const zenith = 90.833*DEG; // standard civil sunrise/sunset
    const cosH = (Math.cos(zenith) - (sinDec*Math.sin(latDeg*DEG))) / (cosDec*Math.cos(latDeg*DEG));
    const H = (isSunrise? 360 - Math.acos(clamp(cosH,-1,1))/DEG : Math.acos(clamp(cosH,-1,1))/DEG) / 15;
    const T = H + RAdeg - 0.06571*t - 6.622;
    const UT = (T - lngHour) % 24;
    const localT = (UT + tzHours + 24) % 24;
    return Math.round(localT*60); // minutes 0..1440
  }

  const sunrise = solarTime(true);
  const sunset  = solarTime(false);
  return { sunrise, sunset };
}

/* ===== Kiraan Jam Planet ===== */
function hourPlanet(day0Sun: number, hourIndex: number): Planet {
  const first = DAY_PLANET[day0Sun];
  const shift = CHALDEAN.indexOf(first);
  return CHALDEAN[(shift + (hourIndex % 7)) % 7];
}

/** Mod klasik 60m bermula 06:00 */
function planetNowClassic(day0Sun:number, minutes:number){
  const start = 6*60; // 06:00
  const idx = Math.floor(Math.max(0, minutes - start)/60); // 0..23
  return { hourIndex: idx, planet: hourPlanet(day0Sun, idx) };
}

/** Mod falak 1/12 siang & 1/12 malam, hari ikut sunrise */
function planetNowFalak(date: Date, lat:number, lon:number, tzHours:number){
  const wd = date.getDay(); // 0=Ahad..6=Sabtu (civil)
  const { sunrise, sunset } = calcSunTimesLatLon(date, lat, lon, tzHours);
  const nowMin = date.getHours()*60 + date.getMinutes();

  const dayIndexBySunrise = (nowMin < sunrise) ? ( (wd + 6) % 7 ) : wd;
  const isDay = nowMin >= sunrise && nowMin < sunset;

  const dayLen = (sunset - sunrise + 1440) % 1440;      // minit siang
  const nightLen = (1440 - dayLen);                     // minit malam
  const dayHour = dayLen / 12;                          // panjang jam siang
  const nightHour = nightLen / 12;                      // panjang jam malam

  let hourIndex: number;
  if (isDay){
    hourIndex = Math.floor((nowMin - sunrise)/dayHour);
    hourIndex = clamp(hourIndex, 0, 11);
  } else {
    const afterSunset = (nowMin >= sunset) ? nowMin - sunset : nowMin + (1440 - sunset);
    hourIndex = 12 + Math.floor(afterSunset / nightHour);
    hourIndex = clamp(hourIndex, 12, 23);
  }
  return { hourIndex, planet: hourPlanet(dayIndexBySunrise, hourIndex), sunrise, sunset, isDay, dayIndexBySunrise, dayHour, nightHour };
}

/* ===== UI helpers ===== */
const Box: React.FC<{ alt?: boolean; children: any }> = ({ alt, children }) => (
  <View style={{
    backgroundColor: alt ? "#0f0a10" : "#14090b",
    borderRadius: 12, padding: 12, marginBottom: 10,
    borderWidth: 1, borderColor: alt ? "#2a1230" : "#2a0e14",
  }}>{children}</View>
);
const Row: React.FC<{ l: string; r: string; c?: string }> = ({ l, r, c }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
    <Text style={{ color: "#c9c6c2" }}>{l}</Text>
    <Text style={{ color: c || "#e8e6e3", fontWeight: "700" }}>{r}</Text>
  </View>
);
const Chip: React.FC<{ label: string; active?: boolean; onPress: () => void; color?: string }> = ({label,active,onPress,color="#888"}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}
    style={{ paddingVertical:6, paddingHorizontal:12, borderRadius:20, backgroundColor:active?color:"transparent",
      borderWidth:1, borderColor:color, marginRight:8, marginBottom:8 }}>
    <Text style={{ color: active?"#fff":color, fontWeight:"700", fontSize:12 }}>{label}</Text>
  </TouchableOpacity>
);

/* ===== Card ===== */
const CardPedomanAlbuni: ExplainAdapter = {
  id: "pedoman-albuni-planet-hours",
  label: "Pedoman al-Būnī — Jam Planet (Chaldean)",
  render() {
    // Kawalan mod & lokasi
    const [mode, setMode] = useState<"falak" | "classic">("falak"); // default Falak
    const [lat, setLat] = useState<string>("3.139");     // Kuala Lumpur
    const [lon, setLon] = useState<string>("101.6869");
    const tzHours = 8; // Malaysia

    // Auto refresh
    const [, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(x => x + 1), 30_000); return () => clearInterval(id); }, []);

    const d = nowMY();
    const hh = pad2(d.getHours()), mm = pad2(d.getMinutes());
    const mins = d.getHours()*60 + d.getMinutes();

    // Nama hari ikut mod:
    const dayIndexClassic = (d.getHours() >= 18) ? (d.getDay()+1)%7 : d.getDay();

    const result = useMemo(() => {
      if (mode === "falak") {
        const { hourIndex, planet, sunrise, sunset, isDay, dayIndexBySunrise, dayHour, nightHour } =
          planetNowFalak(d, parseFloat(lat || "0"), parseFloat(lon || "0"), tzHours);
        return { hourIndex, planet, sunrise, sunset, isDay, dayIndex: dayIndexBySunrise, dayHour, nightHour };
      } else {
        const { hourIndex, planet } = planetNowClassic(dayIndexClassic, mins);
        // anggar sunrise 06:00 & sunset 18:00 untuk paparan
        return { hourIndex, planet, sunrise: 6*60, sunset: 18*60, isDay: mins>=6*60 && mins<18*60, dayIndex: dayIndexClassic, dayHour: 60, nightHour: 60 };
      }
    }, [mode, lat, lon, d.getMinutes()]);

    const warna: Warna = planetColor[result.planet];
    const formatHM = (m:number)=> `${pad2(Math.floor(m/60))}:${pad2(Math.round(m%60))}`;

    // Bina jadual 6 jam ke depan
    const schedule = useMemo(() => {
      const rows: { label: string; planet: Planet; warna: Warna }[] = [];
      let curIdx = result.hourIndex;
      let cursorMin = (mode==="falak")
        ? (result.isDay ? (result.sunrise + (result.dayHour* (curIdx))) : (result.sunset + (result.nightHour*(curIdx-12))))
        : (6*60 + 60*curIdx);

      for (let k=0;k<6;k++){
        const p = hourPlanet(result.dayIndex, curIdx);
        const dur = (mode==="falak") ? (curIdx<12?result.dayHour:result.nightHour) : 60;
        const start = ((cursorMin%1440)+1440)%1440;
        const end = ((cursorMin + dur)%1440+1440)%1440;
        rows.push({ label: `${formatHM(start)}–${formatHM(end)}`, planet: p, warna: planetColor[p] });
        cursorMin += dur;
        curIdx = (curIdx+1)%24;
      }
      return rows;
    }, [result, mode]);

    return (
      <Accordion title="Jam Planet (Chaldean)">
        {/* Pilihan mod & lokasi */}
        <Box alt>
          <Text style={{ color:"#e8e6e3", fontWeight:"800", marginBottom:6 }}>Mod & Lokasi</Text>
          <View style={{ flexDirection:"row", flexWrap:"wrap", marginBottom:8 }}>
            <Chip label="Falak 1/12 (Sunrise↔Sunset)" color="#4a8cff"
              active={mode==="falak"} onPress={()=>setMode("falak")} />
            <Chip label="Klasik 60 min" color="#ff9f43"
              active={mode==="classic"} onPress={()=>setMode("classic")} />
          </View>
          <View style={{ flexDirection:"row", gap:8 }}>
            <TextInput
              placeholder="Lat" placeholderTextColor="#777" keyboardType="numbers-and-punctuation"
              value={lat} onChangeText={setLat}
              style={{ flex:1, color:"#e8e6e3", borderColor:"#2a1230", borderWidth:1, borderRadius:8, padding:8 }}
            />
            <TextInput
              placeholder="Lon" placeholderTextColor="#777" keyboardType="numbers-and-punctuation"
              value={lon} onChangeText={setLon}
              style={{ flex:1, color:"#e8e6e3", borderColor:"#2a1230", borderWidth:1, borderRadius:8, padding:8 }}
            />
          </View>
          <Text style={{ color:"#9a9692", marginTop:6, fontSize:12 }}>
            *Default Kuala Lumpur (3.139, 101.6869). Tukar jika lokasi lain.
          </Text>
        </Box>

        {/* Status */}
        <Box>
          <Text style={{ color:"#e8e6e3", fontWeight:"800", marginBottom:6 }}>Status Sekarang</Text>
          <Row l="Mod" r={mode==="falak"?"Falak 1/12":"Klasik 60m"} />
          <Row l="Hari" r={["Ahad","Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu"][result.dayIndex]} />
          <Row l="Planet hari" r={DAY_PLANET[result.dayIndex]} />
          <Row l="Jam sekarang" r={`${hh}:${mm} (MY)`} />
          <Row l="Planet jam ini" r={result.planet} />
          <Row l="Warna" r={warna} c={colorHex[warna]} />
          <Text style={{ color:"#c9c6c2", marginTop:6 }}>• {label[warna]}</Text>
          <Text style={{ color:"#9a9692", marginTop:6, fontSize:12 }}>
            {mode==="falak"
              ? `Sunrise ${formatHM(result.sunrise)} · Sunset ${formatHM(result.sunset)} · Jam siang ≈ ${Math.round(result.dayHour)}m · Jam malam ≈ ${Math.round(result.nightHour)}m`
              : `Mod klasik: setiap jam = 60 min bermula 06:00`
            }
          </Text>
        </Box>

        {/* Jadual 6 jam akan datang */}
        <Box>
          <Text style={{ color:"#e8e6e3", fontWeight:"800", marginBottom:6 }}>6 Jam Seterusnya</Text>
          {schedule.map((x, i) => (
            <View key={i} style={{
              flexDirection:"row", justifyContent:"space-between",
              paddingVertical:6, borderBottomColor:"#2a0e14",
              borderBottomWidth: i < schedule.length-1 ? 1 : 0
            }}>
              <Text style={{ color:"#c9c6c2" }}>{x.label}</Text>
              <Text style={{ color: colorHex[x.warna], fontWeight:"700" }}>{x.planet} · {x.warna}</Text>
            </View>
          ))}
        </Box>
      </Accordion>
    );
  },
};

export default CardPedomanAlbuni;
