import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View, ViewStyle } from "react-native";

type Props = {
  overlay?: boolean;              // jadikan overlay (absolute) tanpa tolak layout
  topOffset?: number;             // jarak dari bawah (untuk overlay)
  speedMs?: number;               // kelajuan scroll (lebih besar = lebih perlahan)
  style?: ViewStyle;              // gaya tambahan (bukan overlay)
};

export default function DisclaimerTicker({
  overlay = true,
  topOffset = 6,
  speedMs = 42000,
  style,
}: Props) {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);

  const text1 =
    "🌿 Al-Hayāt — papan kehidupan & ilmu. Jika jatuh pada Lauh al-Hayāt, gunakan ilmu dan kekuatan untuk memberi manfaat, bukan kebanggaan diri.";
  const text2 =
    "🔥 Al-Mamāt — papan penyucian ruh. Jika jatuh pada Lauh al-Mamāt, bukan celaka; anda sedang dipilih untuk disucikan melalui ujian supaya naik martabat di sisi Allah.";

  useEffect(() => {
    if (!width) return;
    const loop = (a: Animated.Value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(a, { toValue: 1, duration: speedMs, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(a, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
    const l1 = loop(anim1); l1.start();
    const l2 = loop(anim2); l2.start();
    return () => { l1.stop(); l2.stop(); };
  }, [width, speedMs]);

  const tX1 = anim1.interpolate({ inputRange: [0, 1], outputRange: [0, -width] });
  const tX2 = anim2.interpolate({ inputRange: [0, 1], outputRange: [-width, 0] });

  const containerBase: ViewStyle = overlay
    ? {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: topOffset,
        zIndex: 40,
        pointerEvents: "none",     // tak block sentuhan pada slider
        paddingHorizontal: 10,
      }
    : { paddingVertical: 8, paddingHorizontal: 10 };

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[containerBase, style]}
    >
      {/* Baris 1: Al-Hayāt */}
      <Animated.View style={{ flexDirection: "row", transform: [{ translateX: tX1 }] }}>
        <Text
          style={{
            color: "#f5d58a",
            fontSize: 12,
            textShadowColor: "rgba(0,0,0,0.6)",
            textShadowRadius: 3,
            width: width * 2,
          }}
        >
          {text1}   •   {text1}
        </Text>
      </Animated.View>

      {/* Baris 2: Al-Mamāt */}
      <Animated.View style={{ flexDirection: "row", transform: [{ translateX: tX2 }], marginTop: 2 }}>
        <Text
          style={{
            color: "#ffc4a8",
            fontSize: 12,
            textShadowColor: "rgba(0,0,0,0.6)",
            textShadowRadius: 3,
            width: width * 2,
          }}
        >
          {text2}   •   {text2}
        </Text>
      </Animated.View>
    </View>
  );
}
