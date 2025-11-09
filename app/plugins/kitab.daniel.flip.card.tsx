// app/plugins/kitab.daniel.flip.card.tsx
// Kitab Nabi Danial — Flip (Standalone) [FORCE NEUTRAL TRANSFORM]
// - Pastikan kandungan tak terbalik (no mirror, no upside down).
// - RTL/Jawi auto, BM LTR.

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity, Animated, Easing,
  ScrollView, ImageBackground, Platform
} from "react-native";
import { kitabDanielCover, getPage, totalPages, Lang } from "../lib/kitab.daniel.pages";

const PARCHMENT_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

// Detect aksara Arab (U+0600–U+06FF)
const hasArabicChars = (t?: string) => !!t && /[\u0600-\u06FF]/.test(t);

const Btn = ({ onPress, children, disabled=false }: { onPress?: ()=>void; children: React.ReactNode; disabled?: boolean }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={{
    borderWidth: 1, borderColor: "#6b5b3e", backgroundColor: disabled ? "#d9ccb0" : "#cbb58a",
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, marginHorizontal: 6, opacity: disabled ? 0.6 : 1
  }}>
    <Text style={{ color: "#2c2416", fontWeight: "800" }}>{children}</Text>
  </TouchableOpacity>
);

const Header = ({ lang, setLang }: { lang: Lang; setLang: (l: Lang)=>void }) => (
  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
    <Text style={{ color: "#d4c6a8", fontSize: 16, fontWeight: "900" }}>Kitab Nabi Danial — Flip</Text>
    <View style={{ flexDirection: "row" }}>
      <Btn onPress={()=>setLang("ar")}>{lang === "ar" ? "AR ✓" : "AR"}</Btn>
      <Btn onPress={()=>setLang("ms")}>{lang === "ms" ? "MS ✓" : "MS"}</Btn>
    </View>
  </View>
);

// Perenggan dengan RTL auto (ikut kandungan)
function Para({ children }: { children?: string }) {
  const rtl = hasArabicChars(children);
  return (
    <Text
      style={{
        color: "#2c2416",
        fontSize: 18,
        lineHeight: 30,
        letterSpacing: 0.2,
        textAlign: rtl ? "right" : "left",
        writingDirection: rtl ? "rtl" : "ltr",
        includeFontPadding: false,
        textAlignVertical: "top",
        fontFamily: Platform.select({
          ios: "Geeza Pro",
          android: "sans-serif",
          default: undefined
        }),
        // Force neutral transform (tiada terbalik)
        transform: [{ rotate: "0deg" }, { rotateX: "0deg" }, { rotateY: "0deg" }, { scaleX: 1 }, { scaleY: 1 }],
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </Text>
  );
}

const PageBody = ({ lang, pageIndex }: { lang: Lang; pageIndex: number }) => {
  const isCover = pageIndex === 0;
  const body = isCover ? "" : getPage(pageIndex, lang);

  const coverTitle   = lang === "ar" ? kitabDanielCover.arTitle    : kitabDanielCover.msTitle;
  const coverSub     = lang === "ar" ? kitabDanielCover.arSubtitle : kitabDanielCover.msSubtitle;
  const coverTitleRTL = hasArabicChars(coverTitle);
  const coverSubRTL   = hasArabicChars(coverSub);

  return (
    <View
      style={{
        // wrapper yang memaksa neutral transform (sekiranya parent ada transform)
        transform: [{ rotate: "0deg" }, { rotateX: "0deg" }, { rotateY: "0deg" }, { scaleX: 1 }, { scaleY: 1 }],
        backfaceVisibility: "hidden",
      }}
    >
      <ImageBackground
        source={{ uri: PARCHMENT_URI }}
        style={{
          padding: 16,
          borderRadius: 16,
          overflow: "hidden",
          transform: [{ rotate: "0deg" }, { rotateX: "0deg" }, { rotateY: "0deg" }, { scaleX: 1 }, { scaleY: 1 }],
          backfaceVisibility: "hidden",
        }}
        imageStyle={{ borderRadius: 16 }}
      >
        {isCover ? (
          <View>
            <Text style={{
              color: "#2c2416", fontSize: 24, fontWeight: "900", textAlign: "center",
              writingDirection: coverTitleRTL ? "rtl" : "ltr",
              transform: [{ rotate: "0deg" }, { rotateX: "0deg" }, { rotateY: "0deg" }, { scaleX: 1 }, { scaleY: 1 }],
              backfaceVisibility: "hidden",
            }}>
              {coverTitle}
            </Text>
            <Text style={{
              color: "#2c2416", fontSize: 14, marginTop: 12, textAlign: "center",
              writingDirection: coverSubRTL ? "rtl" : "ltr",
              transform: [{ rotate: "0deg" }, { rotateX: "0deg" }, { rotateY: "0deg" }, { scaleX: 1 }, { scaleY: 1 }],
              backfaceVisibility: "hidden",
            }}>
              {coverSub}
            </Text>
            <View style={{ marginTop: 16 }}>
              {kitabDanielCover.notes.map((n, i)=>(
                <Text key={i} style={{ color: "#473b26", fontSize: 12, textAlign: "center" }}>• {n}</Text>
              ))}
            </View>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Para>{body}</Para>
          </ScrollView>
        )}
      </ImageBackground>
    </View>
  );
};

const SlideFade = ({ lang, pageIndex }: { lang: Lang; pageIndex: number }) => {
  // Animasi selamat (tiada flip)
  const slide = useRef(new Animated.Value(0)).current;
  const fade  = useRef(new Animated.Value(0)).current;

  useEffect(()=>{
    slide.setValue(20);
    fade.setValue(0);
    Animated.parallel([
      Animated.timing(slide, { toValue: 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(fade,  { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [pageIndex, lang]);

  return (
    <Animated.View style={{
      backgroundColor: "#d9c6a3",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "#b2976e",
      shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8,
      padding: 8,
      transform: [
        { translateX: slide },
        { rotate: "0deg" }, { rotateX: "0deg" }, { rotateY: "0deg" },
        { scaleX: 1 }, { scaleY: 1 },
      ],
      backfaceVisibility: "hidden",
      opacity: fade,
    }}>
      <PageBody lang={lang} pageIndex={pageIndex} />
    </Animated.View>
  );
};

const Shell = (p: { children: React.ReactNode }) => (
  <View style={{ padding: 12, backgroundColor: "#1a1712", flex: 1 }}>
    <View style={{ borderWidth: 1, borderColor: "#3a3123", padding: 10, borderRadius: 16, backgroundColor: "#efe3cc" }}>
      {p.children}
    </View>
  </View>
);

const CardKitabDanielFlipStandalone = {
  id: "kitab-daniel-flip-standalone",
  label: "Kitab Nabi Danial — Flip (Standalone)",
  render: () => {
    const [lang, setLang] = useState<Lang>("ar");
    const [pageIndex, setPageIndex] = useState(0); // 0 = kulit; 1..80

    const max = useMemo(()=> totalPages(), []);
    const canPrev = pageIndex > 0;
    const canNext = pageIndex < max;

    const prev = () => setPageIndex(p => Math.max(0, p - 1));
    const next = () => setPageIndex(p => Math.min(max, p + 1));

    return (
      <Shell>
        <Header lang={lang} setLang={setLang} />
        <SlideFade lang={lang} pageIndex={pageIndex} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          <Btn onPress={canPrev ? prev : undefined} disabled={!canPrev}>⬅️ Sebelumnya</Btn>
          <Text style={{ color: "#d4c6a8", alignSelf: "center" }}>
            {pageIndex === 0 ? "Kulit" : `Hal. ${pageIndex} / ${max}`}
          </Text>
          <Btn onPress={canNext ? next : undefined} disabled={!canNext}>Seterusnya ➡️</Btn>
        </View>
      </Shell>
    );
  }
};

export default CardKitabDanielFlipStandalone;
