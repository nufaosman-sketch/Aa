// app/components/ForensikHeader.tsx
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  compact?: boolean;
  title1?: string;
  title2?: string;
  title3?: string;
};

export default function ForensikHeader({
  compact = false,
  title1 = "Forensik Purba",
  title2 = "Belerang Merah",
  title3 = "AliNurulFalahMalika-World Publishing",
}: Props) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <LinearGradient
        colors={["#0f001a","#300036","#4b005a","#ff0044","#00ffff"]}
        locations={[0,0.3,0.6,0.85,1]}
        start={[0,0]}
        end={[1,1]}
        style={styles.wrap}
      >
        <View style={styles.glow} />
        <View style={styles.bar}>
          <View style={styles.logoWrap}>
          </View>

          {/* Semua teks MESTI dalam <Text> */}
          <View style={styles.texts}>
            <Text style={styles.title1} numberOfLines={1}>{title1}</Text>
            <Text style={styles.title2} numberOfLines={1}>{title2}</Text>
            <Text style={styles.title3} numberOfLines={1}>{title3}</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: "black" },
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: Platform.select({ ios: 12, android: 16, default: 12 }),
  },
  glow: {
    position: "absolute",
    left: 10, right: 10,
    top: Platform.select({ ios: 10, android: 12, default: 10 }),
    height: 72,                     // sedikit lebih besar
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#ff00ff",
    shadowOpacity: 0.8,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 0 },
    ...Platform.select({ android: { elevation: 6 } }),
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,           // tinggi sikit
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  logoWrap: {
    width: 42, height: 42, borderRadius: 12, overflow: "hidden",
  },
  texts: {
    flex: 1,
    alignItems: "center",          // center secara horizontal
    justifyContent: "center",
  },
  title1: {
    color: "#ffffff",
    fontSize: 15,                   // ikut permintaan
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "#ff00ff",
    textShadowRadius: 10,
  },
  title2: {
    color: "#00ffff",
    fontSize: 12.5,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "#00ccff",
    textShadowRadius: 8,
  },
  title3: {
    color: "#ffcccc",
    fontSize: 10.5,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 2,
    textShadowColor: "#ff0044",
    textShadowRadius: 6,
  },
});
