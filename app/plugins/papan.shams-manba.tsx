import React from "react";
import { View, Text } from "react-native";
import Accordion from "../components/Accordion";
import type { BoardAdapter, Input } from "../adapters/types";
import { safeBaki30 } from "./helpers";

const Box: React.FC<{children:any}> = ({children}) => (
  <View style={{backgroundColor:"#0f0a0b", borderRadius:12, padding:10, marginBottom:10, borderWidth:1, borderColor:"#251216"}}>
    {children}
  </View>
);

const Row: React.FC<{l:string; r:string|number}> = ({l,r}) => (
  <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:4}}>
    <Text style={{color:"#e8e6e3", opacity:.85}}>{l}</Text>
    <Text style={{color:"#ff4d57", fontWeight:"700"}}>{String(r)}</Text>
  </View>
);

const PapanShamsManba: BoardAdapter = {
  id: "papan-shams-manba",
  label: "Papan Hidup & Mati — Shams & Manbā",
  render(input: Input) {
    const bShD = safeBaki30(input.baki30, input.aDiri);
    const bShK = safeBaki30(input.baki30, input.aKeluarga);
    const dMan = input.aDiri + (input.bulanHijri||0);
    const kMan = input.aKeluarga + (input.bulanHijri||0);
    const bMd  = safeBaki30(input.baki30, dMan);
    const bMk  = safeBaki30(input.baki30, kMan);

    return (
      <Accordion title="Papan Hidup & Mati — Shams & Manbā">
        <Box>
          <Text style={{color:"#e8e6e3", fontWeight:"800", marginBottom:6}}>Shams (tanpa bulan)</Text>
          <Row l="Diri"      r={`${input.aDiri} • baki 30: ${bShD}`} />
          <Row l="Keluarga"  r={`${input.aKeluarga} • baki 30: ${bShK}`} />
        </Box>
        <Box>
          <Text style={{color:"#e8e6e3", fontWeight:"800", marginBottom:6}}>Manbā (dengan bulan)</Text>
          <Row l="Diri"      r={`${dMan} = ${input.aDiri} + bulan ${(input.bulanHijri||0)} • baki 30: ${bMd}`} />
          <Row l="Keluarga"  r={`${kMan} = ${input.aKeluarga} + bulan ${(input.bulanHijri||0)} • baki 30: ${bMk}`} />
        </Box>
      </Accordion>
    );
  }
};
export default PapanShamsManba;
