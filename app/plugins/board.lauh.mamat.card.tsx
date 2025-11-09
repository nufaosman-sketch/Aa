import React from "react";
import { View, Text, ScrollView } from "react-native";
import Accordion from "../components/Accordion";

const LauhMamatBoardCard = {
  id: "lauh-mamat-board-card",
  label: "Papan Lauh Mamat",
  render: () => {
    const nums = Array.from({length:27},(_,i)=>i+28);
    return (
      <ScrollView style={{padding:12}}>
        <Accordion title="Papan Lauh al-Mamat (28–54)">
          <View style={{flexDirection:"row",flexWrap:"wrap"}}>
            {nums.map(n=>(
              <View key={n} style={{width:44,height:44,borderWidth:1,borderColor:"#2a2a2a",borderRadius:8,alignItems:"center",justifyContent:"center",margin:4}}>
                <Text style={{color:"#f25f5c",fontWeight:"800"}}>{n}</Text>
              </View>
            ))}
          </View>
        </Accordion>
      </ScrollView>
    );
  }
};

export default LauhMamatBoardCard;
