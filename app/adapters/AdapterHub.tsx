import React from "react";
import { View } from "react-native";
import { ExplainAdapters, BoardAdapters } from "./registry";
import type { Input, Theme } from "./types";

type Props = Input & { theme?: Theme };

export default function AdapterHub(props: Props) {
  const theme = props.theme ?? {};
  return (
    <View>
      {ExplainAdapters.map(A => <A.render key={A.id} {...props} theme={theme} />)}
    </View>
  );
}
