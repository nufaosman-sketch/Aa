import React from "react";
import { View, Text, ScrollView } from "react-native";
import Accordion from "../components/Accordion";

const LauhHayahBoardCard = {
  id: "lauh-hayah-board-card",
  label: "Papan Lauh Hayah",
  render: () => {
    const nums = Array.from({length:27},(_,i)=>i+1);
    return (
      <ScrollView style={{padding:12}}>
        <Accordion title="Papan Lauh al-Hayah (1–27)">
          <View style={{flexDirection:"row",flexWrap:"wrap"}}>
            {nums.map(n=>(
              <View key={n} style={{width:44,height:44,borderWidth:1,borderColor:"#2a2a2a",borderRadius:8,alignItems:"center",justifyContent:"center",margin:4}}>
                <Text style={{color:"#7bd88f",fontWeight:"800"}}>{n}</Text>
              </View>
            ))}
          </View>
        </Accordion>
      </ScrollView>
    );
  }
};

export default LauhHayahBoardCard;
