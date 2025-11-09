import * as React from "react";
import Svg, { Defs, LinearGradient, Stop, G, Path, Rect, Filter, FeGaussianBlur } from "react-native-svg";

/**
 * BMLogo — logo vector ringan (tanpa asset imej).
 * Gaya batu belerang abstrak dengan aura neon biru-emas.
 * Saiz boleh diubah melalui prop size.
 */
export default function BMLogo({ size = 40 }: { size?: number }) {
  const r = size;
  return (
    <Svg width={r} height={r} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#37D6FF"/>
          <Stop offset="50%" stopColor="#6CF1D6"/>
          <Stop offset="100%" stopColor="#FF3D6E"/>
        </LinearGradient>
        <LinearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="rgba(255,255,255,0.22)"/>
          <Stop offset="100%" stopColor="rgba(255,255,255,0.06)"/>
        </LinearGradient>
      </Defs>

      {/* plate glass rounded */}
      <Rect x="6" y="6" rx="18" ry="18" width="88" height="88" fill="rgba(255,255,255,0.08)" />
      <Rect x="6" y="6" rx="18" ry="18" width="88" height="88" stroke="url(#grad)" strokeWidth="2.5" fill="none" />

      {/* crystal core */}
      <G>
        <Path
          d="M50 22 L63 36 L58 58 L42 58 L37 36 Z"
          fill="url(#grad)"
        />
        <Path
          d="M50 30 L57 40 L54 54 L46 54 L43 40 Z"
          fill="rgba(255,255,255,0.18)"
        />
      </G>

      {/* subtle highlight */}
      <Rect x="10" y="10" rx="14" ry="14" width="80" height="22" fill="url(#glass)"/>
    </Svg>
  );
}
