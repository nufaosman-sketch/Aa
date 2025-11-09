// app/components/VideoSlider.tsx
// Versi ringkas & stabil: auto-buka video pertama dalam modal WebView (autoplay).
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, ActivityIndicator, Platform, Linking } from "react-native";
import { WebView } from "react-native-webview";

type Video = { id: string; title?: string; thumb?: string };
type Props = {
  videos: Video[];
  title?: string;
  autoOpenFirst?: boolean;
};

export default function VideoSlider({ videos = [], title = "KAJIAN SAINS PURBA", autoOpenFirst = true }: Props) {
  const data = useMemo(() => (Array.isArray(videos) ? videos.filter(v => v?.id) : []), [videos]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const firstId = data?.[0]?.id;

  // Auto open first video on mount (if available)
  useEffect(() => {
    if (!autoOpenFirst) return;
    if (open || !firstId) return;
    setOpen(firstId);
  }, [autoOpenFirst, firstId, open]);

  const embedUrl = (id: string) =>
    `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

  return (
    <View style={s.wrap}>
      <Text style={s.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
        {data.map((v) => (
          <TouchableOpacity key={v.id} onPress={() => { setOpen(v.id); setLoading(true); }} style={s.thumbCard} activeOpacity={0.85}>
            {v.thumb ? (
              <Image source={{ uri: v.thumb }} style={s.thumbImg} />
            ) : (
              <View style={[s.thumbImg, s.thumbFallback]}><Text style={s.thumbTxt}>▶</Text></View>
            )}
            {v.title ? <Text numberOfLines={1} style={s.caption}>{v.title}</Text> : null}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!open} transparent animationType="fade" onRequestClose={() => setOpen(null)}>
        <View style={s.modalBg}>
          <View style={s.playerBox}>
            {loading && (
              <View style={s.loader}><ActivityIndicator /></View>
            )}
            {open ? (
              <WebView
                source={{ uri: embedUrl(open) }}
                style={s.web}
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled
                domStorageEnabled
                onLoadEnd={() => setLoading(false)}
                onError={() => setLoading(false)}
                userAgent={
                  Platform.select({
                    android: "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
                    ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
                    default: "Mozilla/5.0"
                  }) as string
                }
              />
            ) : null}
            <View style={s.btnRow}>
              <TouchableOpacity onPress={() => setOpen(null)} style={[s.btn, s.btnClose]}><Text style={s.btnText}>Tutup</Text></TouchableOpacity>
              {open ? (
                <TouchableOpacity onPress={() => Linking.openURL(`https://youtu.be/${open}`)} style={[s.btn, s.btnYT]}>
                  <Text style={s.btnText}>Buka di YouTube</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginTop: 10, marginBottom: 6 },
  title: { color: "#e6e6ff", fontSize: 12, fontWeight: "800", marginLeft: 4, marginBottom: 8 },
  row: { gap: 10, paddingHorizontal: 4 },
  thumbCard: { width: 120 },
  thumbImg: { width: 120, height: 68, borderRadius: 8, backgroundColor: "#120816" },
  thumbFallback: { alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#330044" },
  thumbTxt: { color: "#fff", fontWeight: "900", fontSize: 20 },
  caption: { color: "#cfc7ff", fontSize: 10, marginTop: 4 },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", alignItems: "center", justifyContent: "center", padding: 16 },
  playerBox: { width: "100%", maxWidth: 720, backgroundColor: "#0b0010", borderRadius: 12, borderWidth: 1, borderColor: "#400040", overflow: "hidden" },
  web: { width: "100%", height: 360, backgroundColor: "#000" },
  loader: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
  btnRow: { flexDirection: "row", gap: 8, padding: 10, borderTopWidth: 1, borderTopColor: "#2a0033", backgroundColor: "#14001a" },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  btnClose: { borderColor: "#550033", backgroundColor: "#220018" },
  btnYT: { borderColor: "#0055aa", backgroundColor: "#001b33" },
  btnText: { color: "#fff", fontWeight: "700" }
});
