import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import ForensikHeader from "./components/ForensikHeader";
import VideoSlider from "./components/VideoSlider";

/**
 * Layout asal dengan frame merah gelap dan YouTube video slider dikekalkan.
 */
export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:"#0b000d" }}>
      <View style={styles.frame}>
        <View style={styles.innerVignette} pointerEvents="none" />

        {/* === Header + Video Slider === */}
        <ForensikHeader />
        <VideoSlider autoOpenFirst={true}
          title="KAJIAN SAINS PURBA"
          videos={[
            "https://youtu.be/AeTt9aEzxxg?si=3WPdMsHCbsmLZOAv",
            "https://youtu.be/zG8-TVjbCxw?si=1dQt3VUPP4mZXG5h",
          ]}
        />

        {/* === Stack Screen === */}
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  frame: {
    elevation: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    shadowOpacity: 0.25,
    shadowColor: "#ff0044",
    overflow: "hidden",
    borderColor: "#400040",
    borderWidth: 2,
    borderRadius: 16,
    marginVertical: 10,
    marginHorizontal: 12,
    backgroundColor: "#1a001a",
    flex: 1,
  },
  innerVignette: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 16,
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderColor:"rgba(0,0,0,0.35)",
  },
});
