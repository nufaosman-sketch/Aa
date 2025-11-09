// app/components/Accordion.tsx
// Accordion universal: serasi title/header/label, subtitle, defaultOpen, onToggle, children.
// Palet: ungu + merah + hitam, teks putih. Tanpa bergantung pada tema luar.

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  title?: string;
  header?: string;
  label?: string;
  subtitle?: string;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  children?: React.ReactNode;
  // fallback props lain dibiarkan supaya tak patah import
  [key: string]: any;
};

const palette = {
  bg: "#0b000d",
  card: "#1a001a",
  cardAlt: "#26001f",
  text: "#ffffff",
  textSub: "#d8b8d8",
  accent: "#ff0044",
  border: "#400040",
  glow: "#ff0044"
};

export default function Accordion(p: Props) {
  const title = p.title || p.header || p.label || "Seksyen";
  const subtitle = p.subtitle || "";
  const [open, setOpen] = useState(!!p.defaultOpen);

  useEffect(() => {
    if (typeof p.defaultOpen === "boolean") setOpen(!!p.defaultOpen);
  }, [p.defaultOpen]);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = !open;
    setOpen(next);
    p.onToggle?.(next);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity activeOpacity={0.9} onPress={toggle} style={styles.headerBtn}>
        <View style={styles.headerLeft}>
          <Ionicons name={open ? "remove" : "add"} size={18} color={palette.text} />
          <Text style={styles.headerText}> {title}</Text>
        </View>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={palette.text} />
      </TouchableOpacity>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {open ? <View style={styles.body}>{p.children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: palette.card,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 6,
    overflow: "hidden",
    shadowColor: palette.glow,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  headerBtn: {
    backgroundColor: palette.cardAlt,        // ⬅️ ganti hijau lama
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2d0026"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerText: {
    color: palette.text,                      // teks putih
    fontWeight: "700"
  },
  subtitle: {
    color: palette.textSub,
    fontSize: 12,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 4
  },
  body: {
    backgroundColor: palette.card,           // isi kad
    padding: 12
  }
});
