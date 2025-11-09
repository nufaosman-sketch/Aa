// app/plugins/card.zaman.peralihan.standalone.tsx
// Satu kad tertutup (collapsible) — Rasulullah ﷺ × Abu Maʿshar (1H→1920H) — versi neutral klasik

import React from "react";
import { ScrollView, Text, View, StyleSheet, Platform } from "react-native";
import Accordion from "../components/Accordion";

const P = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.text}>{children}</Text>
);
const Strong = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.strong}>{children}</Text>
);
const Mono = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.mono}>{children}</Text>
);

export default {
  id: "zaman-peralihan-1-1920h-single-collapsed",
  label: "Jadual Gabungan — (Single, Collapsible)",
  render: function OneClosedCard() {
    return (
      <ScrollView style={s.wrap} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Satu Accordion SAHAJA. Default tertutup (tiada initialOpen). */}
        <Accordion title="Jadual Gabungan — Rasulullah ﷺ KajianBelerangMerah (1H → 1920H)">
          <View style={s.block}>
            <Text style={s.h1}>Ringkasan Kronologi</Text>
            <Mono>
{`[🔥 1–240H] Wahyu & Kebangkitan
[🜃 241–480H] Struktur & Pembinaan
[🌬 481–720H] Akal & Penyebaran
[💧 721–960H] Roh & Pembersihan
[🔥 961–1200H] Kebangkitan Baru
[🜃 1201–1440H] Materialisme
[🌬 1441–1500H] Peralihan Ilmu & Jiwa
→ [💧 1501–1920H] Penyucian Besar`}
            </Mono>
            <P style={{marginTop:8}}>
              Gabungan pandangan <Strong>wahyu</Strong> (hadis-hadis akhir zaman) dengan model kitaran
              <Strong> 960 tahun ASTROLOGIPURBA</Strong>. Untuk pembelajaran — <Strong>bukan</Strong> penetapan tarikh kiamat.
            </P>
          </View>

          <Section title="🔥 1–240H — Wahyu & Kebangkitan">
            <P>Zaman Rasulullah ﷺ dan Khulafā’ Rāsyidīn; cahaya agama memakmurkan umat.</P>
            <P><Strong>BELERANGMERAH:</Strong> Unsur Api — nyalaan pertama tamadun.</P>
          </Section>

          <Section title="🜃 241–480H — Struktur & Pembinaan">
            <P>Syariat, fiqh dan pemerintahan disusun; kota ilmu berdiri.</P>
            <P><Strong>BELERANGMERAH:</Strong> Tanah — pembentukan struktur dan kestabilan.</P>
          </Section>

          <Section title="🌬 481–720H — Akal & Penyebaran">
            <P>Perkembangan ilmu, falsafah dan tasawuf; pusat-pusat ilmu memimpin dunia.</P>
            <P><Strong>BELERANGMERAH:</Strong> Udara — peredaran ilmu dan komunikasi.</P>
          </Section>

          <Section title="💧 721–960H — Roh & Pembersihan">
            <P>Perpecahan kuasa tetapi pengukuhan tazkiyah dan jalan rohani.</P>
            <P><Strong>BELERANGMERAH:</Strong> Air — penyucian dan pemulihan.</P>
          </Section>

          <Section title="🔥 961–1200H — Kebangkitan Baru">
            <P>Gelombang semangat baharu; kemunculan kuasa besar Timur.</P>
            <P><Strong>BELERANGMERAH:</Strong> Api (ulang) — nyala kebangkitan semula.</P>
          </Section>

          <Section title="🜃 1201–1440H — Materialisme">
            <P>Penekanan pada benda, struktur dan sistem duniawi.</P>
            <P><Strong>BELERANGMERAH:</Strong> Tanah (ulang) — peneguhan bentuk dan aturan.</P>
          </Section>

          <Section title="🌬 1441–1500H — Peralihan Ilmu & Jiwa">
            <P>Isyarat akhir zaman semakin jelas: ilmu berkurang dari ahlinya, fitnah berleluasa, manusia mencari makna.</P>
            <P><Strong>BELERANGMERAH:</Strong> Udara — kembali menguat: peredaran pengetahuan dan gerak jiwa.</P>
          </Section>

          <Section title="💧 1501–1920H — Penyucian Besar">
            <P>Pengakhiran kitaran lama melalui pembersihan menyeluruh; kembali kepada keadilan dan pemulihan.</P>
            <P><Strong>BELERANGMERAH:</Strong> Air — penutupan zaman dan persiapan kebangkitan seterusnya.</P>
          </Section>

          <View style={[s.block, {marginTop:6}]}>
            <Text style={s.h1}>Nota Kaedah</Text>
            <P>Roda unsur: Api → Tanah → Udara → Air (ulang). 960 tahun ≈ perubahan tamadun; 240 tahun ≈ sub-fasa.</P>
            <P>“Penyucian Besar” ≠ kiamat; ia penutupan zaman lama. Tarikh kiamat hakiki hanya Allah yang mengetahui.</P>
          </View>
        </Accordion>
      </ScrollView>
    );
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.block}>
      <Text style={s.h2}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 12 },
  h1: { color: "#fff", fontSize: 16, fontWeight: "800", marginBottom: 6 },
  h2: { color: "#ffd166", fontSize: 15, fontWeight: "800", marginBottom: 4 },
  block: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  text: { color: "#e8e6e3", fontSize: 14, lineHeight: 20 },
  strong: { fontWeight: "800", color: "#ffd166" },
  mono: {
    fontFamily: Platform.OS === "android" ? "monospace" : undefined,
    backgroundColor: "rgba(255,255,255,0.07)",
    padding: 8,
    borderRadius: 8,
    color: "#e8e6e3",
    lineHeight: 20,
  },
});
